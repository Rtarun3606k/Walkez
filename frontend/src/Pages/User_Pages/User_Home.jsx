import React, { useEffect } from "react";
import "../../CSS/User_Css/Home.css";

const User_Home = () => {
  useEffect(() => {
    // Initialize the map once the component is mounted
    const script = document.createElement("script");
    script.src =
      "https://apis.mappls.com/advancedmaps/api/d24e2bbe899f9aa7efa00d5fed297af8/map_sdk?layer=vector&v=3.0";
    script.defer = true;
    script.async = true;

    // When the script is loaded, initialize the map
    script.onload = () => {
      var map = new mappls.Map("map", {
        center: [28.638698386592438, 77.27604556863412],
        zoom: 12,
      });

      // Set the map style
      mappls.setStyle("grey-day");

      // Add a marker after map initialization
      new mappls.Marker({
        map: map,
        position: { lat: 28.519467, lng: 77.22315 },
      });
    };

    // Append the script to the body
    document.body.appendChild(script);

    // Clean up the script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="boby_map">
      <div id="map"></div>
    </div>
  );
};

export default User_Home;
