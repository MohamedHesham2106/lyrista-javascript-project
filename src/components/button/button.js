class Button extends HTMLElement {
  constructor() {
    super();
    this.label = this.getAttribute("label") || "Submit";
    this.type = this.getAttribute("type") || "button";
    this.className = this.getAttribute("class") || "primary-button";
    this.width = this.getAttribute("width") || "100%";
    this.button = this.querySelector("button") || document.createElement("button");
  }
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {}

  render() {
    this.button.textContent = this.label;
    this.button.setAttribute("type", this.type);
    this.button.setAttribute("class", this.className);
    this.button.style.width = this.width;

    this.removeAttribute("label");
    this.removeAttribute("type");
    this.removeAttribute("width");
    this.removeAttribute("class");

    if (!this.contains(this.button)) {
      this.appendChild(this.button);
    }
  }
}

customElements.define("app-button", Button);
