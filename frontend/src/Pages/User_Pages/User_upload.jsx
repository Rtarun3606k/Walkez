import React, { useEffect, useState } from "react";
import { check_token } from "../../Utility/Cookies_validator";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { get_cookies_data } from "../../Utility/Auth";
import Rating from "../User_Pages/Components/Rating"; // Correct the path

const User_upload = () => {
  const url = import.meta.env.VITE_REACT_APP_URL;
  const { lat, long } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [selectedPath, setSelectedPath] = useState(""); // State for selected radio button
  const [rating, setRating] = useState(0); // State for star rating
  const [description, setDescription] = useState("");

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

  const handle_submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("latitude", lat);
    formData.append("longitude", long);
    formData.append("path_type", selectedPath);
    formData.append("rating", rating);
    formData.append("description", description);

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
      } else if (response.status === 401) {
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

  return (
    <div className="body_services flex justify-center items-center min-h-screen bg-gray-100 ml-[-15vw]">
      <div
        id="services"
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl mx-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Upload Street Images
        </h2>
        <div className="service">
          <h3 className="text-lg font-semibold mb-4">
            Upload images of roads and paths where pedestrians might find it
            inconvenient to traverse.
          </h3>
          <form
            encType="multipart/form-data"
            onSubmit={handle_submit}
            className="flex flex-col space-y-4"
          >
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
              className="border border-gray-300 p-2 rounded-md"
            />

            <p className="font-semibold">Select the type of path:</p>
            <div className="flex flex-wrap space-x-4">
              <div>
                <input
                  type="radio"
                  name="path"
                  id="footpath"
                  value="footpath"
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                <label htmlFor="footpath">Footpath</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="path"
                  id="road"
                  value="road"
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                <label htmlFor="road">Road</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="path"
                  id="other"
                  value="other"
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                <label htmlFor="other">Other</label>
                <input
                  type="text"
                  name="other-type"
                  id="other-type"
                  className="border-2 border-gray-300 rounded-md ml-2 p-1"
                  disabled={selectedPath !== "other"} // Enable only if 'Other' is selected
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="description" className="font-semibold">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                cols="50"
                placeholder="Enter a description of the path"
                className="border border-gray-300 p-2 rounded-md"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </div>
            <p className="font-semibold">
              Rate the path based on its walkability:
            </p>
            <div className="star-rating">
              <Rating rating={rating} setRating={setRating} />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Upload
            </button>
          </form>
          <div className="examples mt-8">
            <h2 className="text-xl font-bold mb-4">Example images</h2>
            <div className="images grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="example-image">
                <img
                  src="/../logos/example1.jpg"
                  alt="Example 1"
                  className="rounded-md shadow-md"
                />
              </div>
              <div className="example-image">
                <img
                  src="/../logos/example2.png"
                  alt="Example 2"
                  className="rounded-md shadow-md"
                />
              </div>
              <div className="example-image">
                <img
                  src="/../logos/example3.png"
                  alt="Example 3"
                  className="rounded-md shadow-md"
                />
              </div>
              <div className="example-image">
                <img
                  src="/../logos/example4.png"
                  alt="Example 4"
                  className="rounded-md shadow-md"
                />
              </div>
              <div className="example-image">
                <img
                  src="/../logos/example5.jpg"
                  alt="Example 5"
                  className="rounded-md shadow-md"
                />
              </div>
              <div className="example-image">
                <img
                  src="/../logos/example6.png"
                  alt="Example 6"
                  className="rounded-md shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User_upload;
