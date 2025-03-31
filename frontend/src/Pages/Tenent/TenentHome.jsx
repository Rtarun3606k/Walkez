import React, { useEffect, useState } from "react";
import { tenent_get_cookies_data } from "../../Utility/TenentCookies";
import { useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Rating from "../User_Pages/Components/Rating";
import { toast } from "react-toastify";

const TenentHome = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enlargedImageIndex, setEnlargedImageIndex] = useState(0);
  const [enlargedImages, setEnlargedImages] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closeReason, setCloseReason] = useState("");
  const [closeComment, setCloseComment] = useState("");
  const [error, setError] = useState(null);
  const [closeRating, setCloseRating] = useState(0);

  const predefinedReasons = [
    "Repaired",
    "Infrastructure work completed",
    "Regular maintenance done",
    "New pavement installed",
    "Filled potholes",
    "Resolved drainage issue",
    "Cleared debris",
    "Road resurfaced",
    "Installed safety barriers",
    "Added better signage",
    "Installed street lighting",
    "Fixed accessibility issues",
  ];

  const getData = async () => {
    try {
      setLoading(true);
      const token = tenent_get_cookies_data(false, true);
      if (!token) {
        throw new Error("Invalid token");
      }

      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const request = await fetch(
        `${import.meta.env.VITE_REACT_APP_URL}/tenent_admin_home/getComplaints`,
        options
      );

      const response = await request.json();
      if (request.status === 200) {
        console.log("Response:", response);
        setComplaints(response || []);
      } else {
        setError(response.message || "Failed to fetch complaints");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const closeComplaint = async () => {
    try {
      if (!selectedComplaint || !closeReason) {
        toast.error("Please select a reason for closing the complaint");
        return;
      }

      const token = tenent_get_cookies_data(false, true);
      if (!token) {
        throw new Error("Invalid token");
      }

      // Show loading state
      setLoading(true);

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          complaint_id: selectedComplaint.id,
          complaint_closed_reason: closeReason,
          complaint_closed_comment: closeComment,
          complaint_closed_rating: closeRating,
        }),
      };

      const request = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_URL
        }/tenent_admin_home/closeComplaint`,
        options
      );

      const response = await request.json();
      if (request.status === 200) {
        // Update the local state to reflect the change
        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint.id === selectedComplaint.id
              ? {
                  ...complaint,
                  complaint_status: true,
                  complaint_closed_reason: closeReason,
                  complaint_closed_comment: closeComment,
                  complaint_closed_rating: closeRating,
                }
              : complaint
          )
        );

        // Show success message
        toast.success("Complaint resolved successfully!");

        // Reset modal state
        setShowCloseModal(false);
        setSelectedComplaint(null);
        setCloseReason("");
        setCloseComment("");
        setCloseRating(0);

        // Refresh data to ensure UI is up to date
        getData();
      } else {
        toast.error(response.message || "Failed to close complaint");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  useEffect(() => {
    const token = tenent_get_cookies_data(false, true);
    if (!token) {
      navigate("/tenent/login");
      return;
    }

    getData();
  }, [navigate]);

  const getAIConfidenceColor = (complaint) => {
    if (!complaint.AiData || complaint.AiData.length === 0)
      return "bg-gray-100";

    const total = complaint.AiData.reduce(
      (sum, item) => sum + item.probability,
      0
    );
    const avg = (total / complaint.AiData.length) * 100;

    if (avg >= 80) return "bg-red-100 border-red-300";
    if (avg >= 60) return "bg-orange-100 border-orange-300";
    if (avg >= 40) return "bg-yellow-100 border-yellow-300";
    return "bg-green-100 border-green-300";
  };

  const getFirstImageUrl = (complaint) => {
    if (!complaint.images) return null;

    if (Array.isArray(complaint.images) && complaint.images.length > 0) {
      return complaint.images[0].imageURL || complaint.images[0];
    }

    if (typeof complaint.images === "object") {
      const keys = Object.keys(complaint.images);
      if (keys.length > 0) {
        return complaint.images[keys[0]];
      }
    }

    return null;
  };

  const getAllImages = (complaint) => {
    if (!complaint.images) return [];

    if (Array.isArray(complaint.images)) {
      return complaint.images.map((img) => img.imageURL || img);
    }

    if (typeof complaint.images === "object") {
      return Object.values(complaint.images);
    }

    return [];
  };

  const openEnlargedImageView = (complaint) => {
    setEnlargedImages(getAllImages(complaint));
    setEnlargedImageIndex(0);
    setSelectedComplaint(complaint);
  };

  const prevImage = () => {
    if (!enlargedImages || enlargedImages.length <= 1) return;
    setEnlargedImageIndex((prev) =>
      prev === 0 ? enlargedImages.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    if (!enlargedImages || enlargedImages.length <= 1) return;
    setEnlargedImageIndex((prev) =>
      prev === enlargedImages.length - 1 ? 0 : prev + 1
    );
  };

  const closeEnlargedView = () => {
    setEnlargedImages(null);
    setEnlargedImageIndex(0);
    setSelectedComplaint(null);
  };

  const hasMultipleImages = (complaint) => {
    const images = getAllImages(complaint);
    return images.length > 1;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center">
        Complaint Management Dashboard
      </h1>

      {loading ? (
        <div className="w-full flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg shadow text-center">
          <FaExclamationTriangle className="inline-block mr-2" />
          No complaints found in the system.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <div
              key={
                complaint.id ||
                complaint._id ||
                `${complaint.user_id}-${complaint.upload_time}`
              }
              className={`bg-white rounded-lg shadow-md overflow-hidden border ${
                complaint.complaint_status
                  ? "border-green-300"
                  : "border-yellow-300"
              }`}
            >
              {/* Image section */}
              <div
                className="relative h-48 bg-gray-200 cursor-pointer overflow-hidden"
                onClick={() => openEnlargedImageView(complaint)}
              >
                {getFirstImageUrl(complaint) ? (
                  <>
                    <img
                      src={getFirstImageUrl(complaint)}
                      alt="Complaint"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {hasMultipleImages(complaint) && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                        +{getAllImages(complaint).length - 1} more
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                    No image available
                  </div>
                )}
                <div
                  className={`absolute top-0 right-0 m-2 px-2 py-1 rounded-full text-xs font-bold ${
                    complaint.complaint_status
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {complaint.complaint_status ? "Resolved" : "Pending"}
                </div>
              </div>

              {/* Content section */}
              <div className="p-4">
                <div className="mb-3">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    {complaint.street_Address ? (
                      <div className="truncate">
                        {complaint.street_Address.split(",")[0]}
                      </div>
                    ) : (
                      "Address not available"
                    )}
                  </h2>

                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-100">
                    <p className="mb-1 truncate">{complaint.street_Address}</p>
                    <p>
                      {complaint.city}, {complaint.state} - {complaint.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-gray-500">
                    {formatDate(complaint.upload_time)}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-1">Rating:</span>
                    <span className="text-yellow-500 font-bold">
                      {complaint.rating || "N/A"}/5
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {complaint.complaint_description ||
                      "No description provided"}
                  </p>
                </div>

                {complaint.AiData && complaint.AiData.length > 0 && (
                  <div
                    className={`${getAIConfidenceColor(
                      complaint
                    )} px-3 py-2 rounded-md mb-3 border`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold">
                        Issue Detection
                      </span>
                      <span className="text-xs font-bold">
                        {(
                          (complaint.AiData.reduce(
                            (sum, item) => sum + item.probability,
                            0
                          ) /
                            complaint.AiData.length) *
                          100
                        ).toFixed(0)}
                        % confidence
                      </span>
                    </div>
                  </div>
                )}

                {!complaint.complaint_status && (
                  <button
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setShowCloseModal(true);
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                  >
                    Close Complaint
                  </button>
                )}

                {complaint.complaint_status && (
                  <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-200">
                    <p className="text-xs font-medium text-green-800">
                      Resolved: {complaint.complaint_closed_reason || "N/A"}
                    </p>
                    {complaint.complaint_closed_comment && (
                      <p className="text-xs text-green-700 mt-1">
                        {complaint.complaint_closed_comment}
                      </p>
                    )}
                    {complaint.complaint_closed_rating > 0 && (
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-green-700 mr-1">
                          Rating:
                        </span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-xs text-yellow-500">
                              {i < complaint.complaint_closed_rating
                                ? "★"
                                : "☆"}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Enlarged Image Modal with multiple images */}
      {enlargedImages && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4"
          onClick={closeEnlargedView}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeEnlargedView}
              className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-gray-200 z-10 shadow-lg"
            >
              <FaTimes size={20} />
            </button>

            {/* Main image */}
            <div className="bg-gray-900 rounded-t-lg overflow-hidden relative">
              <img
                src={enlargedImages[enlargedImageIndex]}
                alt={`View ${enlargedImageIndex + 1}`}
                className="max-w-full max-h-[70vh] object-contain mx-auto"
              />

              {/* Navigation arrows */}
              {enlargedImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3"
                  >
                    <FaChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3"
                  >
                    <FaChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {enlargedImageIndex + 1} / {enlargedImages.length}
              </div>
            </div>

            {/* Image thumbnails */}
            {enlargedImages.length > 1 && (
              <div className="bg-gray-800 p-4 rounded-b-lg overflow-x-auto whitespace-nowrap">
                <div className="flex space-x-2">
                  {enlargedImages.map((img, index) => (
                    <div
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEnlargedImageIndex(index);
                      }}
                      className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden cursor-pointer border-2 ${
                        index === enlargedImageIndex
                          ? "border-blue-500"
                          : "border-transparent"
                      } transition-all duration-200 hover:opacity-90`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location info */}
            {selectedComplaint && (
              <div className="bg-white rounded-b-lg p-4 mt-1 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Location Details
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedComplaint.street_Address}
                </p>
                <div className="flex flex-wrap justify-between text-xs text-gray-500">
                  <div>
                    <strong>City:</strong> {selectedComplaint.city}
                  </div>
                  <div>
                    <strong>State:</strong> {selectedComplaint.state}
                  </div>
                  <div>
                    <strong>PIN:</strong> {selectedComplaint.pincode}
                  </div>
                  <div>
                    <strong>Reported:</strong>{" "}
                    {formatDate(selectedComplaint.upload_time)}
                  </div>
                </div>

                {selectedComplaint.complaint_status && (
                  <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                    <h4 className="text-sm font-semibold text-green-800">
                      Resolution Details
                    </h4>
                    <p className="text-xs mt-1">
                      <strong>Action:</strong>{" "}
                      {selectedComplaint.complaint_closed_reason}
                    </p>
                    {selectedComplaint.complaint_closed_comment && (
                      <p className="text-xs mt-1">
                        <strong>Comments:</strong>{" "}
                        {selectedComplaint.complaint_closed_comment}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Close Complaint Modal */}
      {showCloseModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Close Complaint
            </h3>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Reason:
              </label>
              <select
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">-- Select a reason --</option>
                {predefinedReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Additional Comment:
              </label>
              <textarea
                value={closeComment}
                onChange={(e) => setCloseComment(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                placeholder="Add any additional details about the resolution..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Rate your resolution:
              </label>
              <Rating rating={closeRating} setRating={setCloseRating} />
              <p className="text-xs text-gray-500 mt-1">
                How would you rate the quality of this resolution?
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCloseModal(false);
                  setSelectedComplaint(null);
                  setCloseReason("");
                  setCloseComment("");
                  setCloseRating(0);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={closeComplaint}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded flex items-center"
                disabled={!closeReason}
              >
                <FaCheckCircle className="mr-2" />
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenentHome;
