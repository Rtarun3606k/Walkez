import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../../CSS/User_Css/adminUserPage.css"; // Import the CSS file
import { admin_get_cookies_data } from "../../Utility/AdminAuth";

const AdminHomePage = () => {
  const [complaintsData, setComplaintsData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedImage, setSelectedImage] = useState(null);

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
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <h1>Admin Home Page</h1>
        </div>
        <div className="admin-dropdown">
          <label>Sort by:</label>
          <select onChange={handleDropdownChange}>
            <option value="Time (Oldest)">Time (Oldest first)</option>
            <option value="Time (Newest)">Time (Newest first)</option>
            <option value="Status (Open)">Status (Open first)</option>
          </select>
        </div>
        <div>
          {complaintsData
            .filter((complaint) => complaint.upload_time)
            .sort((a, b) => {
              // If sorting by status
              if (sortOrder === "status") {
                // Sort by complaint_status (false/open comes first)
                if (a.complaint_status !== b.complaint_status) {
                  return a.complaint_status ? 1 : -1;
                }
                // If status is the same, sort by upload time (newest first)
                const timeA = new Date(a.upload_time);
                const timeB = new Date(b.upload_time);
                return timeB - timeA;
              } else {
                // Standard time-based sorting
                const timeA = new Date(a.upload_time);
                const timeB = new Date(b.upload_time);
                return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
              }
            })
            .map((complaint, index) => (
              <div key={index} className="complaint-container">
                <h3>User ID: {complaint.user_id}</h3>
                <p>
                  Complaint status:{" "}
                  {complaint.complaint_status ? "Closed" : "Open"}
                </p>
                <p>
                  Upload Time:{" "}
                  {new Date(complaint.upload_time).toLocaleString()}
                </p>
                <button
                  onClick={() =>
                    toggleComplaintStatus(complaint, complaint.complaint_id)
                  }
                >
                  {complaint.complaint_status
                    ? "Re-open complaint"
                    : "Close complaint"}
                </button>
                <div className="image-grid">
                  {Object.values(complaint.images || {}).map(
                    (imageURL, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={imageURL}
                        alt={`Complaint ${complaint.id} Image ${imgIndex}`}
                        className="complaint-image"
                        onClick={() => handleImageClick(imageURL)}
                      />
                    )
                  )}
                </div>
              </div>
            ))}
        </div>

        {selectedImage && (
          <div className="modal-overlay" onClick={closeModal}>
            <img
              src={selectedImage}
              alt="Full-size"
              className="modal-image"
              onClick={(e) => e.stopPropagation()}
            />
            <button className="modal-close-button" onClick={closeModal}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHomePage;
