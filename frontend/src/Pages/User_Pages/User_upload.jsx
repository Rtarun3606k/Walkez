import React, { useEffect, useState, useRef } from "react";
import { check_token } from "../../Utility/Cookies_validator";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { get_cookies_data } from "../../Utility/Auth";
import Rating from "../User_Pages/Components/Rating"; // Correct the path
import { reverseGeocoding } from "../../Utility/ReverseGeoCoding";

const User_upload = () => {
  const url = import.meta.env.VITE_REACT_APP_URL;
  const { lat, long } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedPath, setSelectedPath] = useState(""); // State for selected radio button
  const [otherPathType, setOtherPathType] = useState("");
  const [rating, setRating] = useState(0); // State for star rating
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    console.log(check_token(), "check_token");
    if (!get_cookies_data(false, true)) {
      toast.error("Please login to access this page.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      navigate("/login");
    }
  }, [navigate]);

  // Function to request camera access
  const openCamera = async () => {
    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Prefer back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      // Store the stream reference for later cleanup
      streamRef.current = stream;

      // Set the video source to the stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setShowCamera(true);
      setCameraPermission(true);
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraPermission(false);

      // Show appropriate error message based on error type
      if (err.name === "NotAllowedError") {
        toast.error("Camera access denied. Please allow camera access.", {
          position: "top-center",
          theme: "dark",
        });
      } else {
        toast.error(
          "Couldn't access your camera. Please check your device settings.",
          {
            position: "top-center",
            theme: "dark",
          }
        );
      }
    }
  };

  // Function to capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !photoRef.current) return;

    const video = videoRef.current;
    const canvas = photoRef.current;

    // Set canvas dimensions to match video
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    // Draw the current video frame to the canvas
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, width, height);

    // Convert the canvas to a blob
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        // Create a File object from the blob
        const file = new File([blob], `camera-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        // Add the file to images state
        setImages((prevImages) => [...prevImages, file]);

        // Create and add preview URL
        const newPreview = URL.createObjectURL(blob);
        setPreviewImages((prevPreviews) => [...prevPreviews, newPreview]);

        // Close camera
        closeCamera();

        toast.success("Photo captured successfully!", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      },
      "image/jpeg",
      0.9
    );
  };

  // Function to close camera
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  // Cleanup camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handle_submit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one image", {
        position: "top-center",
        theme: "dark",
      });
      return;
    }

    if (!selectedPath) {
      toast.error("Please select a path type", {
        position: "top-center",
        theme: "dark",
      });
      return;
    }

    setUploading(true);

    try {
      const placeData = await reverseGeocoding(long, lat);

      const formData = new FormData();
      formData.append("latitude", lat);
      formData.append("longitude", long);
      formData.append(
        "path_type",
        selectedPath === "other" ? otherPathType : selectedPath
      );
      formData.append("rating", rating);
      formData.append("complaint_description", description);
      formData.append("street_Address", placeData.formattedAddress);
      formData.append("state", placeData.stateName);
      formData.append("city", placeData.cityName);
      formData.append("pincode", placeData.pincode);

      // Append multiple images to formData
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      const response = await fetch(`${url}/user_route/add_image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${get_cookies_data(false, true)}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success(`${data.message}`, {
          position: "top-center",
          theme: "dark",
        });
        navigate("/");
      } else if (response.status === 401) {
        toast.error(`${data.message}`, {
          position: "top-center",
          theme: "dark",
        });
      } else {
        toast.error(`${data.message}`, {
          position: "top-center",
          theme: "dark",
        });
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
        theme: "dark",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const fileList = e.target.files;
    if (fileList.length > 0) {
      const filesArray = Array.from(fileList);
      setImages((prevImages) => [...prevImages, ...filesArray]);

      // Create preview URLs
      const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages((prevPreviews) => [...prevPreviews, ...previewsArray]);
    }
  };

  const handleRadioChange = (e) => {
    setSelectedPath(e.target.value); // Set the selected path
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setImages((prevImages) => [...prevImages, ...filesArray]);

      // Create preview URLs
      const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages((prevPreviews) => [...prevPreviews, ...previewsArray]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]); // Clean up the URL
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  return (
    <div className="body_services flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 ml-[-15vw]">
      {/* Camera Interface Overlay */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Camera feed */}
          <div className="relative flex-1 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Guidelines overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-white border-opacity-70 rounded-lg w-4/5 h-3/5 flex items-center justify-center">
                <div className="text-white text-opacity-80 text-center p-4 bg-black bg-opacity-30 rounded">
                  <p>Position the path issue within the frame</p>
                </div>
              </div>
            </div>

            {/* Top bar with close button */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
              <button
                onClick={closeCamera}
                className="bg-red-500 rounded-full w-10 h-10 flex items-center justify-center text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div className="text-white font-medium">Camera</div>
              <div className="w-10"></div> {/* Spacer for alignment */}
            </div>
          </div>

          {/* Camera controls */}
          <div className="h-24 bg-black flex items-center justify-center">
            <button
              onClick={capturePhoto}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-blue-500"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
            </button>
          </div>

          {/* Hidden canvas for capturing photo */}
          <canvas ref={photoRef} style={{ display: "none" }}></canvas>
        </div>
      )}

      {/* AI Processing Overlay */}
      {uploading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="relative">
            {/* First AI icon (back) */}
            <div className="absolute top-0 left-0 transform -translate-x-10 animate-pulse">
              <div className="animate-[ping_3s_infinite] opacity-70">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="40" fill="url(#gradient1)" />
                  <path
                    d="M65 40L50 55L35 40"
                    stroke="white"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="gradient1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#6A11CB" />
                      <stop offset="100%" stopColor="#2575FC" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Main AI icon */}
            <div className="relative animate-bounce animation-delay-300">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.25 15L12 19.25L4.75 15"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.25 9V15"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.75 9V15"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 13.25V19.25"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Second AI icon (front) */}
            <div className="absolute bottom-0 right-0 transform translate-x-10 animate-pulse animation-delay-500">
              <div className="animate-[ping_2s_infinite] opacity-70">
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="40" fill="url(#gradient2)" />
                  <path
                    d="M38 38L62 62M38 62L62 38"
                    stroke="white"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="gradient2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#2575FC" />
                      <stop offset="100%" stopColor="#6A11CB" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-white text-2xl font-bold mb-2 animate-pulse">
              AI is analyzing your images
            </h3>
            <p className="text-blue-200 max-w-md">
              Our system is processing your upload and analyzing path
              conditions. This might take a moment...
            </p>
          </div>
        </div>
      )}

      <div
        id="services"
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
            Upload Street Images
          </h1>
          <p className="mt-2 text-blue-100 text-center">
            Help improve walkability by sharing images of problematic paths and
            roads.
          </p>
        </div>

        <div className="p-6 md:p-8">
          <form
            encType="multipart/form-data"
            onSubmit={handle_submit}
            className="space-y-6"
          >
            {/* Image Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all
                ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                }
                ${images.length > 0 ? "border-green-400 bg-green-50" : ""}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="imageUpload"
                name="image"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                disabled={uploading}
              />

              {previewImages.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {previewImages.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={uploading}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="w-24 h-24 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="h-11 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                        disabled={uploading}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 5V19M5 12H19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={openCamera}
                        className="h-11 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors"
                        disabled={uploading}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 11a4 4 0 118 0 4 4 0 01-8 0z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 20l-3.5-3.5M2 8h2m18 0h-2M7 3.5V6M17 3.5V6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3 8a1 1 0 011-1h16a1 1 0 011 1v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {images.length} image(s) selected
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="space-y-4">
                    <div className="flex flex-col items-center text-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <p className="mb-2 text-lg font-semibold text-gray-700">
                        Add images
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        PNG, JPG, or JPEG (max 10MB per image)
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
                        disabled={uploading}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2"
                        >
                          <path
                            d="M12 5V19M5 12H19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Browse files
                      </button>
                      <button
                        type="button"
                        onClick={openCamera}
                        className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
                        disabled={uploading}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2"
                        >
                          <path
                            d="M8 11a4 4 0 118 0 4 4 0 01-8 0z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 20l-3.5-3.5M2 8h2m18 0h-2M7 3.5V6M17 3.5V6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3 8a1 1 0 011-1h16a1 1 0 011 1v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Use Camera
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 pt-2">
                      Or drop files here
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Camera permission denied message */}
            {cameraPermission === false && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 mt-0.5 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Camera access denied</p>
                    <p className="mt-1">
                      Please allow camera access in your browser settings to use
                      this feature.
                    </p>
                    <button
                      type="button"
                      onClick={openCamera}
                      className="mt-2 text-yellow-700 underline hover:text-yellow-800"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Path Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Select the type of path:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedPath === "footpath"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="path"
                    id="footpath"
                    value="footpath"
                    onChange={handleRadioChange}
                    checked={selectedPath === "footpath"}
                    className="sr-only"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="footpath"
                    className="flex items-center cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                        selectedPath === "footpath"
                          ? "border-blue-500"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedPath === "footpath" && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <span
                      className={
                        selectedPath === "footpath"
                          ? "text-blue-700 font-medium"
                          : "text-gray-700"
                      }
                    >
                      Footpath
                    </span>
                  </label>
                </div>

                <div
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedPath === "road"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="path"
                    id="road"
                    value="road"
                    onChange={handleRadioChange}
                    checked={selectedPath === "road"}
                    className="sr-only"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="road"
                    className="flex items-center cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                        selectedPath === "road"
                          ? "border-blue-500"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedPath === "road" && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <span
                      className={
                        selectedPath === "road"
                          ? "text-blue-700 font-medium"
                          : "text-gray-700"
                      }
                    >
                      Road
                    </span>
                  </label>
                </div>

                <div
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedPath === "other"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="path"
                    id="other"
                    value="other"
                    onChange={handleRadioChange}
                    checked={selectedPath === "other"}
                    className="sr-only"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="other"
                    className="flex items-center cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                        selectedPath === "other"
                          ? "border-blue-500"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedPath === "other" && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <span
                      className={
                        selectedPath === "other"
                          ? "text-blue-700 font-medium"
                          : "text-gray-700"
                      }
                    >
                      Other
                    </span>
                  </label>
                </div>
              </div>

              {selectedPath === "other" && (
                <input
                  type="text"
                  value={otherPathType}
                  onChange={(e) => setOtherPathType(e.target.value)}
                  placeholder="Please specify the path type"
                  className="mt-3 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  disabled={uploading}
                />
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                placeholder="Describe the issue with this path (e.g., broken pavement, obstacles, etc.)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                disabled={uploading}
              />
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Rate the path based on its walkability:
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Rating rating={rating} setRating={setRating} />
              </div>
            </div>

            {/* Location */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="text-sm font-medium text-blue-800 flex items-center mb-2">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                Selected Location
              </h4>
              <p className="text-blue-600 text-sm font-mono">
                Latitude: {parseFloat(lat).toFixed(6)}, Longitude:{" "}
                {parseFloat(long).toFixed(6)}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl"
              }`}
              disabled={uploading}
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  Upload Images
                </div>
              )}
            </button>
          </form>

          {/* Example Images Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Example Images
            </h2>
            <p className="text-gray-600 mb-6">
              These are examples of path conditions that can be reported:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 justify-center items-center">
              {[2, 3, 4, 6].map((num) => (
                <div
                  key={num}
                  className="group relative overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg"
                >
                  <img
                    src={`/../logos/example${num}.png`}
                    alt={`Example ${num}`}
                    className="w-full h-32 object-cover rounded-lg transition-transform transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-semibold">
                      Example {num}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-2 rounded-b-lg">
                    <p className="text-gray-700 text-sm">
                      Description of the path condition.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User_upload;
