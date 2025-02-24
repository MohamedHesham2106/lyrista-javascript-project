import { useAuthentication } from "../../utils/auth.module.js";

class Hero extends HTMLElement {
  constructor() {
    super();
    this.buttonText = "Start Your Journey";
    this.buttonLink = "./src/pages/Authentication/index.html"; // Default link
  }

  connectedCallback() {
    this.render(); // Render first to ensure elements exist

    const { isLoggedIn } = useAuthentication();
    if (isLoggedIn()) {
      this.buttonText = "Go To Your Library";

      const button = this.querySelector(".hero-button");
      if (button) {
        button.removeAttribute("href"); // Remove href for modal trigger
        this.setupEventListeners(button);
      }
    }

    this.updateButton(); // Update button text dynamically
  }

  setupEventListeners(button) {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const customEvent = new CustomEvent("modal-trigger", {
        bubbles: true,
        composed: true,
        detail: { modal: "app-favorites" },
      });
      this.dispatchEvent(customEvent);
    });
  }

  updateButton() {
    const buttonTextElement = this.querySelector(".hero-button-text");
    if (buttonTextElement) {
      buttonTextElement.textContent = this.buttonText;
    }
  }

  render() {
    this.innerHTML = `
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Lyrista - Your Personal Music Universe</h1>
          <p class="hero-text">
            Dive into a world where your favorite tracks, albums, and playlists come together. 
            Experience your music like never before, anytime and anywhere.
          </p>
          <a href="${this.buttonLink}" class="hero-button">
            <span class="hero-button-text">${this.buttonText}</span>
            <i class="fa-solid fa-music hero-button-icon"></i>
          </a>
        </div>
      </section>
    `;
  }
}

customElements.define("app-hero", Hero);
