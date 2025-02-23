import { useAuthentication } from "../../../src/utils/auth.module.js";
import { useFetch } from "../../utils/fetch.module.js";

class UserButton extends HTMLElement {
  constructor() {
    super();
  }

  // async connectedCallback() {
  connectedCallback() {
    this.render();
    this.setupEventListeners();

    /** every 2 lines print the returned data from spotify API [FOR TESTING]
     * ===> uncomment [async connectedCallback()]
     * and ===> comment [connectedCallback]
     * before testing
     */

    // console.log("newReleases data from user button : ");
    // console.log(await useFetch().getNewReleases());

    // console.log("albums data from user button : ");
    // console.log(await useFetch().getAlbum("4aawyAB9vmqN3uQ7FjRGTy"));

    // console.log("tracks data from user button : ");
    // console.log(await useFetch().getTrack("11dFghVXANMlKmJXsNCbNl"));

    // console.log("search data from user button : ");
    // console.log( await useFetch().search( "remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis&typ","album"));
  }

  setupEventListeners() {
    const userButtonIcon = this.querySelector(".fa-circle-user");
    if (userButtonIcon) {
      userButtonIcon.addEventListener("click", (event) => {
        const menu = this.querySelector(".menu");
        menu.classList.toggle("hidden");
      });
    }

    window.addEventListener("click", (event) => {
      const menu = this.querySelector(".menu");
      if (!menu.classList.contains("hidden") && !this.contains(event.target)) {
        menu.classList.add("hidden");
      }
    });

    const getStartedButton = this.querySelector("app-button");
    if (getStartedButton) {
      getStartedButton.addEventListener("click", () => {
        window.location.href = "/src/pages/Authentication/index.html";
      });
    }

    const logOutTab = this.querySelector(".log-out");

    logOutTab.addEventListener("click", () => {
      useAuthentication().logout();
      this.innerHTML = `
       <app-button label="Get Started"></app-button>
      `;
    });
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
