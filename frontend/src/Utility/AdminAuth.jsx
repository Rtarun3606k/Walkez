import Cookies from "js-cookie";

export const store_cookies_data = (refresh_token, access_token) => {
  const admindata = {
    access_token: access_token,
    refresh_token: refresh_token,
  };
  const serilize_auth_data = JSON.stringify(admindata);
  Cookies.set("admindata", serilize_auth_data, {
    expires: 1,
    secure: true,
    sameSite: "strict",
  });
  // window.location.reload();
};

export const delete_cookies_storedata = () => {
  Cookies.remove("admindata");
  console.log("deleting data function");
  // window.location.reload();
};

export const get_cookies_data = (refresh, access) => {
  const admindata = Cookies.get("admindata");
  if (admindata) {
    const data = JSON.parse(admindata);
    if (refresh) {
      return data.refresh_token;
    } else if (access) {
      return data.access_token;
    }
  }
  return false;
};

export const edit_access_token = (new_access_token) => {
  const admindata = Cookies.get("admindata");
  if (admindata) {
    const data = JSON.parse(admindata);
    data.access_token = new_access_token;
    const updated_data = JSON.stringify(data);
    Cookies.set("admindata", updated_data, {
      expires: 1,
      secure: true,
      sameSite: "strict",
    });
  }
};
