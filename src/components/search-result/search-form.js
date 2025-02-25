class SearchForm extends HTMLElement {
  connectedCallback() {
    this.isDropdownOpen = false;
    this.selectedOption = "Album";
    this.classList.add("search-form");
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = `
      <div class="search-wrapper">
        <div class="search-container">
          <input type="text" id="search-input" placeholder="What's playing in your head?">
          <button class="dropdown-toggle">
            <span class="selected-option">${this.selectedOption}</span>
            <span class="arrow">▼</span>
          </button>
        </div>
        <div class="dropdown-menu" style="display: none;">
          <div class="dropdown-item" data-value="Album">Album</div>
          <div class="dropdown-item" data-value="Track">Track</div>
        </div>
      </div>
      <div class="placeholder-container">
        <div class="music-note"><i class="fa-solid fa-music"></i><i class="fa-solid fa-headphones"></i></div>
        <p class="placeholder-text">
          <span>R</span><span>e</span><span>a</span><span>d</span><span>y</span>
          <span> </span><span>t</span><span>o</span>
          <span> </span><span>f</span><span>i</span><span>n</span><span>d</span>
          <span> </span><span>y</span><span>o</span><span>u</span><span>r</span>
          <span> </span><span>n</span><span>e</span><span>x</span><span>t</span>
          <span> </span><span>f</span><span>a</span><span>v</span><span>o</span><span>r</span><span>i</span><span>t</span><span>e</span>
          <span> </span><span>t</span><span>u</span><span>n</span><span>e</span><span>?</span>
        </p>
      </div>
    `;
  }

  setupEventListeners() {
    const dropdownToggle = this.querySelector(".dropdown-toggle");
    const dropdownMenu = this.querySelector(".dropdown-menu");
    const dropdownItems = this.querySelectorAll(".dropdown-item");
    const selectedOptionSpan = this.querySelector(".selected-option");
    const searchInput = this.querySelector("#search-input");
    const placeholderContainer = this.querySelector(".placeholder-container");

    dropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      this.isDropdownOpen = !this.isDropdownOpen;
      dropdownMenu.style.display = this.isDropdownOpen ? "block" : "none";
    });

    dropdownItems.forEach((item) => {
      item.addEventListener("click", () => {
        this.selectedOption = item.dataset.value;
        selectedOptionSpan.textContent = this.selectedOption;
        this.isDropdownOpen = false;
        dropdownMenu.style.display = "none";
      });
    });

    document.addEventListener("click", () => {
      this.isDropdownOpen = false;
      dropdownMenu.style.display = "none";
    });

    // Show/hide placeholder and search results when typing
    searchInput.addEventListener("input", () => {
      if (searchInput.value.trim() !== "") {
        placeholderContainer.style.display = "none";
        this.showSearchResults();
      } else {
        placeholderContainer.style.display = "flex";
        searchResults.innerHTML = "";
      }
    });
  }
}

customElements.define("app-search-form", SearchForm);
