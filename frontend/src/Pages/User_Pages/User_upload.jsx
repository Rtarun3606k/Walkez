import React, { useEffect } from "react";
import "../../CSS/User_Css/Upload.css";
import { check_token } from "../../Utility/Cookies_validator";
import { useNavigate } from "react-router-dom";

const User_upload = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (check_token() === false) {
      navigate("/login");
    }
  }, []);

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
              <input
                type="file"
                id="imageUplaod"
                name="image"
                accept="image/*"
                required
              />
              <button type="submit" className="submit">
                Upload
              </button>
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
