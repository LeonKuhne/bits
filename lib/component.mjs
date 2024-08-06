export default class Component extends HTMLElement {
  static tag = 'fill-elem';

  create(path, data={}) { return Component.create(path, data) }
  static create(path, data={}) {
    const component = document.createElement(Component.tag)
    component.setAttribute('path', path)
    component.getData = () => data
    return component
  }

  set data(data) { this.getData = () => data }
  get data() { return this.getData ? this.getData() : null }

  connectedCallback() {
    this._parseName()
    if (!this.name) { this.innerHTML = 'Missing name attribute'; return }

    fetch(`components/${this.path}.html`).then(res => res.text()).then(async html => {
      this.innerHTML = html;
      this.querySelectorAll('style').forEach(style => this._postProcessStyle(style))
      this.querySelectorAll('script').forEach(async script => await this._postProcessScript(script))
    })
  }

  _postProcessStyle(style) {
    // create 'this' shortcut
    style.textContent = style.textContent.replace(/this/g, this.query())
  }

  async _postProcessScript(script) {
    const parent = script.parentNode
    const sections = [`// ${this.path}`]

    // extract code (alias 'this')
    let code = script.text.replace(/this/g, 'self')
    sections.push(`window.invokeFillComponent = async (self) => {${code}}`)

    // insert script 
    const newScript = document.createElement('script')
    newScript.text = sections.join('\n')
    parent.replaceChild(newScript, script)
    await window.invokeFillComponent(this) // call with 'this'
  }

  query(path=null) { return Component._query(path || this.path) }
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