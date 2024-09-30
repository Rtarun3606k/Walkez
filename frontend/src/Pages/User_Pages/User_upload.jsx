import React, { useEffect, useState } from "react";
import "../../CSS/User_Css/Upload.css";
import { check_token } from "../../Utility/Cookies_validator";
import { useNavigate } from "react-router-dom";

const User_upload = () => {
  const url = import.meta.env.VITE_REACT_APP_URL;
  const navigate = useNavigate();
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (check_token() === false) {
      navigate("/login");
    }
  }, []);

  const handle_submit = async (e) => {
    e.preventDefault();
    // setPlace_loading(true);

    const formData = new FormData();
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

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

    // setPlace_loading(false);
  };

  return (
    <>
      <div className="bdy">
        <div className="content">
          <h1>Upload Street Images</h1>
          <div className="image-upload">
            <div className="image-header">
              <h3>
                Upload images of roads and paths where pedestrians might find it
                inconvenient to traverse.
              </h3>
            </div>
            <div className="image-body">
              <form encType="multipart/form-data" onSubmit={handle_submit}>
                <input
                  type="file"
                  id="imageUplaod"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default User_upload;
