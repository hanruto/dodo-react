export function renderComponent(component, isForceUpdate) {
  const isUpdate = !!component.base

  let props = component.props,
    prevState = component.state,
    prevProps = component.prevProps || props

  if (component.constructor.getDerivedStateFromProps) {
    Object.assign(
      component.state,
      component.constructor.getDerivedStateFromProps(props, prevState)
    )
  }

  let skip = false
  if (isUpdate) {
    if (
      !isForceUpdate &&
      component.shouldComponentUpdate &&
      component.shouldComponentUpdate(nextProps, nextState) === false
    ) {
      skip = true
    }
  }

  if (!skip) {
    const vnode = component.render()
    let base = diff(component.base, vnode, props)

    component.base = base
    component.base._component = component

    if (isUpdate) {
      component.componentDidUpdate &&
        component.componentDidUpdate(prevProps, prevState)
    } else {
      component.componentDidMount && component.componentDidMount()
    }

    component.prevProps = component.props
  }

  return base
}
