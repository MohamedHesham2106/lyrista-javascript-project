class LyristaFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="lyrista-footer">
        <div class="lyrista-footer-container">
          <div class="lyrista-footer-logo">
            <h2>Lyrista</h2>
            <p class="lyrista-footer-tagline">Your Personal Music Universe</p>
          </div>

          <div class="lyrista-footer-info">
            <p class="lyrista-copyright">© ${new Date().getFullYear()} Lyrista. All rights reserved.</p>
            <p class="lyrista-credits">Designed & Developed by <span>Mohamed Hesham</span> and <span>Islam Tarek</span></p>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("app-lyrista-footer", LyristaFooter);
