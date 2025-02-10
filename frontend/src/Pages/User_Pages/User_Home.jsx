import React, { useEffect, useState } from "react";
import "azure-maps-control/dist/atlas.min.css";
import "../../CSS/User_Css/Home.css";
import {
  AzureMap,
  AzureMapsProvider,
  AuthenticationType,
  AzureMapHtmlMarker,
} from "react-azure-maps";
import { get_longitude_latitude } from "../../Utility/get_Location";
import Loader from "./Components/Loader";

const Home = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

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

  if (loading || latitude === null || longitude === null) {
    return (
      <div className="bg-[rgba(32,13,13,0.27)] w-full h-[100vh] justify-center items-center flex">
        <Loader />
      </div>
    ); // Show loading state
  }

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
        <img
          src=".../public/logos/search.svg"
          alt=""
          className="searchIcon"
        />
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
                position: [selectedLocation.position.lon, selectedLocation.position.lat],
                text: selectedLocation.poi ? selectedLocation.poi.name : "Unknown",
              }}
            />
          )}
        </AzureMap>
      </AzureMapsProvider>
    </div>
  );
};

export default Home;