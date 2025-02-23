class NewRelease extends HTMLElement {
  constructor() {
    super();
    this.classList.add("new-release-container");
  }
  connectedCallback() {
    this.render();
  }
  render() {
    if (!this.innerHTML) {
      this.innerHTML = `
        <h2>New Albums</h2>
        <app-new-release-list></app-new-release-list>
      `;
    }
  }
}
customElements.define("app-new-release", NewRelease);
