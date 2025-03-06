import { useAuthentication } from "../../../src/utils/auth.module.js";

class UserButton extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  connectedCallback() {
    this.setupEventListeners();
  }
  disconnectedCallback() {
    this.querySelector(".fa-circle-user")?.removeEventListener("click", this.toggleMenu);
    window.removeEventListener("click", this.windowClickListener);
    this.querySelector("app-button")?.removeEventListener("click", this.redirectToAuth);
    this.querySelector(".log-out")?.removeEventListener("click", this.handleLogout.bind(this));
  }

  setupEventListeners() {
    this.querySelector(".fa-circle-user")?.addEventListener("click", () => {
      this.querySelector(".menu").classList.toggle("hidden");
    });

    window.addEventListener("click", (event) => {
      const menu = this.querySelector(".menu");
      if (menu && !menu.classList.contains("hidden") && !this.contains(event.target)) {
        menu.classList.add("hidden");
      }
    });

    this.querySelector("app-button")?.addEventListener("click", () => {
      window.location.href = "/src/pages/Authentication/index.html";
    });

    this.querySelector(".log-out")?.addEventListener("click", this.handleLogout.bind(this));
  }

  handleLogout() {
    useAuthentication().logout();
    this.render();
    this.dispatchEvent(new CustomEvent("user-logged-out", { bubbles: true, composed: true }));
    this.setupEventListeners(); // Rebind events after re-rendering
  }

  render() {
    const { isLoggedIn } = useAuthentication();
    this.innerHTML = isLoggedIn()
      ? `
          <li class="nav-link">
              <i class="fa-solid fa-circle-user fa-2xl"></i>
              <div class="menu hidden">
                  <div class="menu-item log-out">Log out</div>
              </div>
          </li>
        `
      : `<app-button label="Get Started"></app-button>`;
  }
}

customElements.define("app-userbutton", UserButton);
