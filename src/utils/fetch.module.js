import { cookies } from "./cookies.module.js";

// credentials: grant_type=client_credentials&client_id=390916c79d2a40aa885234bd29808c90&client_secret=d667bc3abef84153b5e4dfb29e759598
// header=> Content-Type: application/x-www-form-urlencoded

function useFetch() {
  const credentials = new URLSearchParams();
  credentials.append("grant_type", "client_credentials");
  credentials.append("client_id", "390916c79d2a40aa885234bd29808c90");
  credentials.append("client_secret", "d667bc3abef84153b5e4dfb29e759598");

  const headerType = "Content-Type";
  const header = "application/x-www-form-urlencoded";

  /**
   * you can test the returned data by uncommenting the required function that you want to test it
   * from [user-button.js in  [ setupEventListeners() ] function]
   *
   */
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
  const getNewReleases = async () => {
    const response = await fetch(
      "https://api.spotify.com/v1/browse/new-releases?limit=50",
      await option()
    );
    const data = await response.json();
    return data;
  };

  const getAlbum = async (albumName) => {
    const response = await fetch(
      `https://api.spotify.com/v1/albums/${albumName}`,
      await option()
    );

    const data = await response.json();
    return data;
  };

  const getTrack = async (trackName) => {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${trackName}`,
      await option()
    );
    const data = await response.json();
    return data;
  };

  const search = async (searchInput, type) => {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=${type}`,
      await option()
    );
    const data = await response.json();
    return data;
  };

  return { getNewReleases, getAlbum, getTrack, search };
}
async function testCookies() {
  const cookieManager = cookies();

  // Set a cookie
  cookieManager.setCookie("test_key", "test_value");

  // Get a cookie
  const value = await cookieManager.getCookie("test_key");
  console.log("Retrieved cookie value:", value);
}
// testCookies();
export { useFetch };
