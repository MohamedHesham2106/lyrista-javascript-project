class Navbar extends HTMLElement {
  constructor() {
    super();
    this.header = this.querySelector("header") || document.createElement("header");
    this.header.classList.add("header");
    this.isMenuOpen = false;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Scroll event for scrolled class
    window.addEventListener("scroll", () => {
      if (window.scrollY > 0 || this.isMenuOpen) {
        this.header.classList.add("scrolled");
      } else {
        this.header.classList.remove("scrolled");
      }
    });

    // Hamburger menu click event
    const hamburger = this.querySelector(".hamburger-menu");
    if (hamburger) {
      hamburger.addEventListener("click", () => this.toggleMenu());
    }

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (this.isMenuOpen && !this.contains(event.target)) {
        this.toggleMenu();
      }
    });
  }

  toggleMenu() {
    const navList = this.querySelector(".nav-list");
    const navItems = this.querySelectorAll(".nav-item");
    this.isMenuOpen = !this.isMenuOpen;

    // Add/remove scrolled class based on menu state
    if (this.isMenuOpen) {
      this.header.classList.add("scrolled");
      navList.classList.add("active");
      navItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add("show");
        }, 100 * index);
      });
    } else {
      if (window.scrollY === 0) {
        this.header.classList.remove("scrolled");
      }
      navList.classList.remove("active");
      navItems.forEach((item) => {
        item.classList.remove("show");
      });
    }

    // Toggle hamburger icon
    const hamburgerIcon = this.querySelector(".hamburger-menu i");
    hamburgerIcon.classList.toggle("fa-bars");
    hamburgerIcon.classList.toggle("fa-times");
  }

  render() {
    this.header.innerHTML = `
      <nav class="navbar">
        <app-tooltip side="bottom" text="Welcome To Lyrista">
          <a href="/" class="logo">Lyrista</a>
        </app-tooltip>
        <ul class="nav-list">
          <li class="nav-item">
            <app-search></app-search>
          </li>
          <li class="nav-item">
            <app-userbutton></app-userbutton>
          </li>
        </ul>
        <div class="hamburger-menu">
          <i class="fas fa-bars"></i>
        </div>
      </nav>
    `;

    if (!this.contains(this.header)) {
      this.appendChild(this.header);
    }
  }
}

customElements.define("app-navbar", Navbar);
