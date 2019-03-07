import { enqueueSetState, renderComponent } from '../react-dom/component'

export default class Component {
  constructor(props = {}) {
    this.state = {}
    this.props = props
  }

  setState(state) {
    enqueueSetState(state, this)
  }

  forceUpdate() {
    renderComponent(this, true)
  }
}
