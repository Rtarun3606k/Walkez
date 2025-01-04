import React, { useEffect, useState } from "react";
import "../../CSS/User_Css/Profile.css"; // Ensure this has the necessary styles
import { toast } from "react-toastify";
import { get_cookies_data } from "../../Utility/Auth";

const User_profile = () => {
  const [user_data, setuser_data] = useState({});
  const [edit_flag, setEdit_flag] = useState(false);
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profile_image, setProfile_image] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // For real-time image preview
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


     //cache data in local storage
  useEffect(() => {
    const cachedData = localStorage.getItem("user_data");
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setuser_data(parsedData);
      setName(parsedData.user_name);
      setEmail(parsedData.user_email);
      setPhone(parsedData.user_phone);
    } else {
      get_data();
    }
  }, []);

    const response = await fetch(`${apiUrl}/user_route/get_user`, option);
    const data = await response.json();
    if (response.status === 200) {
      setuser_data(data.user_data);
      setName(data.user_data.user_name);
      setEmail(data.user_data.user_email);
      setPhone(data.user_data.user_phone);
      localStorage.setItem("user_data", JSON.stringify(data.user_data));
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
      toast.success("Profile updated successfully");
      setEdit_flag(false);
      get_data();
    } else {
      toast.error("Failed to update profile");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile_image(file);
      setPreviewImage(URL.createObjectURL(file)); // Real-time preview
    }
  };

  const handel_email_vderification = async (email_determinator) => {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${get_access_token}`,
      },
    };
    console.log("email determinator", email_determinator);
    const response = await fetch(
      email_determinator
        ? `${apiUrl}/verification/send_verification_email`
        : `${apiUrl}/verification/send_change_password`,

      options
    );
    const data = await response.json();
    if (response.status === 200) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    get_data();
  }, []);

  return (
    <div className="body_services">
      {/* Header Section */}
      <div id="header">
        <h1>Account Information</h1>
        <p>Manage your profile and view uploaded images</p>
      </div>

      {/* Profile Section */}
      <div className="profile">
        <h2 className="text-white">Your Profile</h2>
        {edit_flag ? (
          <form
            className="user-profile profile-edit-card colorful-profile-card"
            onSubmit={handle_edit_profile}
            encType="multipart/form-data"
          >
            <div className="profile-header" id="profile-header">
              <div className="user_profile_img">
                <label htmlFor="user_profile">
                  <img
                    src={
                      previewImage
                        ? previewImage
                        : user_data.profile_image
                        ? `${apiUrl}/user_profile_route/get_profile_image/${user_data.user_id}`
                        : "../logos/profile.svg"
                    }
                    alt="User Avatar"
                    className="avatar avatar-edit"
                  />
                </label>
                <input
                  type="file"
                  id="user_profile"
                  onChange={handleImageChange}
                />
              </div>
              <div className="input_fields">
                <label htmlFor="user_name">Name</label>
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
                  <strong>Phone Number</strong>
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
                  <strong>Email</strong>
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
              <button className="submit-btn" type="submit">
                Save Changes
              </button>
              <button
                className="submit-btn"
                onClick={() => {
                  setEdit_flag(!edit_flag);
                }}
              >
                Cancle Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="user-profile profile-view-card colorful-profile-card">
            <div className="profile-header">
              <img
                src={
                  user_data.profile_image
                    ? `${apiUrl}/user_profile_route/get_profile_image/${user_data.user_id}`
                    : "../logos/profile.svg"
                }
                alt="User Avatar"
                className="avatar avatar-view"
              />
              <h2>{user_data.user_name}</h2>
            </div>
            <div className="profile-info">
              <p>
                <strong>Phone Number:</strong>{" "}
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
                className="edit-profile-btn"
                onClick={() => {
                  setEdit_flag(!edit_flag);
                  setEmail(user_data.user_email);
                  setName(user_data.user_name);
                  setPhone(user_data.user_phone);
                }}
              >
                Edit Profile
              </button>
              <button
                className="change-password-btn"
                onClick={() => {
                  handel_email_vderification(false);
                }}
              >
                Change Password
              </button>
              <button
                className="change-password-btn"
                onClick={() => {
                  handel_email_vderification(true);
                }}
              >
                Verify Email
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Images Section */}
      <div id="why-choose">
        <h2>Images Uploaded By You</h2>
        <div className="examples">
          <div className="images">
            {user_data.user_images &&
              user_data.user_images.map((image) => (
                <div className="example-image" key={image.image_id}>
                  <img
                    src={`${apiUrl}/user_route/image/${image.image_id}`}
                    alt={image.image_name}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Hidden Footer for consistency */}
      <div id="footer">
        <p>&copy; 2024 Your Company Name. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default User_profile;