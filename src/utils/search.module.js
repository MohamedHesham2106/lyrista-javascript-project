const useSearch = () => {

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  

  return { debounce };
};
export { useSearch };
