class SearchButton extends HTMLElement {
  constructor() {
    super();
    this.button = this.querySelector("button") || document.createElement("button");
    this.type = "button";
    this.className = this.getAttribute("class") || "search-button";
    this.width = this.getAttribute("width") || "100%";
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("modal-trigger", {
          bubbles: true,
          composed: true,
          detail: { modal: "app-search" },
        })
      );
    });

    window.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key == "k") {
        event.preventDefault();
        this.dispatchEvent(
          new CustomEvent("modal-trigger", {
            bubbles: true,
            composed: true,
            detail: { modal: "app-search" },
          })
        );
      }
    });
  }

  render() {
    this.button.setAttribute("type", this.type);
    this.button.setAttribute("class", this.className);
    this.button.style.width = this.width;
    this.button.innerHTML = `
   
  <i class="fa-solid fa-magnifying-glass"></i>
  <span>Search</span>
  <div class="shortcut">
  <span>Ctrl</span><span>K</span>
  </div>
  `;

    if (!this.contains(this.button)) {
      this.appendChild(this.button);
    }

    this.removeAttribute("label");
    this.removeAttribute("type");
    this.removeAttribute("width");
    this.removeAttribute("class");
  }
}

customElements.define("app-search", SearchButton);
