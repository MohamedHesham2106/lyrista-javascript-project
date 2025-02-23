function cookies() {
  const getCookie = async (key) => {
    // console.log("getCookie function called");
    // console.log("document.cookie==>" + document.cookie);
    let data = [];
    data = document.cookie.split("; ");
    // console.log("data==>" + data);

    for (const cookie of data) {
      const [currKey, value] = cookie.split("=");
      if (currKey === key) {
        // console.log(`Cookie found: ${currKey}=${value}`);
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
    console.log(`Cookie set: ${key}=${value}; expires=${expiresAt.toUTCString()}`);
  };

  return { getCookie, setCookie };
}

export { cookies };
