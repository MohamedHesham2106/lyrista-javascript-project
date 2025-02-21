class userButton extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const userButtonIcon = this.querySelector(".fa-circle-user");
        if (userButtonIcon) {
            userButtonIcon.addEventListener("click", () => {
                const menu = this.querySelector(".menu");
                menu.classList.toggle("hidden");
            });
        }

        const getStartedButton = this.querySelector("app-button");
        if (getStartedButton) {
            getStartedButton.addEventListener("click", () => {
                window.location.href = "/src/pages/Authentication/index.html";
            });
        }
       
    }

    render() {
        let isLogged = false;

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let item = JSON.parse(localStorage.getItem(key));
            console.log(`Key: ${key}, Item:`, item);
            for(let user of item){
                if (user.status === "loggedIn") {
                    isLogged = true;
                }

            }
            if (isLogged) {
                break;
            }
        }

        console.log(`isLogged: ${isLogged}`);

        this.innerHTML = ''; // Clear previous content

        if (isLogged === true) {
            this.innerHTML = `
                <li class="nav-link">
                    <i class="fa-solid fa-circle-user fa-2xl"></i>
                    <div class="menu hidden">
                        <div class="menu-item">Log out</div>
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

customElements.define("app-userbutton", userButton);