class CD extends HTMLElement {
  constructor() {
    super();
    this.classList.add("cd-cover");
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.querySelector(".cd-sleeve").addEventListener("click", this.toggleState);
    this.querySelector(".cd").addEventListener("click", (event) => {
      event.stopPropagation();
      this.changeForm();
    });
  }

  render() {
    const isRegister = this.getAttribute("type") === "register";

    const sleeveImage = isRegister ? "register-cover.jpg" : "login-cover.jpg";

    this.innerHTML = `
      <div class="cd-container">
        <div class="cd-sleeve" style="background-image: url('../../public/images/${sleeveImage}')"></div>
        <div class="cd"></div>
      </div>
    `;

    const cdSleeve = this.querySelector(".cd-sleeve");
    cdSleeve.setAttribute("state", "in");
    this.removeAttribute("state");
  }

  changeForm = () => {
    if (this.hasAttribute("disabled")) return;
    if (this.state === "out") {
      this.dispatchEvent(
        new CustomEvent("toggle-form", {
          bubbles: true,
          composed: true,
        })
      );

      // Toggle the type (switch images dynamically)
      const newType = this.getAttribute("type") === "register" ? "login" : "register";
      this.setAttribute("type", newType);
      this.render(); // Re-render to apply changes
    }
  };

  toggleState = () => {
    if (this.hasAttribute("disabled")) return;
    const cdSleeve = this.querySelector(".cd-sleeve");
    const newState = cdSleeve.getAttribute("state") === "out" ? "in" : "out";
    cdSleeve.setAttribute("state", newState);

    if (newState === "out") {
      this.querySelector(".cd").style.pointerEvents = "all";
    } else {
      this.querySelector(".cd").style.pointerEvents = "none";
    }

    this.state = newState;
  };
}

customElements.define("app-cd", CD);
