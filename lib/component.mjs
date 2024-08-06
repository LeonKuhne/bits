export default class Component extends HTMLElement {
  static tag = 'fill-elem';

  create(path, data={}) { return Component.create(path, data) }
  static create(path, data={}) {
    const component = document.createElement(Component.tag)
    component.setAttribute('path', path)
    component.data = data
    return component
  }

  connectedCallback() {
    this._parseName()
    if (!this.name) { this.innerHTML = 'Missing name attribute'; return }

    fetch(`components/${this.path}.html`).then(res => res.text()).then(html => {
        this.innerHTML = html;

        // rerun css with 'this' shortcut replaced
        this.querySelectorAll('style').forEach(style => {
          style.textContent = style.textContent.replace(/this/g, this.query())
        })

        // run scripts manualy as they dont auto run
        this.querySelectorAll('script').forEach(script => {
          script.text = script.text.replace(/this/g, 'self') // replace 'this' with 'self'
          const newScript = document.createElement('script')
          newScript.text = `// ${this.path} (data: ${this.data})\n`
          newScript.text += `function invokeFillComponent(self) {${script.text}}`
          script.parentNode.replaceChild(newScript, script)
          invokeFillComponent(this) // call with 'this'
        })
      })
  }

  query() { return Component._query(this.path) }
  static _query(path) { return `${Component.tag}[name=${path.replace('/', '-')}]` }

  find(path) { return Component.find(path) }
  static find(path) { return document.querySelector(Component._query(path)) }

  _parseName() {
    this.path = this.getAttribute('path')
    const parts = this.path.split('/')
    this.setAttribute('name', parts.join('-'))
    this.name = parts.pop()
  }
}

customElements.define(Component.tag, Component)