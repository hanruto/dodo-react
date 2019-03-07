import diff from './diff'

/**
 * @description 实例化组件
 * @param {function} Constructor vnode.tagName
 * @param {object} props vnode.attrs
 * @return {'import ../react/component'.instance} Constrcutor instance
 */
export function createComponent(Constructor, props) {
  let inst

  if (Constructor.prototype && Constructor.prototype.render) {
    inst = new Constructor()
  } else {
    inst = new Constructor()
    inst.constructor = Constructor
    inst.render = function() {
      return inst.constructor(props)
    }
  }

  return inst
}

/**
 * @description 渲染组件
 * @param {'import ../react/component'.instance} component
 * @return dom
 */
export function renderComponent(component, isForceUpdate) {
  const isUpdate = !!component.base

  let props = component.props,
    state = component.state,
    prevState = component.prevState || state,
    prevProps = component.prevProps || props

  if (component.constructor.getDerivedStateFromProps) {
    Object.assign(
      component.state,
      component.constructor.getDerivedStateFromProps(props, prevState)
    )
  }

  let skip = false
  let base = component.base

  if (isUpdate) {
    component.props = prevProps
    component.state = prevState
    if (
      !isForceUpdate &&
      component.shouldComponentUpdate &&
      component.shouldComponentUpdate(props, state) === false
    ) {
      skip = true
    }
    component.props = props
    component.state = state
  }

  if (!skip) {
    const vnode = component.render()
    base = diff(component.base, vnode, props)

    component.base = base
    component.base._component = component

    if (isUpdate) {
      component.componentDidUpdate &&
        component.componentDidUpdate(prevProps, prevState)
    } else {
      component.componentDidMount && component.componentDidMount()
    }

    component.prevProps = component.props
    component.prevState = component.state
  }

  return base
}

export function unmountComponent(component) {
  if (component.componentWillUnMount) {
    component.componentWillUnMount()
  }
  if (component.base && component.base.parnetNode) {
    component.base._component = null
    component.base.parnetNode.removeChild(component.base)
  }
}

export function setComponentProps(component, props) {
  component.props = props || {}
  return renderComponent(component)
}

const stateQueue = []
const renderQueue = []
export function enqueueSetState(stateChange, component) {
  if (stateQueue.length === 0) {
    Promise.resolve().then(flushComponent)
  }

  stateQueue.push({ stateChange, component })

  if (!renderQueue.includes(component)) {
    renderQueue.push(component)
  }
}

function flushComponent() {
  let item
  while ((item = stateQueue.shift())) {
    const { stateChange, component } = item

    if (!component.prevState) {
      component.prevState = Object.assign({}, component.state)
    }

    Object.assign(
      component.state,
      typeof stateChange === 'function'
        ? stateChange(component.prevState, component.props)
        : stateChange
    )

    component.prevState = component.state
  }

  let component
  while ((component = renderQueue.shift())) {
    renderComponent(component)
  }
}
