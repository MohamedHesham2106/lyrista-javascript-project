import { cookies } from "./cookies.module.js";

function useFetch() {
  const credentials = new URLSearchParams();
  credentials.append("grant_type", "client_credentials");
  credentials.append("client_id", "d95152d017084f1d9b7bf74d088b11d8");
  credentials.append("client_secret", "bbcdc711bc884149adc36bbc8a86651c");
  const header = "application/x-www-form-urlencoded";

  async function getAccessToken() {
    let accessToken = await cookies().getCookie("access_token");
    if (!accessToken) {
      accessToken = await updateAccessToken();
      cookies().setCookie("access_token", accessToken);
    }
    return accessToken;
  }

  const option = async () => {
    return {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    };
  };

  async function updateAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": header,
      },
      body: credentials.toString(),
    });

    const data = await response.json();
    cookies().setCookie("access_token", data.access_token);
    return data.access_token;
  }
  const getNewReleases = async (albumType = "album", limit = 150, country = "US") => {
    const allAlbums = [];
    let offset = 0;
    const maxLimit = 50;

    while (allAlbums.length < limit) {
      const remaining = limit - allAlbums.length;
      const fetchLimit = remaining > maxLimit ? maxLimit : remaining;

      const response = await fetch(
        `https://api.spotify.com/v1/browse/new-releases?limit=${fetchLimit}&offset=${offset}&country=${country}`,
        await option()
      );

      const data = await response.json();

      if (!data.albums?.items) break;

      // Filter based on albumType
      const filteredAlbums = data.albums.items.filter((album) => album.album_type === albumType);
      allAlbums.push(...filteredAlbums);

      if (data.albums.items.length < fetchLimit) break;

      offset += fetchLimit;
    }

    return allAlbums;
  };

  const getNewReleasesTracks = async (limit = 5) => {
    const response = await getNewReleases(limit);

    const newReleasesAlbums = await response.albums.items;
    let data = [];

    for (let key1 in newReleasesAlbums) {
      if (newReleasesAlbums[key1]["album_type"] === "single") {
        data.push(newReleasesAlbums[key1]);
      } else {
        const returnedAlbum = await getAlbum(newReleasesAlbums[key1].id);
        const tracks = returnedAlbum.tracks.items;
        for (let key2 in tracks) {
          data.push(await getTrack(tracks[key2].id));
        }
      }
    }

    return data;
  };

  const getAlbum = async (albumName) => {
    const response = await fetch(`https://api.spotify.com/v1/albums/${albumName}`, await option());

    const data = await response.json();
    return data;
  };

  const getTrack = async (trackName) => {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackName}`, await option());
    const data = await response.json();
    return data;
  };

  const search = async (searchInput, type, limit, raw = false) => {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=${type.toLowerCase()}${
        limit ? `&limit=${limit}` : ""
      }`,
      await option()
    );
    const data = await response.json();

    if (raw) return data; // Return the original data if raw flag is true

    // Ensure the type key exists before accessing `items`
    const typeKey = `${type.toLowerCase()}s`;
    if (!data[typeKey] || !Array.isArray(data[typeKey].items)) {
      return data; // Return the original data structure
    }

    // Filtering logic
    if (type.toLowerCase() === "album") {
      data[typeKey].items = data[typeKey].items.filter((item) => item.album_type === "album");
    } else if (type.toLowerCase() === "track") {
      data[typeKey].items = data[typeKey].items.filter((item) => item.album?.album_type === "single");
    }

    return data;
  };

  return { getNewReleases, getAlbum, getTrack, search, getNewReleasesTracks, getAccessToken };
}

export { useFetch };
