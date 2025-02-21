class Modal extends HTMLElement {
  constructor() {
    super();
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
    document.addEventListener("modal-trigger", () => this.open());
  }
  open() {
    this.querySelector(".modal").classList.add("show");
  }

  close() {
    this.querySelector(".modal").classList.remove("show");
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
