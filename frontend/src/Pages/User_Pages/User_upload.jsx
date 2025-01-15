import React, { useEffect, useState } from "react";
import "../../CSS/User_Css/Upload.css";
import { check_token } from "../../Utility/Cookies_validator";
import { useNavigate } from "react-router-dom";
import { get_longitude_latitude } from "../../Utility/get_Location";
import { toast } from "react-toastify";
import { get_cookies_data } from "../../Utility/Auth";

const User_upload = () => {
  const url = import.meta.env.VITE_REACT_APP_URL;
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [selectedPath, setSelectedPath] = useState(""); // State for selected radio button
  const [rating, setRating] = useState(""); // State for star rating
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    if (check_token() === false) {
      navigate("/login");
    }
  }, []);

  const handle_submit = async (e) => {
    e.preventDefault();

    // Get the latitude and longitude
    try {
      const location = await get_longitude_latitude();
      setLatitude(location.latitude);
      setLongitude(location.longitude);
    } catch (error) {
      console.log("Error: ", error);
      toast.error(
        "Please turn on location services and allow to get location."
      );
      setLatitude(28.529467); // Fallback latitude
      setLongitude(77.22315); // Fallback longitude
    }

    const formData = new FormData();
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("path_type", selectedPath);
    formData.append("rating", rating);

    // Append multiple images to formData
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
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
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error(`${data.message}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const handleRadioChange = (e) => {
    setSelectedPath(e.target.value); // Set the selected path
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value); // Set the selected rating
  };

  return (
    <div className="body_services ml-[-15%]">
      <div id="services">
        <h2>Upload Street Images</h2>
        <div className="service">
          <h3>
            Upload images of roads and paths where pedestrians might find it
            inconvenient to traverse.
          </h3>
          <form encType="multipart/form-data" onSubmit={handle_submit}>
            <input
              type="file"
              id="imageUpload"
              name="image"
              accept="image/*"
              required
              multiple
              onChange={(e) => {
                setImages(e.target.files);
              }}
            />
            <button type="submit" className="submit">
              Upload
            </button>

            <p className="path-type">Select the type of path:</p>
            <div className="path-type">
              <input
                type="radio"
                name="path"
                id="footpath"
                value="footpath"
                onChange={handleRadioChange}
              />
              <label htmlFor="footpath">Footpath</label>
              <input
                type="radio"
                name="path"
                id="road"
                value="road"
                onChange={handleRadioChange}
              />
              <label htmlFor="road">Road</label>
              <input
                type="radio"
                name="path"
                id="other"
                value="other"
                onChange={handleRadioChange}
              />
              <label htmlFor="other">Other</label>
              <input
                type="text"
                name="other-type"
                id="other-type"
                disabled={selectedPath !== "other"} // Enable only if 'Other' is selected
              />
            </div>

            <p className="rating">Rate the path based on its walkability:</p>
            <div className="star-rating">
              <input
                required
                type="radio"
                id="star5"
                name="rating"
                value="5"
                onChange={handleRatingChange}
              />
              <label htmlFor="star5" title="5 stars">
                ☆
              </label>
              <input
                type="radio"
                id="star4"
                name="rating"
                value="4"
                onChange={handleRatingChange}
              />
              <label htmlFor="star4" title="4 stars">
                ☆
              </label>
              <input
                type="radio"
                id="star3"
                name="rating"
                value="3"
                onChange={handleRatingChange}
              />
              <label htmlFor="star3" title="3 stars">
                ☆
              </label>
              <input
                type="radio"
                id="star2"
                name="rating"
                value="2"
                onChange={handleRatingChange}
              />
              <label htmlFor="star2" title="2 stars">
                ☆
              </label>
              <input
                type="radio"
                id="star1"
                name="rating"
                value="1"
                onChange={handleRatingChange}
              />
              <label htmlFor="star1" title="1 star">
                ☆
              </label>
            </div>
          </form>
          <div className="examples">
            <h2>Example images</h2>
            <div className="images">
              <div className="example-image">
                <img src="../logos/example1.jpg" alt="Example 1" />
              </div>
              <div className="example-image">
                <img src="../logos/example2.png" alt="Example 2" />
              </div>
              <div className="example-image">
                <img src="../logos/example3.png" alt="Example 3" />
              </div>
              <div className="example-image">
                <img src="../logos/example4.png" alt="Example 4" />
              </div>
              <div className="example-image">
                <img src="../logos/example5.jpg" alt="Example 5" />
              </div>
              <div className="example-image">
                <img src="../logos/example6.png" alt="Example 6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User_upload;
