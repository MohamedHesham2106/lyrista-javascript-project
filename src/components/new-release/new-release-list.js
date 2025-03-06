import { useFetch } from "../../utils/fetch.module.js";

class NewReleaseSlider extends HTMLElement {
  constructor() {
    super();
    this.classList.add("new-release-slider");
    this.data = [];
    this.isLoading = true;
    this.getNewReleases = null;
    this.slider = null;
    this.slideWidth = 0;
    this.currentIndex = 0;
    this.autoScrollInterval = null;
    this.dataType = this.getAttribute("data-type") || "albums";
  }

  async connectedCallback() {
    const { getNewReleases } = useFetch();
    this.getNewReleases = getNewReleases;
    this.render();
    await this.fetchData();
  }

  async fetchData() {
    try {
      const data = await this.getNewReleases(this.dataType === "albums" ? "album" : "single");

      this.data = data.map((release) => ({
        title: release.name,
        artist: release.artists.map((artist) => artist.name).join(", "),
        image: release.images.length > 0 ? release.images[0].url : "",
        releaseDate: release.release_date,
        spotifyUrl: release.external_urls.spotify,
      }));
      this.isLoading = false;
      this.render();
      this.setupSlider();
      this.startAutoScroll();
    } catch (error) {
      this.innerHTML = `<p class="error">Failed to load new releases.</p>`;
    }
  }

  render() {
    if (this.isLoading) {
      this.innerHTML = `<div class="slider-container-loader"><app-loader></app-loader></div>`;
      return;
    }
    this.innerHTML = `
      <div class="slider-container">
        <button class="slider-button left"><i class="fa-solid fa-backward"></i></button>
        <div class="slider">
          ${this.data
            .map(
              (release) => `
                <app-new-release-card
                  data-type="${this.dataType}"
                  title="${release.title}"
                  artist="${release.artist}"
                  image="${release.image}"
                  release-date="${release.releaseDate}"
                  spotify-url="${release.spotifyUrl}">
                </app-new-release-card>
              `
            )
            .join("")}
        </div>
        <button class="slider-button right"><i class="fa-solid fa-forward"></i></button>
      </div>
    `;
  }

  setupSlider() {
    this.slider = this.querySelector(".slider");
    if (this.slider) {
      const leftButton = this.querySelector(".slider-button.left");
      const rightButton = this.querySelector(".slider-button.right");
      leftButton.addEventListener("click", () => this.scroll(-1));
      rightButton.addEventListener("click", () => this.scroll(1));

      const sliderContainer = this.querySelector(".slider-container");
      sliderContainer.addEventListener("mouseenter", () => this.stopAutoScroll());
      sliderContainer.addEventListener("mouseleave", () => this.startAutoScroll());

      setTimeout(() => {
        const card = this.slider.querySelector("app-new-release-card");
        if (card) {
          this.slideWidth = card.offsetWidth + parseInt(getComputedStyle(this.slider).gap, 10);
        }
      }, 100);
    }
  }

  scroll(direction) {
    if (!this.slider || this.slideWidth === 0) return;
    this.currentIndex += direction;

    if (this.currentIndex >= this.data.length) {
      this.currentIndex = 0;
    } else if (this.currentIndex < 0) {
      this.currentIndex = this.data.length - 1;
    }

    this.slider.style.transform = `translateX(-${this.currentIndex * this.slideWidth}px)`;
  }

  startAutoScroll() {
    this.stopAutoScroll();
    this.autoScrollInterval = setInterval(() => {
      if (this.currentIndex < this.data.length - 1) {
        this.scroll(1);
      } else {
        this.currentIndex = -1;
        this.scroll(1);
      }
    }, 3000);
  }

  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }

  disconnectedCallback() {
    this.stopAutoScroll();
  }
}

customElements.define("app-new-release-list", NewReleaseSlider);
