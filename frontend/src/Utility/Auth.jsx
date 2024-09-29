import Cookies from "js-cookie";

export const store_cookies_data = (refresh_token, access_token) => {
  const authdata = {
    access_token: access_token,
    refresh_token: refresh_token,
  };
  const serilize_auth_data = JSON.stringify(authdata);
  Cookies.set("authdata", serilize_auth_data, {
    expires: 1,
    secure: true,
    sameSite: "strict",
  });
  // window.location.reload();
};

export const delete_cookies_storedata = () => {
  Cookies.remove("authdata");
  console.log("deleting data function");
  // window.location.reload();
};

export const get_cookies_data = (refresh, access) => {
  const authdata = Cookies.get("authdata");
  if (authdata) {
    const data = JSON.parse(authdata);
    if (refresh) {
      return data.refresh_token;
    } else if (access) {
      return data.access_token;
    }
  }
  return false;
};

export const edit_access_token = (new_access_token) => {
  const authdata = Cookies.get("authdata");
  if (authdata) {
    const data = JSON.parse(authdata);
    data.access_token = new_access_token;
    const updated_data = JSON.stringify(data);
    Cookies.set("authdata", updated_data, {
      expires: 1,
      secure: true,
      sameSite: "strict",
    });
  }
};
