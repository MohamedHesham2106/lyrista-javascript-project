class Button extends HTMLElement {
  constructor() {
    super();
    this.button = this.querySelector("button") || document.createElement("button");
    this.label = this.getAttribute("label") || "Submit";
    this.src = this.getAttribute("src") || "NoSource";
    this.type = this.getAttribute("type") || "button";
    this.className = this.getAttribute("class") || "primary-button";
    this.width = this.getAttribute("width") || "100%";
  }
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {}

  render() {
    this.button.setAttribute("type", this.type);
    this.button.setAttribute("class", this.className);
    this.button.style.width = this.width;



    if (!this.contains(this.button)) {
      this.appendChild(this.button);
    }

    /**
     * case 1: 
     *  if the user passed a "src" for an image it will be created in this button
     * 
     * case 2:
     * the button will have an inner label if the user passed it.
     * otherwise it will be "Submit" by default
     * 
     */
    if(this.src !== "NoSource"){
      this.img = this.querySelector('img') || document.createElement('img');
      this.img.setAttribute("id", "img-"+this.button.className);
      this.img.setAttribute("src",this.src);
      console.log(this)
      // this.button.textContent = this.img;
      // this.button.removeAttribute("textContent");
      this.button.appendChild(this.img);
    }else{

      this.button.textContent = this.label;
    }

    this.removeAttribute("label");
    this.removeAttribute("type");
    this.removeAttribute("width");
    this.removeAttribute("class");
    this.removeAttribute("src")
  }
}

customElements.define("app-button", Button);
