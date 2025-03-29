import React, { useEffect, useState, useRef, useMemo } from "react";
import "../../CSS/User_Css/Profile.css";
import { toast } from "react-toastify";
import { get_cookies_data } from "../../Utility/Auth";
import { useNavigate } from "react-router-dom";

const User_profile = () => {
  const [user_data, setuser_data] = useState({});
  const [edit_flag, setEdit_flag] = useState(false);
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profile_image, setProfile_image] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showEmail, setShowEmail] = useState(false);
  const apiUrl = import.meta.env.VITE_REACT_APP_URL;
  const navigate = useNavigate();

  // Refs for scrollable containers
  const uploadedImagesRef = useRef(null);
  const complaintImagesRefs = useRef({});

  // Function to safely format coordinates
  const formatCoordinate = (coord) => {
    // Check if the coordinate is a string, convert to number first
    const numCoord = typeof coord === "string" ? parseFloat(coord) : coord;

    // Check if the value is a valid number before using toFixed
    return !isNaN(numCoord) ? numCoord.toFixed(5) : "N/A";
  };

  // Calculated stats
  const stats = useMemo(() => {
    if (!user_data.complaints)
      return { total: 0, resolved: 0, avgConfidence: 0 };

    const total = user_data.complaints.length;
    const resolved = user_data.complaints.filter(
      (c) => c.complaint_status
    ).length;

    let totalConfidence = 0;
    let confidenceCount = 0;

    user_data.complaints.forEach((complaint) => {
      if (complaint.AiData && complaint.AiData.length > 0) {
        const complaintAvg =
          complaint.AiData.reduce((sum, ai) => sum + ai.probability, 0) /
          complaint.AiData.length;

        totalConfidence += complaintAvg;
        confidenceCount++;
      }
    });

    const avgConfidence =
      confidenceCount > 0 ? (totalConfidence / confidenceCount) * 100 : 0;

    return { total, resolved, avgConfidence };
  }, [user_data.complaints]);

  // Mask email for privacy
  const maskedEmail = useMemo(() => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    if (username.length <= 3) return email;

    const visibleStart = username.substring(0, 2);
    const visibleEnd = username.substring(username.length - 1);
    const masked = "*".repeat(Math.min(5, username.length - 3));

    return `${visibleStart}${masked}${visibleEnd}@${domain}`;
  }, [email]);

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
        const cachedData = {
          user_data: data.user_data,
          timestamp: new Date().getTime(),
        };
        setuser_data(data.user_data);
        setName(data.user_data.displayName);
        setEmail(data.user_data.email);
        setPhone(data.user_data.user_phone);
        setProfile_image(data.user_data.photoURL);
        localStorage.setItem("user_data", JSON.stringify(cachedData));
        console.log(data);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    };

    const cachedData = localStorage.getItem("user_data");
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const currentTime = new Date().getTime();
      const cacheExpirationTime = 3 * 60 * 1000; // 3 minutes in milliseconds

      if (currentTime - parsedData.timestamp < cacheExpirationTime) {
        setuser_data(parsedData.user_data);
        console.log(parsedData.user_data);
        setName(parsedData.user_data.displayName);
        setEmail(parsedData.user_data.email);
        setPhone(parsedData.user_data.user_phone);
        setProfile_image(parsedData.user_data.photoURL);
      } else {
        get_data();
      }
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
      // Calling the same functionality as in useEffect
      const get_access_token = get_cookies_data(false, true);
      const option = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${get_access_token}`,
        },
      };
      const userResponse = await fetch(`${apiUrl}/user_route/get_user`, option);
      const userData = await userResponse.json();
      if (userResponse.status === 200) {
        const cachedData = {
          user_data: userData.user_data,
          timestamp: new Date().getTime(),
        };
        setuser_data(userData.user_data);
        setName(userData.user_data.displayName);
        setEmail(userData.user_data.email);
        setPhone(userData.user_data.user_phone);
        setProfile_image(userData.user_data.photoURL);
        localStorage.setItem("user_data", JSON.stringify(cachedData));
      }
    } else {
      toast.error("Failed to update profile");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile_image(file);
      setPreviewImage(URL.createObjectURL(file));
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

  // Functions to handle scrolling
  const scrollContainer = (containerRef, direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280; // Adjust scroll amount based on image width + gap
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="ml-[-11%] body_services flex flex-col items-center mt-[-2%]     w-[90vw]; max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div id="header" className="w-full text-center py-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Account Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your profile and view your activities
        </p>
      </div>

      {/* Profile Section */}
      <div className="profile w-full lg:w-4/5 mb-8">
        <h2 className="text-black font-bold text-2xl md:text-3xl mb-4 flex items-center">
          <span>Your Profile</span>
          {user_data.emailVerified && (
            <span className="ml-3 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Verified
            </span>
          )}
        </h2>

        {edit_flag ? (
          <form
            className="user-profile profile-edit-card colorful-profile-card text-white rounded-lg shadow-lg p-6"
            onSubmit={handle_edit_profile}
            encType="multipart/form-data"
          >
            <div
              className="profile-header flex flex-col md:flex-row gap-6 items-center md:items-start"
              id="profile-header"
            >
              <div className="user_profile_img">
                <label htmlFor="user_profile" className="cursor-pointer block">
                  <img
                    src={
                      previewImage
                        ? previewImage
                        : profile_image
                        ? profile_image
                        : "../logos/profile.svg"
                    }
                    alt="User Avatar"
                    className="avatar avatar-edit rounded-full w-24 h-24 md:w-32 md:h-32 object-cover border-4 border-white shadow-md mb-4"
                  />
                </label>
                <input
                  className="p-2 border border-gray-300 rounded-lg text-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600 w-full"
                  type="file"
                  id="user_profile"
                  onChange={handleImageChange}
                />
              </div>
              <div className="input_fields flex-1 w-full">
                <label htmlFor="user_name" className="block mb-2">
                  Name
                </label>
                <input
                  className="inputtxt w-full p-3 bg-gray-700 bg-opacity-50 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="user_name"
                  value={Name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="profile-info mt-6 grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="user_phone" className="block mb-2">
                  <strong>Phone Number</strong>
                </label>
                <input
                  className="inputtxt w-full p-3 bg-gray-700 bg-opacity-50 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  value={phone}
                  id="user_phone"
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </div>
              <div>
                <label htmlFor="user_email" className="block mb-2">
                  <strong>Email</strong>
                </label>
                <input
                  type="email"
                  id="user_email"
                  value={email}
                  className="inputtxt w-full p-3 bg-gray-700 bg-opacity-50 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed opacity-70"
                  disabled
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="profile-actions mt-8 flex flex-wrap gap-4">
              <button
                className="submit-btn bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                type="submit"
              >
                Save Changes
              </button>
              <button
                className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-6 rounded-md shadow-md transition duration-300 ease-in-out"
                type="button"
                onClick={() => {
                  setEdit_flag(!edit_flag);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="user-profile profile-view-card colorful-profile-card rounded-lg shadow-lg p-6 lg:col-span-2">
              <div className="profile-header flex flex-col md:flex-row items-center pb-4 border-b border-gray-600 border-opacity-50">
                <img
                  src={
                    user_data.photoURL
                      ? user_data.photoURL
                      : "../logos/profile.svg"
                  }
                  alt="User Avatar"
                  className="avatar avatar-view rounded-full w-24 h-24 md:w-32 md:h-32 object-cover border-4 border-white shadow-md mb-4 md:mb-0 md:mr-6"
                />
                <div>
                  <h2 className="text-white text-2xl md:text-3xl font-bold">
                    {user_data.displayName}
                  </h2>
                  {!user_data.emailVerified && (
                    <button
                      onClick={handel_email_vderification}
                      className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black text-sm py-1 px-3 rounded-full shadow-md"
                    >
                      Verify Email
                    </button>
                  )}
                </div>
              </div>
              <div className="profile-info mt-6 grid md:grid-cols-2 gap-y-4 gap-x-8">
                <div className="info-item">
                  <span className="text-gray-400 text-sm">Phone Number</span>
                  <p className="text-white text-lg">
                    {user_data.user_phone
                      ? `+91 ${user_data.user_phone}`
                      : "Not Provided"}
                  </p>
                </div>
                <div className="info-item relative">
                  <span className="text-gray-400 text-sm">Email</span>
                  <div className="flex items-center">
                    <p className="text-white text-lg mr-2">
                      {showEmail ? email : maskedEmail}
                    </p>
                    <button
                      onClick={() => setShowEmail(!showEmail)}
                      className="text-gray-300 hover:text-white transition-colors"
                      aria-label={showEmail ? "Hide email" : "Show email"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {showEmail ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="profile-actions mt-8">
                <button
                  className="edit-profile-btn bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => {
                    setEdit_flag(!edit_flag);
                    setEmail(user_data.email);
                    setName(user_data.displayName);
                    setPhone(user_data.user_phone);
                  }}
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <h3 className="text-white text-lg font-bold">
                  Activity Summary
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="stat-item text-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-3xl font-bold text-blue-600">
                      {stats.total}
                    </span>
                    <p className="text-gray-600 text-sm mt-1">
                      Total Complaints
                    </p>
                  </div>
                  <div className="stat-item text-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-3xl font-bold text-green-600">
                      {stats.resolved}
                    </span>
                    <p className="text-gray-600 text-sm mt-1">Resolved</p>
                  </div>
                </div>

                {stats.avgConfidence > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm text-gray-500 mb-1">
                      Average AI Confidence
                    </h4>
                    <div className="flex items-center">
                      <img
                        src="/logos/ai.png"
                        alt="AI Logo"
                        className="w-5 h-5 mr-2"
                      />
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, stats.avgConfidence)
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {stats.avgConfidence.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-amber-500 text-center mt-2">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <span key={i} className="text-xl">
                            {i < Math.round(stats.avgConfidence / 20)
                              ? "★"
                              : "☆"}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate("/")}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    New Complaint
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Images Section */}
      <div
        id="uploaded-images"
        className="w-full lg:w-4/5 mb-8 bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Your Uploaded Images
          </h2>
        </div>

        <div className="p-6">
          {user_data.user_images && user_data.user_images.length > 0 ? (
            <div className="relative">
              {/* Navigation buttons - visible only on desktop */}
              <div className="hidden md:block">
                <button
                  onClick={() => scrollContainer(uploadedImagesRef, "left")}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition duration-300"
                  aria-label="Scroll left"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => scrollContainer(uploadedImagesRef, "right")}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition duration-300"
                  aria-label="Scroll right"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Scrollable images container */}
              <div
                ref={uploadedImagesRef}
                className="overflow-x-auto pb-4 hide-scrollbar mx-8"
              >
                <div className="flex gap-4 snap-x snap-mandatory">
                  {user_data.user_images.map((image) => (
                    <div
                      className="example-image snap-center flex-shrink-0 w-64 rounded-lg overflow-hidden shadow-md bg-gray-100 border border-gray-200 transition-transform transform hover:scale-[1.02]"
                      key={image.image_id}
                    >
                      <img
                        src={`${apiUrl}/user_route/image/${image.image_id}`}
                        alt={image.image_name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3">
                        <p className="font-medium text-gray-800">
                          {image.description || "No description"}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {image.location || "No location"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile scroll indicator */}
              <div className="md:hidden absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-white to-transparent pl-10 pr-2 pointer-events-none">
                <span className="text-gray-600">Scroll →</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500">No images uploaded yet.</p>
              <p className="text-gray-400 text-sm mt-1">
                Images you upload will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Complaints Section */}
      <div className="complaints-section w-full lg:w-4/5 mb-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Your Complaints</h2>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">
              {stats.resolved} of {stats.total} resolved
            </span>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${
                    stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="complaints space-y-6">
            {user_data.complaints && user_data.complaints.length > 0 ? (
              user_data.complaints.map((complaint, index) => {
                // Calculate average confidence for AI data
                let averageConfidence = 0;
                if (complaint.AiData && complaint.AiData.length > 0) {
                  const totalConfidence = complaint.AiData.reduce(
                    (sum, ai) => sum + ai.probability,
                    0
                  );
                  averageConfidence =
                    (totalConfidence / complaint.AiData.length) * 100;
                }

                // Check if there are multiple images
                const hasMultipleImages =
                  complaint.images &&
                  Object.values(complaint.images).length > 1;

                return (
                  <div
                    className="complaint-card bg-gray-50 border border-gray-200 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                    key={index}
                  >
                    {/* Status badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          complaint.complaint_status
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {complaint.complaint_status ? "Resolved" : "Pending"}
                      </span>
                    </div>

                    {/* Images section with horizontal scroll */}
                    <div className="relative">
                      {/* Navigation buttons - visible only on desktop and when multiple images */}
                      {hasMultipleImages && (
                        <div className="hidden md:block">
                          <button
                            onClick={() =>
                              scrollContainer(
                                complaintImagesRefs.current[index],
                                "left"
                              )
                            }
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition duration-300"
                            aria-label="Scroll left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-gray-800"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              scrollContainer(
                                complaintImagesRefs.current[index],
                                "right"
                              )
                            }
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition duration-300"
                            aria-label="Scroll right"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-gray-800"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Scrollable images container */}
                      <div
                        ref={(el) => (complaintImagesRefs.current[index] = el)}
                        className={`overflow-x-auto hide-scrollbar ${
                          hasMultipleImages ? "mx-8" : ""
                        }`}
                      >
                        <div className="flex gap-2 snap-x snap-mandatory">
                          {complaint.images &&
                            Object.values(complaint.images).map(
                              (imageUrl, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  src={imageUrl}
                                  alt={`Complaint Image ${imgIndex + 1}`}
                                  className="w-80 h-48 object-cover flex-shrink-0 snap-center"
                                />
                              )
                            )}
                        </div>
                      </div>

                      {/* Mobile scroll indicator - only show when multiple images */}
                      {hasMultipleImages && (
                        <div className="md:hidden absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-gray-900/70 to-transparent pl-10 pr-2 pointer-events-none">
                          <span className="text-white text-sm">Scroll →</span>
                        </div>
                      )}
                    </div>

                    {/* Complaint details */}
                    <div className="p-4">
                      <p className="font-bold text-lg text-gray-800 mb-2">
                        {complaint.complaint_description || "No description"}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Location
                          </p>
                          <p className="text-gray-800">
                            {complaint.street_Address || "No location provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                              />
                            </svg>
                            Coordinates
                          </p>
                          <p className="text-gray-800 text-sm">
                            Lat: {formatCoordinate(complaint.latitude)}, Long:{" "}
                            {formatCoordinate(complaint.longitude)}
                          </p>

                          <div className="text-sm text-gray-500 flex items-center mt-2 felx-col">
                            <p className="text-sm">Complaint Type :{"  "} </p>
                            <p className="text-sm text-black ml-1">
                              {" "}
                              {complaint.path_type}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Analysis section */}
                    {complaint.AiData && complaint.AiData.length > 0 && (
                      <div className="ai-data bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 rounded-b-xl">
                        <div className="flex items-center mb-3">
                          <img
                            src="/logos/ai.png"
                            alt="AI Logo"
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                            AI Analysis
                          </h4>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center mb-1">
                              <p className="text-blue-200 mr-2">Confidence:</p>
                              <div className="w-32 bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-indigo-400 h-2 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      averageConfidence
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm font-bold text-white">
                                {averageConfidence.toFixed(1)}%
                              </span>
                            </div>
                            <p className="text-amber-300 mt-2">
                              <div className="flex items-center gap-1 mb-1">
                                <img
                                  src="/logos/profile.svg"
                                  alt="profile img"
                                  className="w-4 h-4"
                                />
                                <h1 className="text-white text-xs font-semibold">
                                  User Rating
                                </h1>
                              </div>
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <span key={i} className="text-xl">
                                    {i < Math.round(averageConfidence / 20)
                                      ? "★"
                                      : "☆"}
                                  </span>
                                ))}
                            </p>
                          </div>
                          <div className="text-right text-xs text-gray-300">
                            {complaint.analysisDate ||
                              new Date().toLocaleDateString()}
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-indigo-700">
                          <p className="text-sm text-indigo-200">
                            {complaint.AiData.map(
                              (ai) => ai.tag || ai.class
                            ).join(", ")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">No complaints submitted yet.</p>
                <p className="text-gray-400 text-sm mt-1 mb-4">
                  Submit your first complaint to see it here
                </p>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm transition duration-300 flex items-center justify-center mx-auto"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Submit New Complaint
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        id="footer"
        className="w-full text-center py-6 text-gray-600 text-sm"
      >
        <p>&copy; 2024 Walkez. All Rights Reserved.</p>
      </div>

      {/* Add custom styling for hiding scrollbars but keeping functionality */}
      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default User_profile;
