class SearchButton extends HTMLElement{
    constructor(){
        super();
        this.button = this.querySelector("button") || document.createElement("button");
        this.label = "Search";
        this.type = "button";
        this.className = this.getAttribute("class") || "primary-button";
        this.width = this.getAttribute("width") || "100%";
    }

    connectedCallback(){
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.addEventListener("click", () => {
          console.log("search button clicked");
          this.dispatchEvent(
            new CustomEvent("modal-trigger", { bubbles: true, composed: true, detail: { modal: "app-search" } })
          );
        });
      }

    render(){
        this.button.setAttribute("type", this.type);
        this.button.setAttribute("class", this.className);
        this.button.style.width = this.width;
        this.button.textContent = this.label;

        if(!this.contains(this.button)){
            this.appendChild(this.button);
        }


        console.log(this);

        this.removeAttribute("label");
        this.removeAttribute("type");
        this.removeAttribute("width");
        this.removeAttribute("class");
    }
}

customElements.define("app-search", SearchButton);