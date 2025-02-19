const validation = {
  isUsernameValid: (username) => /^[a-zA-Z0-9_.]{3,30}$/.test(username),
  isPasswordValid: (password) => /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/.test(password),
};

function validateCredentials({ username, password }) {
  const errors = {};
  console.log(username, password);
  if (!validation.isUsernameValid(username)) {
    errors.username =
      "Username must be 8-32 characters long and contain one uppercase letter, one lowercase letter, one number, and one special character.";
  }

  if (!validation.isPasswordValid(password)) {
    errors.password = "Password must be 6-30 characters long, containing at least one letter and one number.";
  }

  return Object.keys(errors).length ? errors : null;
}

export { validateCredentials };
