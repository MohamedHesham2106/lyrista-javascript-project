import { useFavorite } from "../../utils/favorite.module.js";

class Favorites extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setupTabs();
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
      });

      albumTab.addEventListener("click", () => {
        albumTab.classList.add("active");
        trackTab.classList.remove("active");
        albumsSection?.classList.remove("hidden");
        tracksSection?.classList.add("hidden");
      });
    }
  }

  render() {
    try {
      const { getFavorites } = useFavorite();
      const favorites = getFavorites();

      if (!favorites.albums && !favorites.tracks) {
        this.innerHTML = "<p>No favorites yet</p>";
        return;
      }

      this.innerHTML = `
        <div class="favorites-container">
          <div class="tabs">
            <button class="tab-button track-tab ${
              favorites.tracks?.length ? "active" : ""
            }">Tracks</button>
            <button class="tab-button album-tab ${
              !favorites.tracks?.length ? "active" : ""
            }">Albums</button>
          </div>
          
          <div class="tracks-section ${
            !favorites.tracks?.length ? "hidden" : ""
          }">
            ${this.renderSection("Tracks", favorites.tracks)}
          </div>
          
          <div class="albums-section ${
            favorites.tracks?.length ? "hidden" : ""
          }">
            ${this.renderSection("Albums", favorites.albums)}
          </div>
        </div>
      `;
    } catch (error) {
      console.error("Error fetching favorites:", error.message);
      this.innerHTML = "<p>Error loading favorites</p>";
    }
  }

  renderSection(title, items) {
    if (!items || items.length === 0) return "";

    return `
      <div class="results-container">
        ${items
          .map(
            (item) => `
          <div class="result-item">
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
