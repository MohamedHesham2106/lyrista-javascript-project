function useLocalStorage() {
  const setItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getItem = (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  };

  const removeItem = (key) => {
    localStorage.removeItem(key);
  };

  return { setItem, getItem, removeItem };
}

export { useLocalStorage };
