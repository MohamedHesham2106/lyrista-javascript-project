import { useAuthentication } from "../../utils/auth.module.js";
class FavoriteButton extends HTMLElement {
  connectedCallback() {
    const { isLoggedIn } = useAuthentication();
    if (!isLoggedIn()) {
      this.style.display = "none";
    }
    this.setupEventListeners();
    this.render();
  }
  setupEventListeners() {
    this.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("modal-trigger", {
          bubbles: true,
          composed: true,
          detail: { modal: "app-favorites" },
        })
      );
    });
  }

  render() {
    this.innerHTML = `
      <button class="favorite-btn">
      <app-tooltip side="right" text="Your Favorites">
        <i class="fa-solid fa-compact-disc fa-4x"></i>
      </app-tooltip>
      </button>
    `;
  }
}
customElements.define("app-favorite-button", FavoriteButton);
