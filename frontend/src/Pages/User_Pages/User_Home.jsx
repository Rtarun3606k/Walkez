import React, { useEffect, useState } from "react";
import "azure-maps-control/dist/atlas.min.css";
import "../../CSS/User_Css/Home.css";
import { FaPlus } from 'react-icons/fa'; // Import the + icon from react-icons

// import {AzureMapHtmlMarker } from 'react-azure-maps';
import "../../CSS/Map_CSS/Map.css";

import {
  AzureMap,
  AzureMapsProvider,
  AuthenticationType,
  AzureMapHtmlMarker,
  AzureMapPopup,
} from "react-azure-maps";
import { get_longitude_latitude } from "../../Utility/get_Location";
import Loader from "./Components/Loader";

const Home = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState(null);
  const [isMarkerVisible, setIsMarkerVisible] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const value = await get_longitude_latitude();
        console.log("Location is:", value);
        setLatitude(value.latitude);
        setLongitude(value.longitude);
        console.log("Latitude is:", value.latitude);
        console.log("Longitude is:", value.longitude);
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const searchLocation = async (query) => {
    const subscriptionKey = `${import.meta.env.VITE_AZURE_MAP_SUB_KEY}`;
    const url = `https://atlas.microsoft.com/search/fuzzy/json?api-version=1.0&subscription-key=${subscriptionKey}&query=${query}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Search results:", data);
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchResults([]);
  };

  const options = {
    authOptions: {
      authType: AuthenticationType.subscriptionKey,
      subscriptionKey: `${import.meta.env.VITE_AZURE_MAP_SUB_KEY}`, // Replace with your actual subscription key
    },
    center: [longitude || 0, latitude || 0], // Ensure default values
    zoom: 18, // Adjust the zoom level as needed
  };

  const toggleMarkerVisibility = () => {
    setIsMarkerVisible(!isMarkerVisible);
    if (!isMarkerVisible) {
      setPopupPosition([longitude, latitude]);
    }
  };

  if (loading || latitude === null || longitude === null) {
    return (
      <div className="bg-[rgba(32,13,13,0.27)] w-full h-[100vh] justify-center items-center flex">
        <Loader />
      </div>
    ); // Show loading state
  }

  // Generate random points
  const collection = [[longitude + 0.00001, latitude + 0.00001]];

  // Content for the HTML marker
  const circleMarker = (
    <div
      className="circle-marker"
      style={{
        width: "25px",
        height: "25px",
        borderRadius: "50%",
        backgroundColor: "crimson",
      }}
    ></div>
  );

  const startBlink = (e) => {
    // Access the marker through the event object
    e.target.element.firstElementChild.className = "circle-marker blink";
  };
  const stopBlink = (e) => {
    // Your existing stopBlink logic
    if (e) {
      console.log("Marker placed at:", e.target.getOptions().position);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div className="homeSearch">
        <input
          type="search"
          placeholder="Search for ..."
          className="search"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchLocation(e.target.value);
            }
          }}
        />
        <img src=".../public/logos/search.svg" alt="" className="searchIcon" />
        <div className="searchResults">
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="searchResultItem"
              onClick={() => handleLocationSelect(result)}
            >
              {result.poi ? result.poi.name : "Unknown"}
            </div>
          ))}
        </div>
      </div>
      <div onClick={toggleMarkerVisibility} style={{ cursor: 'pointer' }}>
        <FaPlus size={24} />
      </div>
      {isMarkerVisible && (
        <div className="marker">
          {/* Marker content */}
        </div>
      )}
      <AzureMapsProvider>
        <AzureMap
          options={options}
          controls={[
            {
              controlName: "StyleControl",
              controlOptions: { mapStyles: "all" },
              options: { position: "top-right" },
            },
          ]}
          styleOptions={{
            showFeedbackLink: false,
          }}
        >
          <AzureMapHtmlMarker
            options={{
              color: "Red",
              text: "You are here",
              position: [longitude, latitude],
            }}
          />
          {selectedLocation && (
            <AzureMapHtmlMarker
              options={{
                position: [
                  selectedLocation.position.lon,
                  selectedLocation.position.lat,
                ],
                text: selectedLocation.poi
                  ? selectedLocation.poi.name
                  : "Unknown",
              }}
            />
          )}
          {isMarkerVisible && popupPosition && (
            <AzureMapHtmlMarker
              options={{
                position: popupPosition,
                draggable: true,
              }}
              markerContent={circleMarker}
              events={[
                {
                  eventName: "dragstart",
                  callback: startBlink,
                },
                {
                  eventName: "dragend",
                  callback: (e) => {
                    stopBlink();
                    setPopupPosition(e.target.getOptions().position);
                    setPopupVisible(true);
                    console.log(
                      "Marker placed at:",
                      e.target.getOptions().position
                    );
                  },
                },
              ]}
            />
          )}
          {popupVisible && popupPosition && (
            <AzureMapPopup
              isVisible={popupVisible}
              options={{ position: popupPosition }}
              popupContent={
                <div style={{ padding: "20px" }}>
                  {" "}
                  <a className="upload"
                    href={`/user/upload/${popupPosition[0]}/${popupPosition[1]}`}
                  >
                    Upload
                  </a>{" "}
                </div>
              }
            />
          )}
        </AzureMap>
      </AzureMapsProvider>
      <button className="upload-button" onClick={toggleMarkerVisibility}>
        +
      </button>
    </div>
  );
};

export default Home;
