class NewRelease extends HTMLElement {
  constructor() {
    super();
    this.classList.add("new-release-container");
    this.dataType = this.getAttribute("data-type") || "albums";
  }
  connectedCallback() {
    this.render();
  }
  render() {
    if (!this.innerHTML) {
      this.innerHTML = `
        <h2>${this.dataType === 'albums' ?"New Albums" : "New Tracks"}</h2>
        <app-new-release-list data-type=${this.dataType}></app-new-release-list>
      `;
    }
  }
}
customElements.define("app-new-release", NewRelease);
