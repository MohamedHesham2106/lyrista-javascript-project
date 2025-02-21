class Button extends HTMLElement {
  constructor() {
    super();
    this.button = this.querySelector("button") || document.createElement("button");
    this.label = this.getAttribute("label") || "Submit";
    this.type = this.getAttribute("type") || "button";
    this.className = this.getAttribute("class") || "primary-button";
    this.width = this.getAttribute("width") || "100%";
  }
  connectedCallback() {
    this.render();
  }

  render() {
    this.button.setAttribute("type", this.type);
    this.button.setAttribute("class", this.className);
    this.button.style.width = this.width;

    if (!this.contains(this.button)) {
      this.appendChild(this.button);
    }

    this.button.textContent = this.label;

    this.removeAttribute("label");
    this.removeAttribute("type");
    this.removeAttribute("width");
    this.removeAttribute("class");
  }
}

customElements.define("app-button", Button);
