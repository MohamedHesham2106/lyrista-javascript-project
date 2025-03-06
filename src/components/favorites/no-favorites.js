class NoFavoriteApp extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {}

  render() {
    this.innerHTML = `
      <div class="no-favorites-container">
        <div class="no-favorites-icon">
          <i class="fa-solid fa-heart-crack"></i>
        </div>
        <h2 class="no-favorites-title">No Favorites Yet</h2>
        <p class="no-favorites-message">
          You haven't added any favorites yet. Discover and add your favorite music!
        </p>
      </div>
    `;
  }
}

customElements.define("app-nofavorite", NoFavoriteApp);
