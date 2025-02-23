import { useFavorite } from "../../utils/favorite.module.js";

class NewReleaseCard extends HTMLElement {
  constructor() {
    super();
    this.classList.add("new-release-card");
  }

  connectedCallback() {
    this.render();
  }

  setupEventListeners() {
    const favoriteButton = this.querySelector(".favorite-button");
    const tooltip = this.querySelector("app-tooltip");
    if (!favoriteButton || !tooltip) return;

    const { addFavorite, getFavorites, removeFavorite } = useFavorite();
    const album = {
      title: this.getAttribute("title"),
      artist: this.getAttribute("artist"),
      image: this.getAttribute("image"),
      releaseDate: this.getAttribute("release-date"),
      spotifyUrl: this.getAttribute("spotify-url"),
    };

    const favorites = getFavorites();
    const isFavorited = favorites.albums.some((fav) => fav.title === album.title && fav.artist === album.artist);

    // Set initial tooltip text
    tooltip.setAttribute("text", isFavorited ? "Remove from favorites" : `Add ${album.title} to favorites`);

    if (isFavorited) {
      favoriteButton.classList.add("active");
    }

    favoriteButton.addEventListener("click", (e) => {
      if (favoriteButton.classList.contains("active")) {
        removeFavorite("albums", album);
        favoriteButton.classList.remove("active");
        tooltip.setAttribute("text", `Add ${album.title} to favorites`);
      } else {
        addFavorite("albums", album);
        favoriteButton.classList.add("active");
        tooltip.setAttribute("text", "Remove from favorites");
      }
    });
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute("title") || "Unknown Album";
    const artist = this.getAttribute("artist") || "Unknown Artist";
    const image = this.getAttribute("image") || "../../../src/public/images/hero-bg.jpg";
    const releaseDate = this.getAttribute("release-date") || "Unknown Date";
    const spotifyUrl = this.getAttribute("spotify-url") || "#";

    this.innerHTML = `
      <div class="card">
        <app-tooltip>
          <button class="favorite-button">
            <i class="fa-solid fa-heart"></i>
          </button>
        </app-tooltip>
        <img src="${image}" alt="${title} by ${artist}">
        <div class="content">
          <h3>${title}</h3>
          <p class="artist">${artist}</p>
          <p class="release-date">Released: ${releaseDate}</p>
          <a href="${spotifyUrl}" target="_blank" rel="noopener noreferrer" class="spotify-link">
            <span class="spotify-link-text">Listen on Spotify</span>
            <i class="fa-brands fa-spotify spotify-link-icon"></i>
          </a>
        </div>
      </div>
    `;
    this.setupEventListeners();
  }
}

customElements.define("app-new-release-card", NewReleaseCard);
