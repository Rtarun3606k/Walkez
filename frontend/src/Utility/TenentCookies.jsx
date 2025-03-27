import Cookies from "js-cookie";

export const tenent_store_cookies_data = (refresh_token, access_token) => {
  const tenentdata = {
    access_token: access_token,
    refresh_token: refresh_token,
  };
  const serilize_auth_data = JSON.stringify(tenentdata);
  Cookies.set("tenentdata", serilize_auth_data, {
    expires: 1,
    secure: true,
    sameSite: "strict",
  });
  // window.location.reload();
};

export const tenent_delete_cookies_storedata = () => {
  Cookies.remove("tenentdata");
  console.log("deleting data function");
  // window.location.reload();
};

export const tenent_get_cookies_data = (refresh, access) => {
  const tenentdata = Cookies.get("tenentdata");
  if (tenentdata) {
    const data = JSON.parse(tenentdata);
    if (refresh) {
      return data.refresh_token;
    } else if (access) {
      return data.access_token;
    }
  }
  return false;
};

export const tenent_edit_access_token = (new_access_token) => {
  const tenentdata = Cookies.get("tenentdata");
  if (tenentdata) {
    const data = JSON.parse(tenentdata);
    data.access_token = new_access_token;
    const updated_data = JSON.stringify(data);
    Cookies.set("tenentdata", updated_data, {
      expires: 1,
      secure: true,
      sameSite: "strict",
    });
  }
};
