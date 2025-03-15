import { useFetch } from "../../utils/fetch.module.js";

class LyricsDisplay extends HTMLElement {
  constructor() {
    super();
    this.lyricsTimestamps = [];
    this.currentTime = 0;
    this.updateInterval = null;
    this.spotifyPlayer = null;
    this.playerReady = false;
    this.isPaused = true; // Track whether the player is paused
    this.lastActiveLineIndex = -1;
    this.isSearching = false;
  }

  connectedCallback() {
    this.render();
    this.parseUrlParams();
    this.setupMessageListener();
  }

  disconnectedCallback() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.playerPollInterval) {
      clearInterval(this.playerPollInterval);
    }
    window.removeEventListener("message", this.handleSpotifyMessages);
  }

  render() {
    this.innerHTML = `
      <div class="lyrics-container">
      <div class="lyrics-notes hidden">
      <p class="notes-text">
      This only works with English songs. If the lyrics are not displayed, it means the song is not available in the database.
      </p>
      </div>
        <div class="player-container"></div>
        <div class="lyrics-section">
          <div class="lyrics-header">
            <h1 class="lyrics-title">${this.track || "Loading..."}</h1>
            <p class="lyrics-artist">${this.artist || ""}</p>
          </div>
          <div class="lyrics-content"></div>
        </div>
      </div>
    `;
  }

  parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const artist = urlParams.get("artist");
    const track = urlParams.get("track");

    if (artist && track) {
      this.fetchLyrics(artist, track);
    } else {
      this.showError("Missing artist or track in URL");
    }
  }

  setupMessageListener() {
    this.handleSpotifyMessages = this.handleSpotifyMessages.bind(this);
    window.addEventListener("message", this.handleSpotifyMessages);

    // Fallback update interval in case Spotify iframe events aren't working
    this.updateInterval = setInterval(() => {
      if (!this.playerReady) {
        this.checkPlayerReady();
      }
    }, 500);
  }

  handleSpotifyMessages(event) {
    if (event.origin !== "https://open.spotify.com") return;

    try {
      // Check if event.data is already an object
      let data = event.data;
      if (typeof event.data === "string") {
        try {
          data = JSON.parse(event.data);
        } catch (parseError) {
          console.warn("Failed to parse event.data as JSON:", event.data);
          return;
        }
      }

      // Handle different message types
      if (data && typeof data === "object") {
        switch (data.type) {
          case "ready":
            this.playerReady = true;
            break;

          case "playback_update":
            if (data.payload) {
              this.handlePlaybackUpdate(data.payload);
            }
            break;

          default:
            console.warn("Unknown message type from Spotify:", data.type);
            break;
        }
      } else {
        console.warn("Unexpected message structure from Spotify:", data);
      }
    } catch (error) {
      console.warn("Error handling Spotify message:", error);
    }
  }

  handlePlaybackUpdate(payload) {
    // Store previous time to detect seeking
    const previousTime = this.currentTime;
    this.currentTime = payload.position / 1000; // Convert from ms to seconds

    // Update isPaused state
    const wasPaused = this.isPaused;
    this.isPaused = payload.isPaused;

    // Handle play/pause state changes
    if (wasPaused && !this.isPaused) {
      // Started playing
      this.startPlayerPolling();
    } else if (!wasPaused && this.isPaused) {
      // Paused
      if (this.playerPollInterval) {
        clearInterval(this.playerPollInterval);
        this.playerPollInterval = null;
      }
    }

    // Check if user has seeked (large time difference)
    const hasJumped = Math.abs(this.currentTime - previousTime) > 1.0;

    // Force immediate update if seeking occurred
    if (hasJumped) {
      this.updateLyricsHighlight(true);
    } else {
      this.updateLyricsHighlight();
    }
  }

  checkPlayerReady() {
    const iframe = this.querySelector("iframe");
    if (iframe) {
      try {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            method: "getState",
          }),
          "https://open.spotify.com"
        );

        if (!this.playerPollInterval && !this.isPaused) {
          this.startPlayerPolling();
        }
      } catch (error) {
        console.warn("Failed to communicate with Spotify iframe:", error);
      }
    }
  }

  startPlayerPolling() {
    // Clear any existing intervals
    if (this.playerPollInterval) {
      clearInterval(this.playerPollInterval);
    }
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    // Start new polling interval
    this.playerPollInterval = setInterval(() => {
      if (!this.playerReady || this.isPaused) return;

      // Request current state from Spotify iframe
      const iframe = this.querySelector("iframe");
      if (iframe) {
        try {
          iframe.contentWindow.postMessage(JSON.stringify({ method: "getState" }), "https://open.spotify.com");
        } catch (error) {
          console.warn("Failed to poll Spotify player:", error);
        }
      }

      // Update time and lyrics highlight
      this.currentTime += 0.1;
      this.updateLyricsHighlight();
    }, 100);
  }

  async fetchLyrics(artist, track) {
    this.showLoading();
    this.artist = artist;
    this.track = track;

    const titleEl = this.querySelector(".lyrics-title");
    const artistEl = this.querySelector(".lyrics-artist");
    if (titleEl) titleEl.textContent = track;
    if (artistEl) artistEl.textContent = artist;

    try {
      const apiUrl = `https://lrclib.net/api/search?artist_name=${encodeURIComponent(
        artist
      )}&track_name=${encodeURIComponent(track)}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      if (!data.length) throw new Error("No lyrics found");

      const lyricsData = data.find((item) => item.syncedLyrics) || data[0];
      if (lyricsData.syncedLyrics) {
        this.displayTimestampedLyrics(lyricsData.syncedLyrics);
      } else if (lyricsData.plainLyrics) {
        this.displayLyrics(lyricsData.plainLyrics);
      } else {
        throw new Error("No lyrics content found");
      }

      this.searchAndEmbedSpotifyTrack(artist, track);
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      this.showError(error.message);
    }
  }

  async searchAndEmbedSpotifyTrack(artist, track) {
    if (this.isSearching) return;
    this.isSearching = true;

    try {
      const container = this.querySelector(".player-container");
      container.innerHTML = `<div class="loading-spotify">Finding track on Spotify...</div>`;

      // Search for the track using the Spotify API
      const data = await useFetch().search(`${artist} ${track}`, "track", 20, true);

      if (!data?.tracks?.items?.length) {
        throw new Error("No tracks found on Spotify");
      }

      // Normalize search terms for comparison
      const normalize = (str) =>
        str
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "") // Remove special characters
          .replace(/\s+/g, " ") // Normalize spaces
          .trim();

      const searchArtist = normalize(artist);
      const searchTrack = normalize(track);

      // Score each track based on how well it matches the search terms
      const scoredTracks = data.tracks.items.map((item) => {
        const trackArtist = normalize(item.artists[0].name);
        const trackName = normalize(item.name);

        // Calculate similarity scores for artist and track name
        const artistScore = trackArtist.includes(searchArtist) ? 1 : 0;
        const trackScore = trackName.includes(searchTrack) ? 1 : 0;

        // Additional scoring for exact matches
        const exactArtistMatch = trackArtist === searchArtist ? 2 : 0;
        const exactTrackMatch = trackName === searchTrack ? 2 : 0;

        // Total score
        const totalScore = artistScore + trackScore + exactArtistMatch + exactTrackMatch;
        return {
          ...item,
          score: totalScore,
        };
      });

      // Sort tracks by score (highest first)
      scoredTracks.sort((a, b) => b.score - a.score);

      // Select the track with the highest score
      const bestMatch = scoredTracks[0];

      if (bestMatch) {
        this.createSpotifyEmbed(bestMatch.id);
      } else {
        throw new Error("No matching track found after filtering");
      }
    } catch (error) {
      console.error("Spotify search error:", error);
      const container = this.querySelector(".player-container");
      container.innerHTML = `
        <div class="spotify-error">
          <p>Error: Could not find track on Spotify</p>
          <p class="text-sm opacity-75">${error.message}</p>
          <button id="retry-spotify" class="mt-2 px-4 py-2 bg-[#ff4d8d] text-white rounded hover:bg-[#e6397a]">
            Retry Search
          </button>
        </div>
      `;

      const retryButton = container.querySelector("#retry-spotify");
      if (retryButton) {
        retryButton.addEventListener("click", () => {
          this.searchAndEmbedSpotifyTrack(this.artist, this.track);
        });
      }
    } finally {
      this.isSearching = false;
    }
  }

  createSpotifyEmbed(trackId) {
    const container = this.querySelector(".player-container");

    container.innerHTML = `
      <iframe
        src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0&callback=spotifyCallback"
        width="100%"
        height="80"
        frameborder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>`;

    this.playerReady = false;
    this.currentTime = 0;
    this.lastActiveLineIndex = -1;

    const iframe = container.querySelector("iframe");
    if (iframe) {
      iframe.onerror = () => {
        container.innerHTML = `
          <div class="spotify-error">
            <p>Error loading Spotify player</p>
            <button id="retry-spotify">Retry</button>
          </div>
        `;

        const retryButton = container.querySelector("#retry-spotify");
        if (retryButton) {
          retryButton.addEventListener("click", () => {
            this.createSpotifyEmbed(trackId);
          });
        }
      };
    }
  }

  showLoading() {
    this.querySelector(".lyrics-content").innerHTML = `<div class="loading">Fetching lyrics...</div>`;
  }

  showError(message) {
    this.querySelector(".lyrics-notes").style.display = "block";
    this.querySelector(".player-container").style.display = "none";
    this.querySelector(".lyrics-content").innerHTML = `<div class="error">${message}</div>`;
  }

  displayLyrics(lyrics) {
    this.querySelector(".lyrics-content").innerHTML = lyrics.replace(/\n/g, "<br>");
  }

  displayTimestampedLyrics(lyrics) {
    this.lyricsTimestamps = [];
    const lines = lyrics.split("\n");
    let lyricsHtml = `<div class="lyrics-timestamped">`;

    lines.forEach((line, index) => {
      const match = line.match(/\[(\d+:\d+\.\d+)\](.*)/);
      if (match) {
        const [_, timestamp, text] = match;
        if (text.trim()) {
          const [minutes, seconds] = timestamp.split(":").map(Number.parseFloat);
          const timeInSeconds = minutes * 60 + seconds;
          this.lyricsTimestamps.push({ time: timeInSeconds, text: text.trim() });

          lyricsHtml += `
            <div class="lyrics-line" data-time="${timeInSeconds}" data-index="${this.lyricsTimestamps.length - 1}">
              <span class="lyrics-timestamp">[${timestamp}]</span>
              <span class="lyrics-text">${text.trim()}</span>
            </div>`;
        }
      }
    });

    lyricsHtml += `</div>`;
    const lyricsContent = this.querySelector(".lyrics-content");
    lyricsContent.innerHTML = lyricsHtml;

    // Add click handlers after content is inserted
    const lyricsLines = this.querySelectorAll(".lyrics-line");
    lyricsLines.forEach((line) => {
      line.addEventListener("click", () => {
        const timeInSeconds = Number.parseFloat(line.getAttribute("data-time"));
        if (timeInSeconds) {
          this.seekToTime(timeInSeconds);
        }
      });
    });

    this.lyricsTimestamps.sort((a, b) => a.time - b.time);
  }

  updateLyricsHighlight(forceScroll = false) {
    if (!this.lyricsTimestamps.length || !this.playerReady) return;

    let activeLineIndex = -1;
    const currentTime = this.currentTime;

    // Find the current line based on timestamp
    for (let i = 0; i < this.lyricsTimestamps.length; i++) {
      if (currentTime >= this.lyricsTimestamps[i].time) {
        activeLineIndex = i;
      } else {
        break;
      }
    }

    // If no change in active line and not forcing update, skip processing
    if (activeLineIndex === this.lastActiveLineIndex && !forceScroll) {
      return;
    }

    // Remove active class from all lines
    const allLines = this.querySelectorAll(".lyrics-line");
    allLines.forEach((line) => line.classList.remove("active"));

    if (activeLineIndex >= 0) {
      const activeLine = this.querySelector(`.lyrics-line[data-index="${activeLineIndex}"]`);
      if (activeLine) {
        // Add active class
        activeLine.classList.add("active");

        // Scroll to the active line if container exists
        const lyricsContainer = this.querySelector(".lyrics-content");
        if (lyricsContainer && (forceScroll || activeLineIndex !== this.lastActiveLineIndex)) {
          const containerHeight = lyricsContainer.clientHeight;
          const lineTop = activeLine.offsetTop;
          const lineHeight = activeLine.offsetHeight;

          // Calculate scroll position to center the active line
          const scrollTop = lineTop - containerHeight + lineHeight / 2;

          // Smooth scroll to the position
          lyricsContainer.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: forceScroll ? "auto" : "smooth",
          });
        }

        // Update last active line index
        this.lastActiveLineIndex = activeLineIndex;
      }
    }
  }

  seekToTime(timeInSeconds) {
    this.currentTime = timeInSeconds;

    const iframe = this.querySelector("iframe");
    if (iframe) {
      try {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            method: "seek",
            value: timeInSeconds * 1000, // Convert to milliseconds
          }),
          "https://open.spotify.com"
        );
      } catch (error) {
        console.warn("Failed to seek in Spotify player:", error);
      }
    }

    // Force immediate update with scrolling when seeking
    this.updateLyricsHighlight(true);
  }
}

customElements.define("lyrics-display", LyricsDisplay);
