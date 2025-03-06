import { useAuthentication } from "../../../src/utils/auth.module.js";

class UserButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const userButtonIcon = this.querySelector(".fa-circle-user");
    const menu = this.querySelector(".menu");
    if (userButtonIcon) {
      userButtonIcon.addEventListener("click", (event) => {
        menu.classList.toggle("hidden");
      });
    }
    if (menu) {
      window.addEventListener("click", (event) => {
        if (!menu.classList.contains("hidden") && !this.contains(event.target)) {
          menu.classList.add("hidden");
        }
      });
    }

    const getStartedButton = this.querySelector("app-button");
    if (getStartedButton) {
      getStartedButton.addEventListener("click", () => {
        window.location.href = "/src/pages/Authentication/index.html";
      });
    }

    const logOutTab = this.querySelector(".log-out");
    if (logOutTab) {
      logOutTab.addEventListener("click", () => {
        useAuthentication().logout();
        this.innerHTML = `
        <app-button label="Get Started"></app-button>
        `;
        this.dispatchEvent(new CustomEvent("user-logged-out", { bubbles: true, composed: true }));
        this.setupEventListeners();
      });
    }
  }

  render() {
    const { isLoggedIn } = useAuthentication();

    this.innerHTML = ""; // Clear previous content

    if (isLoggedIn()) {
      this.innerHTML = `
                <li class="nav-link">
                    <i class="fa-solid fa-circle-user fa-2xl"></i>
                    <div class="menu hidden">
                        <div class="menu-item log-out">Log out</div>
                    </div>
                </li>
            `;
    } else {
      this.innerHTML = `
                <app-button label="Get Started"></app-button>
            `;
    }
  }
}

customElements.define("app-userbutton", UserButton);
