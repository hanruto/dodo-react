import {
  setComponentProps,
  createComponent,
  unmountComponent
} from './component'
import { setAttribute } from './dom'

export function isSameNodeType(node, vnode) {
  if (node.nodeType === 3 && typeof vnode === 'string') {
    return true
  } else {
    return node.nodeName.toLowerCase() === vnode && vnode.tag
  }
}

/**
 * @param {HTMLElemnet} dom 当前对比的dom树
 * @param {VNode} node dom树对应的vnode
 * @returns {HTMLElemnet} 更新后的dom
 */
export default function diff(dom, vnode, container) {
  // 对比文字
  let out = dom

  if (typeof vnode === 'boolean' || vnode === null || vnode === undefined) {
    vnode = ''
  }

  if (typeof vnode === 'number') {
    vnode = String(vnode)
  }

  if (typeof vnode === 'string') {
    out = diffString(dom, vnode)
  }

  // 对比dom节点
  if (typeof vnode.tag === 'string') {
    out = diffDOM(dom, vnode)
  }

  // 如果节点是个component实例
  if (typeof vnode.tag === 'function') {
    out = diffComponent(dom, vnode)
  }

  if (vnode.attrs) {
    diffAttributes(out, vnode.attrs)
  }

  if (vnode.children && vnode.children.length) {
    console.log(vnode)
    diffChildren(out, vnode.children)
  }

  if (container && out.parentNode !== container) {
    container.appendChild && container.appendChild(out)
  }

  return out
}

function diffAttributes(dom, attrs) {
  let oldAttrs = {}
  let newAttrs = attrs || {}

  if (dom && dom.attributes) {
    Array.from(dom.attributes).forEach(attr => {
      oldAttrs[attr.name] = attr.value
    })
  }

  for (let attr in oldAttrs) {
    if (!attr in newAttrs) {
      setAttribute(dom, attr, undefined)
    }
  }

  for (let attr in newAttrs) {
    if (newAttrs[attr] !== oldAttrs[attr]) {
      setAttribute(dom, attr, newAttrs[attr])
    }
  }
}

/**
 * @param {HTMLElement} dom dom节点
 * @param {Array[VNode]} vchildren vnode节点
 */
function diffChildren(dom, vchildren) {
  const notKeyedChildren = [] // 没有key的child
  const keyed = {} // 有key的child

  // 分离有key和没有key的child，因为如果有key的话，可以更加方便的对比
  Array.from(dom.childNodes).forEach(child => {
    if (child.key) {
      keyed[key] = children
    } else {
      notKeyedChildren.push(child)
    }
  })

  // 遍历所有vchildren
  if (vchildren && vchildren.length > 0) {
    vchildren.forEach((vchild, i) => {
      const key = vchild && vchild.key
      let findedChild

      if (key) {
        if (keyed[key]) {
          findedChild = keyed[key]
          keyed[key] = undefined
        }
      } else {
        notKeyedChildren.forEach((child, index) => {
          if (isSameNodeType(child, vchild)) {
            findedChild = child
            notKeyedChildren.splice(index, 1)
          }
        })
      }

      if (!findedChild) {
        findedChild = notKeyedChildren.shift()
      }

      diff(findedChild, vchild, dom)
    })
  }
}

function diffComponent(dom, vnode) {
  let out = dom
  let component = dom && dom._component

  if (component && component.constructor === vnode.tag) {
    out = setComponentProps(component, vnode.attrs)
    dom = component.base
  } else {
    if (component) {
      unmountComponent(component)
    }
    component = createComponent(vnode.tag)
    out = setComponentProps(component, vnode.attrs)
  }

  return out
}

function diffString(dom, vnode) {
  let out = dom
  if (dom && dom.nodeType === 3) {
    if (dom.nodeValue != vnode) {
      dom.nodeValue = vnode
    }
  } else {
    out = document.createTextNode(vnode)
    if (dom && dom.parentNode) {
      dom.parentNode.replaceChild(out, dom)
    }
  }
  return out
}

function diffDOM(dom, vnode) {
  let out = dom
  if (!dom || vnode.tag.toLowerCase() !== dom.nodeName.toLowerCase()) {
    out = document.createElement(vnode.tag)
    if (dom && dom.childNodes) {
      dom.childNodes.forEach(out.appendChild)
    }
    if (dom && dom.parnetNode) {
      dom.parnetNode.replaceChild(out, dom)
    }
  }
  return out
}
