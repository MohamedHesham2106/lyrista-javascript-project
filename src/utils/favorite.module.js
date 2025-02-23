import { useLocalStorage } from "./local-storage.module.js";

const useFavorite = () => {
  const storage = useLocalStorage();
  const FAVORITE_KEY = "favorites";

  const getLoggedInUser = () => {
    let users = storage.getItem("users");
    const user = users.find((user) => user.status === "loggedIn");
    return user ? user.username : null;
  };

  const addFavorite = (type, favoriteItem) => {
    const username = getLoggedInUser();
    if (!username) {
      throw new Error("No user is logged in.");
    }

    let favorites = storage.getItem(FAVORITE_KEY);
    let userFavorites = favorites.find((fav) => fav.username === username);
    if (!userFavorites) {
      userFavorites = { username, favorite: { albums: [], tracks: [] } };
      favorites.push(userFavorites);
    }

    if (type === "albums") {
      // Check if the album already exists before adding
      const exists = userFavorites.favorite.albums.some(
        (item) => item.title === favoriteItem.title && item.artist === favoriteItem.artist
      );

      if (!exists) {
        const album = {
          title: favoriteItem.title || "Unknown Album",
          artist: favoriteItem.artist || "Unknown Artist",
          image: favoriteItem.image || "../../../src/public/images/hero-bg.jpg",
          releaseDate: favoriteItem.releaseDate || "Unknown Date",
          spotifyUrl: favoriteItem.spotifyUrl || "#",
        };
        userFavorites.favorite.albums.push(album);
      }
    } else if (type === "tracks") {
      userFavorites.favorite.tracks.push(favoriteItem);
    }

    storage.setItem(FAVORITE_KEY, favorites);
  };

  const getFavorites = () => {
    const username = getLoggedInUser();
    if (!username) {
      throw new Error("No user is logged in.");
    }

    const favorites = storage.getItem(FAVORITE_KEY);
    const userFavorites = favorites.find((fav) => fav.username === username);
    return userFavorites ? userFavorites.favorite : { albums: [], tracks: [] };
  };

  const removeFavorite = (type, favoriteItem) => {
    const username = getLoggedInUser();
    if (!username) {
      throw new Error("No user is logged in.");
    }

    let favorites = storage.getItem(FAVORITE_KEY);
    let userFavorites = favorites.find((fav) => fav.username === username);

    if (userFavorites) {
      userFavorites.favorite[type] = userFavorites.favorite[type].filter(
        (item) => !(item.title === favoriteItem.title && item.artist === favoriteItem.artist)
      );

      if (userFavorites.favorite.albums.length === 0 && userFavorites.favorite.tracks.length === 0) {
        favorites = favorites.filter((fav) => fav.username !== username);
      }

      storage.setItem(FAVORITE_KEY, favorites);
    }
  };

  return { addFavorite, getFavorites, removeFavorite };
};

export { useFavorite };
