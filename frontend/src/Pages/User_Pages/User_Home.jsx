import React, { useEffect, useState } from "react";
import "azure-maps-control/dist/atlas.min.css";
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
      // await sleep(300000);
      // console.log("Timeout");
    };
    fetchLocation();
  }, []);

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
      <>
        <div className="bg-[rgba(32,13,13,0.27)] w-full h-[100vh] justify-center items-center flex">
          <Loader />
        </div>
      </>
    ); // Show loading state
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
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
        </AzureMap>
      </AzureMapsProvider>
    </div>
  );
};

export default Home;
