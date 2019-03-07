import diff from './diff'

export default function render(vnode, container) {
  diff(null, vnode, container)
}
