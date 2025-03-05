class Modal extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.render();
  }

  connectedCallback() {
    this.querySelector(".close").addEventListener("click", () => this.close());
    this.querySelector(".modal").addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) this.close();
    });
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener("modal-trigger", (event) => {
      this.open();
      if (event.detail.modal === "app-favorites") {
        this.querySelector(".modal-body").innerHTML =
          "<app-favorites></app-favorites>";
      } else {
        this.querySelector(".modal-body").innerHTML =
          "<app-search-form></app-search-form>";
      }
    });
  }

  open() {
    this.isOpen = true;
    this.querySelector(".modal").setAttribute("open", "");
  }

  close() {
    this.isOpen = false;
    this.querySelector(".modal").removeAttribute("open");
  }

  render() {
    this.innerHTML = `
      <div class="modal">
        <div class="modal-content">
        <app-tooltip side="right" text="Close">
          <span class="close">&times;</span>
        </app-tooltip>
          <div class="modal-body">
            ${this.innerHTML}
          </div>
        </div>
      </div>`;
  }
}

customElements.define("app-modal", Modal);
