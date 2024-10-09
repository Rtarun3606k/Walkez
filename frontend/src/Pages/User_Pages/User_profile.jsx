import React, { useEffect, useState } from "react";
import "../../CSS/User_Css/Profile.css";
import "../../CSS/User_Css/Upload.css";
import { toast } from "react-toastify";
import { get_cookies_data } from "../../Utility/Auth";

const User_profile = () => {
  const [user_data, setuser_data] = useState({});
  const [edit_flag, setEdit_flag] = useState(false);
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profile_image, setProfile_image] = useState(null);
  const apiUrl = import.meta.env.VITE_REACT_APP_URL;
  const get_access_token = get_cookies_data(false, true);

  const get_data = async () => {
    const option = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${get_access_token}`,
      },
    };
    const response = await fetch(`${apiUrl}/user_route/get_user`, option);
    const data = await response.json();
    if (response.status === 200) {
      setuser_data(data.user_data);
      setName(data.user_data.user_name);
      setEmail(data.user_data.user_email);
      setPhone(data.user_data.user_phone);
      console.log(data);
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  const handle_edit_profile = async (e) => {
    e.preventDefault();
    const update_data = new FormData();
    update_data.append("user_name", Name);
    update_data.append("user_email", email);
    update_data.append("user_phone", phone);
    if (profile_image) {
      update_data.append("profile_image", profile_image);
    }
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${get_access_token}`,
      },
      body: update_data,
    };

    const response = await fetch(
      `${apiUrl}/user_profile_route/update_user_profile`,
      options
    );
    const data = await response.json();
    if (response.status === 200) {
      console.log(data.message);
      toast.success("Profile updated successfully");
      setEdit_flag(false);
      get_data();
    } else {
      toast.error("Failed to update profile");
    }
  };

  useEffect(() => {
    get_data();
  }, []);

  return (
    <div className="content">
      <h1>Account Info</h1>
      {edit_flag ? (
        <>
          <form
            className="user-profile"
            onSubmit={handle_edit_profile}
            encType="multipart/form-data"
          >
            <div className="profile-header">
              <div className="user_profile_img">
                <label htmlFor="user_profile">
                  <img
                    src={
                      user_data.profile_image
                        ? `${apiUrl}/user_profile_route/get_profile_image/${user_data.user_id}`
                        : "../logos/profile.svg"
                    }
                    alt="User Avatar"
                    className="avatar"
                  />
                </label>
                <input
                  type="file"
                  id="user_profile"
                  onChange={(e) => {
                    setProfile_image(e.target.files[0]);
                  }}
                />
              </div>
              <div className="input_fields">
                <label htmlFor="user_name">Name </label>
                <input
                  className="inputtxt"
                  id="user_name"
                  value={Name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="profile-info">
              <p>
                <label htmlFor="user_phone">
                  <strong>Phone Number </strong>
                </label>
                <input
                  className="inputtxt"
                  type="text"
                  value={phone}
                  id="user_phone"
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </p>
              <p>
                <label htmlFor="user_email">
                  <strong>Email </strong>
                </label>
                <input
                  type="email"
                  id="user_email"
                  value={email}
                  className="inputtxt"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </p>
            </div>
            <div className="profile-actions">
              <button className="edit-profile" type="submit">
                Submit
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className="user-profile">
            <div className="profile-header">
              <img
                src={
                  user_data.profile_image
                    ? `${apiUrl}/user_profile_route/get_profile_image/${user_data.user_id}`
                    : "../logos/profile.svg"
                }
                alt="User Avatar"
                className="avatar"
              />
              <h2>{user_data.user_name}</h2>
            </div>
            <div className="profile-info">
              <p>
                <strong>Phone Number:</strong>
                {user_data.user_phone
                  ? `+91 ${user_data.user_phone}`
                  : "Not Provided"}
              </p>
              <p>
                <strong>Email:</strong> {user_data.user_email}
              </p>
            </div>
            <div className="profile-actions">
              <button
                className="edit-profile"
                onClick={() => {
                  setEdit_flag(!edit_flag);
                  setEmail(user_data.user_email);
                  setName(user_data.user_name);
                  setPhone(user_data.user_phone);
                  // setProfile_image()
                }}
              >
                Edit Profile
              </button>
              <button className="change-password">Change Password</button>
            </div>
          </div>
        </>
      )}

      <div className="examples">
        <h2>Images Uploaded By You</h2>
        <div className="images">
          {user_data.user_images &&
            user_data.user_images.map((image) => {
              return (
                <div className="example-image" key={image.image_id}>
                  <img
                    src={`${apiUrl}/user_route/image/${image.image_id}`}
                    alt={image.image_name}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default User_profile;
