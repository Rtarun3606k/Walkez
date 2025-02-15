import React, { useEffect, useState } from "react";
import * as atlas from "azure-maps-control"; // Import Azure Maps SDK

const CustomMarker = ({ mapRef, longitude, latitude ,imgUrl}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (mapRef?.current && longitude !== null && latitude !== null) {
      const map = mapRef.current;
      const pixelCoords = map.positionsFromPixels([longitude, latitude])[0];

      if (pixelCoords) {
        setPosition({
          top: `${pixelCoords[1]}px`,
          left: `${pixelCoords[0]}px`,
        });
      }
    }
  }, [longitude, latitude, mapRef]);

  return (
    <div className="absolute z-50" style={position}>
      {/* Marker Box */}
      <div className="bg-red-500 text-white px-12 py-4 border-2 border-black rounded-lg shadow-lg">
        <img src={imgUrl} alt="" />
      </div>

      {/* Triangle Pointer (Arrow) */}
      <div className="absolute left-1/2 -bottom-3 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-black transform -translate-x-1/2"></div>
    </div>
  );
};

export default CustomMarker;
