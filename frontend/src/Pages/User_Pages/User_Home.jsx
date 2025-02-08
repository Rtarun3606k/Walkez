import React, { useEffect, useState } from "react";
import "azure-maps-control/dist/atlas.min.css";
import "../../CSS/User_Css/Home.css";
import {
  AzureMap,
  AzureMapsProvider,
  AuthenticationType,
  AzureMapHtmlMarker,
} from "react-azure-maps";
import axios from "axios";
import { get_longitude_latitude } from "../../Utility/get_Location";
import Loader from "./Components/Loader";

const Home = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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
      // await sleep(300000);
      // console.log("Timeout");
    };
    fetchLocation();
  }, []);

  // Fetch place suggestions from Azure Maps
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await axios
          .get
          //api
          ();

        if (response.data.results) {
          setSuggestions(response.data.results);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        // console.log("hello");
        console.error("Error fetching places from Azure Maps:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle place selection from Azure Maps results
  const handleSelect = (place) => {
    setQuery(place.address.freeformAddress);
    setLatitude(place.position.lat);
    setLongitude(place.position.lon);
    setSuggestions([]);
  };

  const options = {
    authOptions: {
      authType: AuthenticationType.subscriptionKey,
      subscriptionKey: import.meta.env.VITE_AZURE_MAP_SUB_KEY,
    },
    center: [longitude || 0, latitude || 0],
    zoom: 18,
  };

  if (loading || latitude === null || longitude === null) {
    return (
      <div className="bg-[rgba(32,13,13,0.27)] w-full h-[100vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div className="homeSearch">
        <input type="search" placeholder="Search for ..." className="search" />
        <img src=".../public/logos/search.svg" alt="" className="searchIcon" />
      </div>

      {/* Azure Map */}
      <AzureMapsProvider>
        <AzureMap
          options={options}
          controls={[
            {
              controlName: "StyleControl",
              controlOptions: { mapStyles: "all" },
              options: { position: "top-right" },
            },
            {
              controlName: "TrafficControl",
              controlOptions: { incidents: true },
              options: { position: "bottom-right" },
            },
            {
              controlName: "TrafficLegendControl",
              controlOptions: { incidents: true },
              options: {
                position: "bottom-right",
                style: "dark",
                top: "100px",
              },
            },
          ]}
          styleOptions={{
            showFeedbackLink: false,
          }}
        >
          {/* User's Current Location Marker */}
          <AzureMapHtmlMarker
            options={{
              color: "Red",
              text: "You are here",
              position: [longitude, latitude],
            }}
          />
        </AzureMap>
      </AzureMapsProvider>
    </div>
  );
};

export default Home;
