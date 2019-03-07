/**
 * @example
 * <h1> hello world </h1>
 * 可以通过jsx被转化为
 * createElement('h1', {id: 'greet'}, 'hello world')
 */
export default function createElement(tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children
  }
}
