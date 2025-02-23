class NewReleaseCard extends HTMLElement {
  constructor() {
    super();
    this.classList.add("new-release-card");
  }

  connectedCallback() {
    this.render();
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
    `;
  }
}

customElements.define("app-new-release-card", NewReleaseCard);
