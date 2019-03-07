export function setAttribute(dom, attr, value) {
  let factAttr = attr,
    factValue = value

  if (attr === 'style') {
    factValue = ''
    let styleObj = value
    for (let key in styleObj) {
      factValue += `${key} : ${styleObj[key]}`
    }
  }

  if (attr === 'className') {
    factAttr = 'class'
  }

  if (/on([a-zA-Z]+)/.test(attr)) {
    const eventName = attr.match(/on([a-zA-Z]+)/)[1].toLowerCase()
    dom.addEventListener(eventName, value)
    return
  }

  if (attr === 'dangerouslySetInnerHTML') {
    dom.innerHTML = value && value.__html
    return
  }

  dom.setAttribute(factAttr, factValue)
}
