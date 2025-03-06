import { useAuthentication } from "../../utils/auth.module.js";

class Form extends HTMLElement {
  constructor() {
    super();

    this.formTitle = this.getAttribute("formTitle") || "login";
    this.classList.add("form-container");
  }

  connectedCallback() {
    // Redirect to home page if user is already logged in
    const { isLoggedIn } = useAuthentication();
    if (isLoggedIn()) {
      window.location.href = "/";
    }
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for the custom "toggle-form" event
    document.addEventListener("toggle-form", this.toggleForm);

    // Handle form submission
    this.querySelector("form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const formInputs = e.target.querySelectorAll("app-input > input");
      const errorMessage = this.querySelector(".error-message");
      errorMessage.innerHTML = "";
      errorMessage.classList.add("hidden");

      const data = {};
      formInputs.forEach((input) => {
        data[input.name] = input.value;
      });

      try {
        const { login, register } = useAuthentication();
        if (this.formTitle === "login") {
          login(data);
        } else {
          register(data);
          this.toggleForm();
          this.querySelector(".cd").click();
        }
      } catch (error) {
        errorMessage.classList.remove("hidden");
        errorMessage.innerHTML = error.message || "An unexpected error occurred.";
      }
    });

    const formLink = this.querySelector(".form-link");
    if (formLink) {
      formLink.addEventListener("click", this.toggleForm);
    }
  }

  disconnectedCallback() {
    document.removeEventListener("toggle-form", this.toggleForm);
    const form = this.querySelector("form");
    if (form) {
      form.removeEventListener("submit", this.handleSubmit);
    }
    const formLink = this.querySelector(".form-link");
    if (formLink) {
      formLink.removeEventListener("click", this.toggleForm);
    }
  }

  toggleForm = () => {
    this.formTitle = this.formTitle === "login" ? "register" : "login";
    this.render();
    this.setupEventListeners();
  };

  createForm(type) {
    const form = document.createElement("form");
    form.classList.add("form-wrapper");
    form.innerHTML = `
    <app-tooltip text="When CD is out try to click on it!">
    <app-cd type="${type === "register" ? "register" : "login"}"></app-cd>
    </app-tooltip>
      <div class="form-group">
       <div>
        <h2 class="form-title">${type === "login" ? "Login" : "Register"}</h2>
        <p class="error-message hidden"></p>
        </div>
        <div class="form-control">
          <app-input type="text" name="username" labelText="Username" required></app-input>
          <app-input type="password" name="password" labelText="Password" required></app-input>
        </div>

        <app-button type="submit" label="${type === "login" ? "Login" : "Register"}"></app-button>

        <p class="form-link">${
          type === "register"
            ? "Already have an account? <a>Login here.</a>"
            : "Don't have an account? <a>Register here.</a>"
        }</p>
      </div>
    `;
    return form;
  }

  render() {
    const existingForm = this.querySelector("form");
    if (existingForm) {
      existingForm.remove();
    }

    const newForm = this.createForm(this.formTitle);
    this.appendChild(newForm);
  }
}

customElements.define("app-form", Form);
