class Input extends HTMLElement {
  constructor() {
    super();
    this.labelText = this.getAttribute("labelText") || "Text";
    this.type = this.getAttribute("type") || "text";
    this.setAttribute("class", "input-container");
    this.width = this.getAttribute("width") || "100%";
    this.name = this.getAttribute("name") || "";
    this.input = this.querySelector("input") || document.createElement("input");
    this.label = this.querySelector("label") || document.createElement("label");
  }
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }
  setupEventListeners() {}
  render() {
    this.label.textContent = this.labelText;
    this.label.setAttribute("for", this.name);

    this.input.setAttribute("type", this.type);
    this.input.setAttribute("name", this.name);
    this.input.setAttribute("id", this.name);
    this.input.style.width = this.width;

    this.removeAttribute("labelText");
    this.removeAttribute("name");
    this.removeAttribute("type");
    this.removeAttribute("width");
    if (!this.contains(this.label)) {
      this.appendChild(this.label);
    }
    if (!this.contains(this.input)) {
      this.appendChild(this.input);
    }
  }
}

customElements.define("app-input", Input);
