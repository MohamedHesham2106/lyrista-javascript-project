function cookies() {
  const getCookie = async (key) => {
    let data = [];
    data = document.cookie.split("; ");

    for (const cookie of data) {
      const [currKey, value] = cookie.split("=");
      if (currKey === key) {
        return value;
      }
    }
    console.log("Cookie not found");
    return false;
  };

  const setCookie = (key, value) => {
    console.log("setCookie function called");
    let expiresAt = new Date(Date.now() + 59 * 60 * 1000);
    document.cookie = `${key}=${value}; expires=${expiresAt.toUTCString()};`;
    console.log(
      `Cookie set: ${key}=${value}; expires=${expiresAt.toUTCString()}`
    );
  };

  return { getCookie, setCookie };
}

export { cookies };
