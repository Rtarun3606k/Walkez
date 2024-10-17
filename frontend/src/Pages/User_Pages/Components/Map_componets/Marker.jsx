import React from "react";
import "../../../../CSS/Map_CSS/Marker.css";

export const UserMarker = () => {
  return (
    <div>
      <img className="marker_img" src="../logos/user_marker.svg" alt="" />
    </div>
  );
};

export const CriticalMarker = ({ img_id }) => {
  const apiUrl = import.meta.env.VITE_REACT_APP_URL;
  return (
    <>
      <div className="box_image_marker">
        <div className="image_box_marker">
          <img
            // src="../logos/example2.png"
            src={`${apiUrl}/user_route/image/${id}`}
            alt=""
            className="image_box_marker_img"
          />
        </div>
        <img className="marker_img" src="../logos/red_marker.svg" alt="" />
      </div>
    </>
  );
};
