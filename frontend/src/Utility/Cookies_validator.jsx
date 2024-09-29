import {
  delete_cookies_storedata,
  edit_access_token,
  store_cookies_data,
  get_cookies_data,
} from "./Auth";

// const url = "http://localhost:5000";
const url = import.meta.env.VITE_REACT_APP_URL;
let session_access_token = get_cookies_data(false, true);
let session_refresh_token = get_cookies_data(true, false);

export const optionsC = (Auth, methods, Body) => {
  let options = {
    method: methods,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (Auth) {
    options.headers.Authorization = `Bearer ${session_token}`;
  }

  if (Body) {
    options.body = JSON.stringify(Body);
  }

  return options;
};

export const storedata = (refresh_token, access_token) => {
  // sessionStorage.setItem("refresh_token", refresh_token);
  // sessionStorage.setItem("access_token", access_token);
  // sessionStorage.setItem("btn", true);
  store_cookies_data(refresh_token, access_token);
  console.log("stored data");
};

export const delete_storedata = () => {
  // sessionStorage.removeItem("refresh_token");
  // sessionStorage.removeItem("access_token");
  delete_cookies_storedata();
  console.log("deleting data function");
};

export const check_token = async () => {
  let access_token = get_cookies_data(false, true);
  let refresh_token = get_cookies_data(true, false);
  console.log("Access Token: ", access_token);
  console.log("Refresh Token: ", refresh_token);

  if (!access_token) {
    console.log("No access token found.");
    return false;
  } else if (!refresh_token) {
    console.log("No refresh token found.");
    return false;
  } else {
    console.log("Tokens exist.");

    try {
      // Check the access token
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      };

      let response = await fetch(
        `${url}/check_session_token/check_token`,
        options
      );
      let data = await response.json();

      if (response.status === 200) {
        console.log(data.msg);
        return true;
      } else if (response.status === 401) {
        console.log(data.msg);

        // Attempt to refresh the token
        options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refresh_token}`,
          },
        };

        response = await fetch(
          `${url}/check_session_token/refresh_session_token`,
          options
        );
        let data = await response.json();

        if (response.status === 200) {
          console.log(data.msg);
          store_cookies_data(refresh_token, data.access_token);
          return true;
        } else {
          console.log(data.msg);
          return false;
        }
      }
    } catch (error) {
      console.error("Error checking token:", error);
      return false;
    }
  }
};
