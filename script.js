class Component extends HTMLElement {
  static tag = 'fill-elem';
  static create(name, data) {
    const component = document.createElement(Component.tag)
    component.setAttribute('name', name)
    component.setAttribute('data', data)
    return component
  }

  connectedCallback() {
    const nameValue = this.getAttribute('name')
    this.data = this.getAttribute('data')
    if (!nameValue) {
      this.innerHTML = 'Missing name attribute'
      return
    }
    fetch(`./components/${nameValue}.html`)
      .then(response => response.text())
      .then(html => {

        // update html
        this.innerHTML = html;

        // rerun css with 'this' shortcut replaced
        this.querySelectorAll('style').forEach(style => {
          style.textContent = style.textContent.replace(/this/g, `${Component.tag}[name=${nameValue}]`)
        })

        // run scripts manualy as they dont auto run
        this.querySelectorAll('script').forEach(script => {
          script.text = script.text.replace(/this/g, 'self') // replace 'this' with 'self'
          const newScript = document.createElement('script')
          newScript.text = `// components/${nameValue}.html (data: ${this.data})\n`
          newScript.text += `function invokeFillComponent(self) {${script.text}}`
          script.parentNode.replaceChild(newScript, script)
          invokeFillComponent(this) // call with 'this'
        })
      })
  }

  static find(name) { 
    return document.querySelector(`${Component.tag}[name=${name}]`) 
  }
}

customElements.define(Component.tag, Component)