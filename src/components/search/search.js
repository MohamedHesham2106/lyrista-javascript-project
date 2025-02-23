class SearchButton extends HTMLElement {
  constructor() {
    super();
    this.button =
      this.querySelector("button") || document.createElement("button");
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
      console.log("search button clicked");
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
        console.log("search button clicked by ctrl and k");
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
  <img
    class="search-button-icons"
    width="30"
    height="30"
    src="https://img.icons8.com/glyph-neue/64/search--v1.png"
    alt="search--v1"
  />
  Search
    <img
    class="search-button-icons"
    width="45"
    height="40"
    src="https://img.icons8.com/color/48/ctrl.png"
    alt="ctrl"
  />
  <img
    class="search-button-icons"
    width="45"
    height="40"
    src="https://img.icons8.com/color/48/k-key.png"
    alt="k-key"
  />
    `;

    if (!this.contains(this.button)) {
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
