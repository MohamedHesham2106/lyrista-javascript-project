import { useFavorite } from "../../utils/favorite.module.js";
class Favorites extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setupTabs();
  }
  disconnectedCallback() {
    this.querySelector(".track-tab")?.removeEventListener("click", this.handleTrackTabClick);
    this.querySelector(".album-tab")?.removeEventListener("click", this.handleAlbumTabClick);
  }

  setupTabs() {
    const trackTab = this.querySelector(".track-tab");
    const albumTab = this.querySelector(".album-tab");
    const tracksSection = this.querySelector(".tracks-section");
    const albumsSection = this.querySelector(".albums-section");

    if (trackTab && albumTab) {
      trackTab.addEventListener("click", () => {
        trackTab.classList.add("active");
        albumTab.classList.remove("active");
        tracksSection?.classList.remove("hidden");
        albumsSection?.classList.add("hidden");
        const { getFavorites } = useFavorite();
        this.setupFavoriteButtons(getFavorites().tracks, "tracks");
      });

      albumTab.addEventListener("click", () => {
        albumTab.classList.add("active");
        trackTab.classList.remove("active");
        albumsSection?.classList.remove("hidden");
        tracksSection?.classList.add("hidden");
        const { getFavorites } = useFavorite();
        this.setupFavoriteButtons(getFavorites().albums, "albums");
      });
    }
  }
  setupFavoriteButtons(data, type) {
    const { getFavorites, removeFavorite } = useFavorite();

    this.querySelectorAll(".fav-button").forEach((button) => {
      const tooltip = button.parentElement;
      let favorites;

      try {
        favorites = getFavorites();
      } catch (error) {
        console.error("Error fetching favorites:", error.message);
        favorites = { albums: [], tracks: [] };
      }

      if (!favorites[type]) favorites[type] = [];

      tooltip.setAttribute("text", "Remove from favorites");
      button.classList.add("active");

      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id");

        // Find and remove the correct item
        const itemToRemove = data.find((item) => item.spotifyUrl === id);
        if (!itemToRemove) return;

        removeFavorite(type, itemToRemove);

        // Remove from the DOM
        const resultItem = button.closest(".result-item");
        if (resultItem) {
          resultItem.remove();
        }

        this.showToast(`Removed "${itemToRemove.title}" from favorites`, "error");

        // Get the specific section
        const section = this.querySelector(`.${type}-section`);
        const remainingItems = section.querySelectorAll(".result-item").length;

        // If no items remain, replace with app-nofavorite
        if (remainingItems === 0) {
          section.innerHTML = `<app-nofavorite></app-nofavorite>`;
        }
      });
    });
  }

  showToast(message, type) {
    const toast = document.createElement("app-toast-message");
    toast.setAttribute("text", message);
    toast.setAttribute("type", type);
    toast.setAttribute("duration", "5000");

    document.body.appendChild(toast);
  }
  render() {
    try {
      const { getFavorites } = useFavorite();
      const favorites = getFavorites();

      if (!favorites.albums && !favorites.tracks) {
        this.innerHTML = "<app-nofavorite></app-nofavorite>";
        return;
      }

      this.innerHTML = `
        <div class="favorites-container">
          <div class="tabs">
            <button class="tab-button track-tab ${favorites.tracks?.length ? "active" : ""}">Tracks</button>
            <button class="tab-button album-tab ${!favorites.tracks?.length ? "active" : ""}">Albums</button>
          </div>

          <div class="tracks-section ${!favorites.tracks?.length ? "hidden" : ""}">
            ${this.renderSection("Tracks", favorites.tracks)}
          </div>

          <div class="albums-section ${favorites.tracks?.length ? "hidden" : ""}">
            ${this.renderSection("Albums", favorites.albums)}
          </div>
        </div>
      `;
      const activeTab = favorites.tracks?.length ? "tracks" : "albums";
      this.setupFavoriteButtons(favorites[activeTab], activeTab);
    } catch (error) {
      console.error("Error loading favorites:", error.message);
      this.innerHTML = "<app-nofavorite></app-nofavorite>";
    }
  }

  renderSection(title, items) {
    if (!items || items.length === 0) return `<app-nofavorite></app-nofavorite>`;

    return `
      <div class="results-container">
        ${items
          .map(
            (item) => `
          <div class="result-item">
           <app-tooltip>
                  <button class="fav-button" data-id="${item.spotifyUrl}">
                  <i class="fa-solid fa-heart"></i>
             </button>
             </app-tooltip>
            <img src="${item.image}" alt="${item.title}" class="result-image">
            <div class="result-info">
              <h3 class="result-name">${item.title}</h3>
              <p class="result-artist">${item.artist}</p>
            </div>
            <a href="${item.spotifyUrl}" target="_blank" class="spotify-button">
              <span class="spotify-button-text">Listen on Spotify</span>
              <i class="fa-brands fa-spotify spotify-button-icon"></i>
            </a>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }
}

customElements.define("app-favorites", Favorites);
