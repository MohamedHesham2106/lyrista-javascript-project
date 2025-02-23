class Hero extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <section class="hero-section">
       <div class="hero-content">
         <h1 class="hero-title">Lyrista - Your Personal Music Universe</h1>
         <p class="hero-text">
           Dive into a world where your favorite tracks, albums, and playlists come together. 
           Experience your music like never before, anytime and anywhere.
         </p>
         <a href="./src/pages/Authentication/index.html" class="hero-button">
             <span class="hero-button-text">Start Your Journey</span>
             <i class="fa-solid fa-music hero-button-icon"></i>
            </a>
       </div>
     </section>
 `;
  }
}

customElements.define("app-hero", Hero);
