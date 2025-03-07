class Entrance extends HTMLElement {
  constructor() {
    super();
    this.loaded = false;
    this.progressValue = 0;
    this.letters = ["L", "y", "r", "i", "s", "t", "a"];
    this.currentLetterIndex = 0;
    this.musicNotes = ["♪", "♫", "♬", "♩"];
    this.progressBar = null;
    this.letterElements = null;
    this.subtitle = null;
    this.animationInterval = null;
    this.noteInterval = null;
    this.notesCreated = 0;
    this.maxNotes = 25;
  }

  connectedCallback() {
    this.render();
    this.startAnimation();

    window.addEventListener("resize", this.handleResize.bind(this));

    setTimeout(() => {
      this.completeLoading();
    }, 3500);
  }

  disconnectedCallback() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    if (this.noteInterval) {
      clearInterval(this.noteInterval);
    }
    window.removeEventListener("resize", this.handleResize.bind(this));
  }

  handleResize() {
    const existingNotes = this.querySelectorAll(".notes");
    existingNotes.forEach((note) => {
      if (note.parentNode === this) {
        this.removeChild(note);
      }
    });
  }

  render() {
    this.innerHTML = `
      <div class="entrance-container">
        <div class="entrance-text">
          ${this.letters.map((letter) => `<span class="letter">${letter}</span>`).join("")}
        </div>
        <div class="entrance-progress"></div>
        <div class="entrance-subtitle">Discovering your music universe...</div>
      </div>
    `;

    this.progressBar = this.querySelector(".entrance-progress");
    this.letterElements = this.querySelectorAll(".letter");
    this.subtitle = this.querySelector(".entrance-subtitle");

    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.style.opacity = "0";
      mainContent.style.display = "none";
    }
  }

  startAnimation() {
    this.animationInterval = setInterval(() => {
      if (this.currentLetterIndex < this.letters.length) {
        if (this.letterElements) {
          this.letterElements[this.currentLetterIndex].classList.add("active");
        }
        this.currentLetterIndex++;

        this.progressValue = (this.currentLetterIndex / this.letters.length) * 100;
        if (this.progressBar) {
          this.progressBar.style.width = `${this.progressValue}%`;
        }

        if (this.currentLetterIndex === 3 && this.subtitle) {
          this.subtitle.classList.add("visible");
        }
      } else {
        clearInterval(this.animationInterval);
        this.createMusicNotes();
      }
    }, 200);
  }

  createMusicNotes() {
    const notesContainer = document.createElement("div");
    notesContainer.className = "notes-container";
    this.appendChild(notesContainer);

    const subtitle = this.querySelector(".entrance-subtitle");
    const textElement = this.querySelector(".entrance-text");

    if (!subtitle || !textElement) return;

    // Get the position of the subtitle and text element
    const subtitleRect = subtitle.getBoundingClientRect();
    const textRect = textElement.getBoundingClientRect();
    const containerRect = this.getBoundingClientRect();

    // calc the start position of the notes
    const startYPosition = ((subtitleRect.bottom - containerRect.top + 20) / containerRect.height) * 100;
    const textCenterX = ((textRect.left + textRect.width / 2 - containerRect.left) / containerRect.width) * 100;
    // calc the distribution width of the notes
    const distributionWidth = ((textRect.width * 0.8) / containerRect.width) * 100;

    this.noteInterval = setInterval(() => {
      if (this.notesCreated >= this.maxNotes) {
        clearInterval(this.noteInterval);
        return;
      }

      const note = document.createElement("div");
      note.className = "notes";
      note.textContent = this.musicNotes[Math.floor(Math.random() * this.musicNotes.length)];
      // just random colors
      note.classList.add(this.notesCreated % 2 === 0 ? "primary" : "secondary");

      // randomize the start position of the notes around middle part
      const randomOffset = (Math.random() - 0.5) * distributionWidth * 0.9;
      const startX = textCenterX + randomOffset;
      note.style.left = `${startX}%`;
      note.style.top = `${startYPosition}%`;

      const horizontalSpread = (Math.random() + Math.random() - 1) * 5;
      // set the custom properties for the animation
      note.style.setProperty("--h-spread", `${horizontalSpread}`);

      // how far the note should go up from the start position
      const verticalDistance =
        (startYPosition - ((textRect.bottom - containerRect.top) / containerRect.height) * 100) * -1.2;
      note.style.setProperty("--v-distance", `${verticalDistance}`);

      note.style.animationDuration = `${0.8 + Math.random() * 1.2}s`;
      note.style.animationDelay = `${Math.random() * 0.3}s`;

      const size = 1.2 + Math.random() * 0.8;
      // set the custom properties for the size
      note.style.setProperty("--size", `${size}`);

      notesContainer.appendChild(note);
      this.notesCreated++;

      setTimeout(() => {
        if (note.parentNode === notesContainer) {
          notesContainer.removeChild(note);
        }
      }, 3000);
    }, 150);
  }

  completeLoading() {
    if (this.letterElements) {
      this.letterElements.forEach((letter) => letter.classList.add("active"));
    }
    if (this.progressBar) {
      this.progressBar.style.width = "100%";
    }
    if (this.subtitle) {
      this.subtitle.classList.add("visible");
    }

    clearInterval(this.animationInterval);
    clearInterval(this.noteInterval);

    this.style.transition = "opacity 0.5s ease-out";
    this.style.opacity = "0";

    setTimeout(() => {
      // show the main content after the entrance animation is done
      const mainContent = document.querySelector("main");
      if (mainContent) {
        mainContent.style.display = "block";
        mainContent.style.opacity = "0";
        mainContent.style.transition = "opacity 0.5s ease-in-out";
        void mainContent.offsetWidth;
        mainContent.style.opacity = "1";
      }
    }, 500);

    setTimeout(() => {
      this.remove();
    }, 1000);
  }
}

customElements.define("app-entrance", Entrance);
