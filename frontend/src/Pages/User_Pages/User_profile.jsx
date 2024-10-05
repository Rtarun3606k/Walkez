import React, { useEffect, useState } from "react";
import "../../CSS/User_Css/Profile.css";
import "../../CSS/User_Css/Upload.css";
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
    if (response.status === 200) {
      setuser_data(data.user_data);
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    get_data();
  }, []);

  return (
    <div className="content">
      <h1>Account Info</h1>
      <div className="user-profile">
        <div className="profile-header">
          <img src="#" alt="User Avatar" className="avatar" />
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
          <button className="edit-profile">Edit Profile</button>
          <button className="change-password">Change Password</button>
        </div>
      </div>

      <div className="examples">
        <h2>Images Uploaded By You</h2>
        <div className="images">
          {user_data.user_images &&
            user_data.user_images.map((image) => {
              return (
                <>
                  <div className="example-image" key={image.image_id}>
                    <img
                      src={`${apiUrl}/user_route/image/${image.image_id}`}
                      alt={image.image_name}
                    />
                  </div>
                </>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default User_profile;
