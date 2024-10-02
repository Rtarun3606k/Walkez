import React, { useEffect, useState } from "react";
import "../../CSS/User_Css/Profile.css";
import { toast } from "react-toastify";
import { get_cookies_data } from "../../Utility/Auth";

const User_profile = () => {
  const [user_data, setuser_data] = useState({});
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
    console.log(data.user_data);
    if (response.status === 200) {
      setuser_data(data.user_data);
      toast.success(data.message);
      console.log(user_data);
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    get_data();
  }, []);

  return (
    <div class="content">
      <h1>Account Info</h1>
      <div class="user-profile">
        <div class="profile-header">
          <img src="#" alt="User Avatar" class="avatar" />
          <h2>{user_data.user_name}</h2>
        </div>
        <div class="profile-info">
          <p>
            <strong>Phone Number:</strong>
            {user_data.user_phone ? +91 + user_data.user_phone : "Not Provided"}
          </p>
          <p>
            <strong>Email:</strong> {user_data.user_email}
          </p>
        </div>
        <div class="profile-actions">
          <button class="edit-profile">Edit Profile</button>
          <button class="change-password">Change Password</button>
        </div>
      </div>
    </div>
  );
};
//added profile comment to push

export default User_profile;
