import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ImageModal = ({ isVisible, data, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isVisible || !data) return null;

  console.log("Data in ImageModal:", data);

  // Handle images as an object with numeric keys
  let imagesArray = [];
  if (data.images) {
    if (Array.isArray(data.images)) {
      imagesArray = data.images;
    } else {
      // Convert object to array
      imagesArray = Object.keys(data.images).map((key) => ({
        imageURL: data.images[key],
        index: parseInt(key),
      }));
    }
  }

  const totalImages = imagesArray.length;
  const currentImage = imagesArray[currentImageIndex] || {};

  // Use imageURL directly if it exists, otherwise use the value itself (which might be a URL string)
  const currentImageUrl = currentImage.imageURL || currentImage;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === totalImages - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Calculate average confidence for AI analysis
  const calculateAverageConfidence = () => {
    if (!data.AiData || data.AiData.length === 0) return 0;

    const sum = data.AiData.reduce((acc, item) => acc + item.probability, 0);
    return (sum / data.AiData.length) * 100;
  };

  const avgConfidence = calculateAverageConfidence();

  // Get confidence color based on average
  const getConfidenceColorClass = () => {
    if (avgConfidence >= 80) return "bg-red-50 border-red-200 text-red-800";
    if (avgConfidence >= 60)
      return "bg-orange-50 border-orange-200 text-orange-800";
    if (avgConfidence >= 40)
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    return "bg-green-50 border-green-200 text-green-800";
  };

  return (
    <div className="imageModal fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[100] px-4 py-6 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-3xl z-10"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Image carousel - fixed height at top */}
        <div className="w-full relative bg-gray-800 flex items-center justify-center p-4 h-[300px] blur-2">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={currentImageUrl}
              alt={`View ${currentImageIndex + 1}`}
              className="rounded-lg max-w-full max-h-full object-contain"
            />

            {totalImages > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 text-gray-800 transition-all"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 text-gray-800 transition-all"
                >
                  <FaChevronRight />
                </button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                  {imagesArray.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 mx-1 rounded-full cursor-pointer ${
                        index === currentImageIndex
                          ? "bg-blue-600"
                          : "bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Scrollable data section below the image */}
        <div className="w-full p-6 overflow-y-auto flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Location Details
          </h2>

          <div className="space-y-4">
            {data.AiData && data.AiData.length > 0 && (
              <div
                className={`p-4 rounded-lg border ${getConfidenceColorClass()}`}
              >
                <h3 className="text-lg font-semibold mb-2">Issue Detection</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">
                      {avgConfidence.toFixed(1)}% Confidence
                    </p>
                    <p className="text-sm">
                      {data.AiData.length} issue
                      {data.AiData.length !== 1 ? "s" : ""} detected
                    </p>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full border-4 border-current flex items-center justify-center">
                      <span className="text-lg font-bold">
                        {Math.round(avgConfidence)}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm mt-2">
                  Analysis Date: {formatDate(data.analysisDate)}
                </p>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Address
              </h3>
              <p className="text-gray-700">{data.street_Address || "N/A"}</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <span className="text-gray-500 text-sm">City:</span>
                  <p className="font-medium">{data.city || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">State:</span>
                  <p className="font-medium">{data.state || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Pincode:</span>
                  <p className="font-medium">{data.pincode || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Coordinates
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500 text-sm">Latitude:</span>
                  <p className="font-medium">{data.latitude || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Longitude:</span>
                  <p className="font-medium">{data.longitude || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                Complaint Details
              </h3>
              <div>
                <span className="text-gray-500 text-sm">Description:</span>
                <p className="font-medium">
                  {data.complaint_description || "N/A"}
                </p>
              </div>
              <div className="mt-2">
                <span className="text-gray-500 text-sm">Status:</span>
                <p
                  className={`font-medium ${
                    data.complaint_status ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {data.complaint_status ? "Resolved" : "Pending"}
                </p>
              </div>
              <div className="mt-2">
                <span className="text-gray-500 text-sm">Uploaded On:</span>
                <p className="font-medium">{formatDate(data.upload_time)}</p>
              </div>
              <div className="mt-2">
                <span className="text-gray-500 text-sm">Path Type:</span>
                <p className="font-medium capitalize">
                  {data.path_type || "N/A"}
                </p>
              </div>
              <div className="mt-2">
                <span className="text-gray-500 text-sm">User Rating:</span>
                <p className="font-medium">{data.rating || "N/A"}/5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
