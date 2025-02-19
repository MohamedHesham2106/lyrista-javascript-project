class Input extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input") || document.createElement("input");
    this.label = this.querySelector("label") || document.createElement("label");
    this.labelText = this.getAttribute("labelText") || "withoutLabel";
    this.type = this.getAttribute("type") || "text";
    this.setAttribute("class", "input-container");
    this.width = this.getAttribute("width") || "100%";
    this.name = this.getAttribute("name") || "";

    if (!this.contains(this.label)) {
      this.appendChild(this.label);
    }
    if (!this.contains(this.input)) {
      this.appendChild(this.input);
    }
  }
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }
  setupEventListeners() {
    const input = this.querySelector("input");
    input.addEventListener("input", () => {
      console.log("Input changed");
    });
  }
  render() {
    this.label.textContent = this.labelText;
    this.label.setAttribute("for", this.name);

    this.input.setAttribute("type", this.type);
    this.input.setAttribute("name", this.name);
    this.input.setAttribute("id", this.name);
    this.input.style.width = this.width;
    /* 
    Check if the custom component user didn't enter label Text so, he don't need label
    and I will remove it
    */
    if(this.labelText === "withoutLabel"){
      this.removeChild(this.label);
    }

    this.removeAttribute("labelText");
    this.removeAttribute("name");
    this.removeAttribute("type");
    this.removeAttribute("width");
   
  }
}

customElements.define("app-input", Input);
