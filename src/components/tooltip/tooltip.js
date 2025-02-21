class Tooltip extends HTMLElement {
  constructor() {
    super();
    this.side = this.getAttribute("side") || "top";
    this.text = this.getAttribute("text") || "Tooltip text";
    this.tooltipElement = null;
  }

  connectedCallback() {
    this.style.display = "inline-block"; // Ensure the element takes up space
    this.addEventListener("mouseenter", this.showTooltip);
    this.addEventListener("mouseleave", this.hideTooltip);
  }

  disconnectedCallback() {
    this.removeEventListener("mouseenter", this.showTooltip);
    this.removeEventListener("mouseleave", this.hideTooltip);
    this.removeTooltip();
  }

  showTooltip = () => {
    if (this.tooltipElement) return;

    this.tooltipElement = document.createElement("div");
    this.tooltipElement.className = "tooltip-container";
    this.tooltipElement.innerHTML = `<div class="tooltip-text ${this.side}">${this.text}</div>`;
    document.body.appendChild(this.tooltipElement);

    // Get the first child element inside the app-tooltip (the target element)
    const targetElement = this.firstElementChild;

    if (!targetElement) {
      console.error("No child element found inside app-tooltip.");
      return;
    }

    // Get the position of the target element relative to the viewport
    const rect = targetElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();

    let left, top;

    switch (this.side) {
      case "top":
        left = rect.left + rect.width / 2;
        top = rect.top - tooltipRect.height;
        break;
      case "bottom":
        left = rect.left + rect.width / 2;
        top = rect.bottom;
        break;
      case "left":
        left = rect.left - tooltipRect.width;
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        break;
      case "right":
        left = rect.right;
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Ensure the tooltip stays within the viewport
    left = Math.max(0, Math.min(left, window.innerWidth - tooltipRect.width));
    top = Math.max(0, Math.min(top, window.innerHeight - tooltipRect.height));

    this.tooltipElement.style.position = "fixed";
    this.tooltipElement.style.left = `${left}px`;
    this.tooltipElement.style.top = `${top}px`;
  };

  hideTooltip = () => {
    this.removeTooltip();
  };

  removeTooltip() {
    if (this.tooltipElement && this.tooltipElement.parentNode) {
      this.tooltipElement.parentNode.removeChild(this.tooltipElement);
    }
    this.tooltipElement = null;
  }
}

customElements.define("app-tooltip", Tooltip);
