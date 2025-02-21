class Navbar extends HTMLElement{

    constructor(){
        super();
        this.header = this.querySelector('header') || document.createElement('header');
        this.header.classList.add('header');
    }

    connectedCallback(){
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener("scroll", () => {
          const navbar = this.querySelector(".header");
          if (window.scrollY > 0) {
            navbar.classList.add("scrolled");
          } else {
            navbar.classList.remove("scrolled");
          }
        });
        this.header.querySelector(".fa-circle-user").addEventListener("click", () => {
          const menu = this.header.querySelector(".menu");
          menu.classList.toggle("hidden");
        });
      }

    render(){
        const navbar = document.createElement('nav');
        navbar.classList.add('navbar');

        navbar.innerHTML = `
        <app-tooltip side="bottom" text="Welcome To Lyrista">
            <a href="/" class="logo">Lyrista</a>
        </app-tooltip>
            <ul class="nav-list">
                <li class="nav-link">
                <app-button label="Search"></app-button>
                </i>
                <li class="nav-link">
                    <i class="fa-solid fa-circle-user fa-2xl">
                </i>
                <div class="menu hidden">
                    <div class="menu-item">Log out</div>
                </div>
            </ul>
        `;
    
        if(!this.header.contains(navbar)){
            this.header.appendChild(navbar);
        }
        if(!this.contains(this.header)){
            this.appendChild(this.header);
        }
    }
};


customElements.define("app-navbar", Navbar);
