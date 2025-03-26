import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../../CSS/User_Css/adminUserPage.css"; // Import the CSS file
import { admin_get_cookies_data } from "../../Utility/AdminAuth";

const AdminHomePage = () => {
  const [complaintsData, setComplaintsData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!admin_get_cookies_data(false, true)) {
      window.location.href = "/admin";
    }
  }, []);

  const fetchInitialData = async () => {
    try {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin_get_cookies_data(false, true)}`,
        },
      };

      const response = await fetch(
        import.meta.env.VITE_REACT_APP_URL + "/admin_complaints/get_complaints",
        options
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast.success("Data fetched successfully");
        setComplaintsData(data.complaints_data); // Store complaints data
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSort = (order) => {
    const sortedData = [...complaintsData].sort((a, b) => {
      const timeA = new Date(a.upload_time);
      const timeB = new Date(b.upload_time);
      return order === "asc" ? timeA - timeB : timeB - timeA;
    });
    setComplaintsData(sortedData);
    setSortOrder(order);
  };

  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "Status (Open)") {
      setSortOrder("status");
    } else {
      const order = selectedValue === "Time (Oldest)" ? "asc" : "desc";
      setSortOrder(order);
    }
  };

  const handleImageClick = (imageURL) => {
    setSelectedImage(imageURL);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  // Create a unique identifier for each complaint
  const getComplaintUniqueId = (complaint) => {
    // Combine multiple fields to create a unique identifier
    return `${complaint.user_id}_${complaint.latitude}_${complaint.longitude}_${
      complaint.upload_time || ""
    }`;
  };

  const toggleComplaintStatus = async (complaint, complaint_id) => {
    const requestCloseComplaint = async () => {
      try {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${admin_get_cookies_data(false, true)}`,
          },
          body: JSON.stringify({
            complaint_id: complaint_id,
            complaint_status: false,
          }),
        };

        const response = await fetch(
          import.meta.env.VITE_REACT_APP_URL +
            "/admin_complaints/close_complaint",
          options
        );

        if (response.ok) {
          setComplaintsData((prevData) =>
            prevData.map((item) =>
              getComplaintUniqueId(item) === getComplaintUniqueId(complaint)
                ? { ...item, complaint_status: !item.complaint_status }
                : item
            )
          );
          toast.success("Complaint closed successfully");
        } else {
          throw new Error("Failed to close complaint");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error closing complaint");
      }
    };
    requestCloseComplaint();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-100">Admin Home Page</h1>
        </div>
        <div className="flex justify-center mb-6">
          <label className="mr-2 text-gray-300">Sort by:</label>
          <select
            onChange={handleDropdownChange}
            className="bg-gray-800 text-gray-300 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Time (Oldest)">Time (Oldest first)</option>
            <option value="Time (Newest)">Time (Newest first)</option>
            <option value="Status (Open)">Status (Open first)</option>
          </select>
        </div>
        <div className="space-y-6">
          {complaintsData
            .filter((complaint) => complaint.upload_time)
            .sort((a, b) => {
              if (sortOrder === "status") {
                if (a.complaint_status !== b.complaint_status) {
                  return a.complaint_status ? 1 : -1;
                }
                const timeA = new Date(a.upload_time);
                const timeB = new Date(b.upload_time);
                return timeB - timeA;
              } else {
                const timeA = new Date(a.upload_time);
                const timeB = new Date(b.upload_time);
                return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
              }
            })
            .map((complaint, index) => (
              <div key={index} className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-100">
                  User ID: {complaint.user_id}
                </h3>
                <p className="text-gray-300">
                  Complaint status:{" "}
                  <span
                    className={`font-bold ${
                      complaint.complaint_status
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {complaint.complaint_status ? "Closed" : "Open"}
                  </span>
                </p>
                <p className="text-gray-300">
                  Upload Time:{" "}
                  {new Date(complaint.upload_time).toLocaleString()}
                </p>
                <button
                  onClick={() =>
                    toggleComplaintStatus(complaint, complaint.complaint_id)
                  }
                  className={`mt-4 px-4 py-2 rounded text-sm font-medium ${
                    complaint.complaint_status
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white`}
                >
                  {complaint.complaint_status
                    ? "Re-open complaint"
                    : "Close complaint"}
                </button>
                <div className="overflow-x-auto mt-4">
                  <div className="flex space-x-4">
                    {Object.values(complaint.images || {}).map(
                      (imageURL, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={imageURL}
                          alt={`Complaint ${complaint.id} Image ${imgIndex}`}
                          className="rounded-lg cursor-pointer hover:opacity-90 w-48 h-48 object-cover"
                          onClick={() => handleImageClick(imageURL)}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div className="relative">
              <img
                src={selectedImage}
                alt="Full-size"
                className="max-w-full max-h-screen rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHomePage;
