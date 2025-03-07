const validation = {
  isUsernameValid: (username) => /^[a-zA-Z0-9_.]{3,30}$/.test(username),
  isPasswordValid: (password) => /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/.test(password),
};

function validateCredentials({ username, password }) {
  const errors = {};
  if (!validation.isUsernameValid(username)) {
    errors.username = "Username must be 8-30 characters long and can only contain letters, numbers and underscores.";
  }

  if (!validation.isPasswordValid(password)) {
    errors.password =
      "Password must be 8-32 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
  }

  return Object.keys(errors).length ? errors : null;
}

export { validateCredentials };
