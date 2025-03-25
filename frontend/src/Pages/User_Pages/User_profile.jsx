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

  useEffect(() => {
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
        setName(data.user_data.displayName);
        setEmail(data.user_data.email);
        setPhone(data.user_data.user_phone);
        setProfile_image(data.user_data.photoURL);
        localStorage.setItem("user_data", JSON.stringify(data.user_data));
        console.log(data);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    };

    const cachedData = localStorage.getItem("user_data");
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setuser_data(parsedData);
      console.log(parsedData);
      setName(parsedData.displayName);
      setEmail(parsedData.email);
      setPhone(parsedData.user_phone);
      setProfile_image(parsedData.photoURL);
    } else {
      get_data();
    }
  }, [apiUrl]);

  const handle_edit_profile = async (e) => {
    e.preventDefault();
    const get_access_token = get_cookies_data(false, true);
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

  const handel_email_vderification = async () => {
    const get_access_token = get_cookies_data(false, true);
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${get_access_token}`,
      },
    };
    const response = await fetch(
      `${apiUrl}/verification/send_verification_email`,
      options
    );
    const data = await response.json();
    if (response.status === 200) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="ml-[-21%] body_services flex justify-center items-center mt-[-2%] xs:text-[0.5rem] ">
      {/* Header Section */}
      <div id="header">
        <h1>Account Information</h1>
        <p>Manage your profile and view uploaded images</p>
      </div>

      {/* Profile Section */}
      <div className="profile w-[90%] xs:w-[70%] xs:m-0 xs:mr-[10%] xs:p-[0.75rem]">
        <h2 className="text-black m-2 text-4xl xs:text-[1.2rem] ">Your Profile</h2>
        {edit_flag ? (
          <form
            className="user-profile profile-edit-card colorful-profile-card text-white"
            onSubmit={handle_edit_profile}
            encType="multipart/form-data"
          >
            <div className="profile-header" id="profile-header">
              <div className="user_profile_img  ">
                <label htmlFor="user_profile">
                  <img
                    src={
                      previewImage
                        ? previewImage
                        : profile_image
                        ? profile_image
                        : "../logos/profile.svg"
                    }
                    alt="User Avatar"
                    className="avatar avatar-edit mb-6 xs:w-[4.5rem] xs:h-[4.5rem]"
                  />
                </label>
                <input
                  className="p-2 border border-gray-300 rounded-lg  text-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600"
                  type="file"
                  id="user_profile"
                  onChange={handleImageChange}
                />
              </div>
              <div className="input_fields mb-auto ">
                <label htmlFor="user_name">Name</label>
                <input
                  className="inputtxt w-full"
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
                  <strong>Phone Number</strong><br />
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
                  <strong>Email</strong><br />
                </label>
                <input
                  type="email"
                  id="user_email"
                  value={email}
                  className="inputtxt"
                  disabled
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </p>
            </div>
            <div className="profile-actions">
              <button className="submit-btn py-[0.5rem] px-[0.75rem] rounded-[0.5rem]" type="submit">
                Save Changes
              </button>
              <button
                className="submit-btn py-[0.5rem] px-[0.75rem] rounded-[0.5rem]"
                onClick={() => {
                  setEdit_flag(!edit_flag);
                }}
              >
                Cancel Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="user-profile profile-view-card colorful-profile-card ">
            <div className="profile-header pb-2">
              <img
                src={
                  user_data.photoURL
                    ? user_data.photoURL
                    : "../logos/profile.svg"
                }
                alt="User Avatar"
                className="avatar avatar-view xs:w-[4.5rem] xs:h-[4.5rem]"
              />
              <h2 className="text-white ">{user_data.displayName}</h2>
            </div>
            <div className="profile-info">
              
              <p className="text-white ">
                <strong className="pr-2 xs:text-[0.75rem]">Phone Number :</strong>{" "}
                <div className="xs:text-[0.75rem]">

                {user_data.user_phone
                  ? `+91 ${user_data.user_phone}`
                  : "Not Provided"}
                  </div>
              </p >
              <p className="text-white xs:text-[0.75rem]">
                <strong className="pr-2 xs:text-[0.75rem]">Email :</strong> 
                <div className="xs:text-[0.75rem]">
                {user_data.email
                  ? `${user_data.email}`
                  : "Not Provided" 
                }
                </div>
              </p>
            </div>
            <div className="profile-actions">
              <button
                className="edit-profile-btn py-[0.5rem] px-[0.75rem] rounded-[0.5rem]"
                onClick={() => {
                  setEdit_flag(!edit_flag);
                  setEmail(user_data.email);
                  setName(user_data.displayName);
                  setPhone(user_data.user_phone);
                }}
              >
                Edit Profile
              </button>
              {/* <button className="change-password-btn py-[0.5rem] px-[0.75rem] rounded-[0.5rem]">Change Password</button>
              <button
                className="change-password-btn py-[0.5rem] px-[0.75rem] rounded-[0.5rem]"
                onClick={() => {
                  handel_email_vderification();
                }}
              >
                Verify Email
              </button> */}
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Images Section */}
      <div id="uploaded-images" className="w-[90%] border-2 border-black p-4 rounded-[5px] mb-5">
        <h2>Images Uploaded By You</h2>
        <div className="examples ">
          <div className="images">
            {user_data.user_images &&
              user_data.user_images.map((image) => (
                <div className="example-image m-2" key={image.image_id}>
                  <img
                    src={`${apiUrl}/user_route/image/${image.image_id}`}
                    alt={image.image_name}
                  />
                  <p className="image-description">{image.description}</p>
                  <p className="image-location">{image.location}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Complaints Section */}
      <div className="complaints-section w-[90%] border-2 border-black p-4 rounded-[5px] ">
        <h2>Your Complaints</h2>
        <div className="complaints">
          {user_data.complaints && user_data.complaints.length > 0 ? (
            user_data.complaints.map((complaint) => (
              <div className="complaint-card border p-4 rounded shadow-md" key={complaint.id}>
                <img src={complaint.image_url} alt="Complaint" className="w-full h-48 object-cover rounded" />
                <p className="mt-2 font-bold">Description: {complaint.description}</p>
                <p>Location: {complaint.location}</p>
                <p>Latitude: {complaint.latitude}, Longitude: {complaint.longitude}</p>
              </div>
            ))
          ) : (
            <p>No complaints found.</p>
          )}
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
