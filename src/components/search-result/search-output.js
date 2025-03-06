import { useAuthentication } from "../../utils/auth.module.js";
import { useFavorite } from "../../utils/favorite.module.js";
import { useFetch } from "../../utils/fetch.module.js";

class SearchOutput extends HTMLElement {
  constructor() {
    super();
    this.type = this.getAttribute("type");
    this.query = this.getAttribute("query");
    this.classList.add("search-output-container");
    this.status = "idle";
  }

  static get observedAttributes() {
    return ["query", "type"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
      this.render();
      if (this.query) {
        this.fetchUserInput(this.query);
      }
    }
  }
  // Fetch user input
  async fetchUserInput(query) {
    if (!query) return;

    const { search } = useFetch();

    try {
      this.status = "searching";
      this.updateStatus();

      const response = await search(query, this.type.toLowerCase());

      const typeKey = this.type.toLowerCase() + "s";
      const results = response[typeKey]?.items || [];

      // check if the response is an array
      if (!Array.isArray(results)) {
        console.error("Unexpected response structure:", response);
        this.status = "error";
        this.updateStatus();
        return;
      }
      // make sure the item has a name
      const filteredResults = results.filter((item) => item.name);

      this.status = filteredResults.length > 0 ? "results" : "no-results";
      this.displayResults(filteredResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
      this.status = "error";
      this.updateStatus();
    }
  }

  updateStatus() {
    const statusElement = this.querySelector(".search-status");
    if (statusElement) {
      switch (this.status) {
        case "searching":
          statusElement.innerHTML = `
          <div class="loading-container">
          <app-loader></app-loader> Searching for "${this.query}" in ${this.type}...
          </div>
          `;

          break;
        case "no-results":
          statusElement.textContent = `No results found for "${this.query}" in ${this.type}.`;
          break;
        case "error":
          statusElement.textContent = "An error occurred while searching. Please try again.";
          break;
        default:
          statusElement.textContent = "";
      }
    }
  }

  displayResults(data) {
    this.innerHTML = `
      <p class="search-status"></p>
      <div class="results-container">
        ${data
          .map((item) => {
            const imageUrl =
              this.type.toLowerCase() === "track" ? item.album?.images?.[0]?.url || "" : item.images?.[0]?.url || "";

            const artistName =
              this.type.toLowerCase() === "track"
                ? item.artists?.[0]?.name || "Unknown Artist"
                : item.artists?.[0]?.name || "Unknown Artist";

            const spotifyUrl =
              this.type.toLowerCase() === "track"
                ? item.album?.external_urls?.spotify || "#"
                : item.external_urls?.spotify || "#";

            return `
              <div class="result-item">
                <app-tooltip>
                  <button class="fav-button">
                    <i class="fa-solid fa-heart"></i>
                  </button>
                </app-tooltip>
                <img src="${imageUrl}" alt="${item.name}" class="result-image" loading="lazy">
                <div class="result-info">
                  <h3 class="result-name">${item.name}</h3>
                  <p class="result-artist">${artistName}</p>
                </div>
                <a href="${spotifyUrl}" target="_blank" class="spotify-button">
                  <span class="spotify-button-text">Listen on Spotify</span>
                  <i class="fa-brands fa-spotify spotify-button-icon"></i>
                </a>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
    this.updateStatus();
    this.setupFavoriteButtons(data);
  }

  setupFavoriteButtons(data) {
    const { isLoggedIn } = useAuthentication();
    const { addFavorite, getFavorites, removeFavorite } = useFavorite();
    const type = this.type.toLowerCase() + "s";

    this.querySelectorAll(".fav-button").forEach((button, index) => {
      const item = data[index];
      const tooltip = button.parentElement;

      if (!isLoggedIn()) {
        button.addEventListener("click", () => {
          window.location.href = "./src/pages/Authentication/index.html";
        });
        tooltip.setAttribute("text", "Login to add to favorites");
      } else {
        let favorites;
        try {
          favorites = getFavorites();
        } catch (error) {
          console.error("Error fetching favorites:", error.message);
          // Default empty state
          favorites = { albums: [], tracks: [] };
        }
        // Ensure type exists in favorites
        if (!favorites[type]) favorites[type] = [];

        // Create favorite item
        const favoriteItem = {
          title: item.name,
          artist: item.artists?.[0]?.name || "Unknown Artist",
          image: item.images?.[0]?.url || item.album?.images?.[0]?.url,
          releaseDate: item.release_date || item.album?.release_date || "Unknown Date",
          spotifyUrl: item.external_urls?.spotify || "#",
        };

        // Check if the item is already favorited
        const isFavorited = favorites[type].some(
          (fav) => fav.title === favoriteItem.title && fav.artist === favoriteItem.artist
        );

        tooltip.setAttribute("text", isFavorited ? "Remove from favorites" : `Add ${favoriteItem.title} to favorites`);

        // add class to button if item is already favorited
        if (isFavorited) {
          button.classList.add("active");
        }

        button.addEventListener("click", () => {
          if (button.classList.contains("active")) {
            removeFavorite(type, favoriteItem);
            button.classList.remove("active");
            tooltip.setAttribute("text", `Add ${favoriteItem.title} to favorites`);
            this.showToast(`Removed "${favoriteItem.title}" from favorites`, "error");
          } else {
            addFavorite(type, favoriteItem);
            button.classList.add("active");
            tooltip.setAttribute("text", "Remove from favorites");
            this.showToast(`Added "${favoriteItem.title}" to favorites`, "success");
          }
        });
      }
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
    this.innerHTML = `
      <div class="search-output-container">
        <p class="search-status"></p>
        <div class="results-container"></div>
      </div>
    `;
    this.updateStatus();
  }
}

customElements.define("app-search-output", SearchOutput);
