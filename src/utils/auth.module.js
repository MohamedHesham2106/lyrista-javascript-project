import { useLocalStorage } from "./local-storage.module.js";
import { validateCredentials } from "./validation.module.js";
function useAuthentication() {
  const { setItem, getItem } = useLocalStorage();

  function register({ username, password }) {
    const validationErrors = validateCredentials({ username, password });

    if (validationErrors) {
      throw new Error(
        Object.values(validationErrors)
          .map((msg) => `<span class="error">${msg}</span>`)
          .join(" ")
      );
    }

    let users = getItem("users");

    if (users.some((user) => user.username === username)) {
      throw new Error(`<span class="error">Username already exists.</span>`);
    }

    users.push({ username, password, status: "loggedOut" });
    setItem("users", users);

    return "Registration successful!";
  }

  function login({ username, password }) {
    let users = getItem("users");
    const userIndex = users.findIndex((user) => user.username === username && user.password === password);

    if (userIndex === -1) {
      throw new Error(`<span class="error">Invalid username or password.</span>`);
    }

    users[userIndex].status = "loggedIn";
    setItem("users", users);

    return "Login successful!";
  }

  return { register, login };
}

export { useAuthentication };
