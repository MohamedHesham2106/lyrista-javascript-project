class Toast extends HTMLElement {
  constructor() {
    super();
    this.text = this.getAttribute("text") || "Notification";
    this.type = this.getAttribute("type") || "success";
    this.duration = parseInt(this.getAttribute("duration")) || 5000;
    this.timeoutId = null;
  }
  static get observedAttributes() {
    return ["text", "type", "duration"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.autoRemove();
  }

  setupEventListeners() {
    this.querySelector(".toast-close").addEventListener("click", () => {
      this.removeToast();
    });
  }

  autoRemove() {
    this.timeoutId = setTimeout(() => {
      this.removeToast();
    }, this.duration);
  }

  removeToast() {
    this.style.animation = "fadeOut 0.5s ease forwards";
    setTimeout(() => this.remove(), 5000);
  }
  render() {
    this.innerHTML = `
      <div class="toast toast-${this.type}">
        <span>${this.text}</span>
        <button class="toast-close">X</button>
        <div class="toast-progress" style="animation-duration: ${this.duration}ms;"></div>
      </div>
    `;
  }
}

customElements.define("app-toast-message", Toast);
