import React, { useEffect, useState } from "react";
import "azure-maps-control/dist/atlas.min.css";
import {
  AzureMap,
  AzureMapsProvider,
  AuthenticationType,
  AzureMapHtmlMarker,
} from "react-azure-maps";
import { get_longitude_latitude } from "../../Utility/get_Location";
import {
  UserMarker as Marker,
  CriticalMarker,
} from "./Components/Map_componets/Marker";

const Home = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [data_images, setData_images] = useState({});
  const [data_get, setdata_get] = useState({});
  const apiUrl = import.meta.env.VITE_REACT_APP_URL;

  const get_data = async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      const response = await fetch(
        `${apiUrl}/map_route/get_all_images`,
        options
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setdata_get(data);
        console.log("data images", data.image_data);
        data.image_data.map((image) => {
          console.log({
            image_id: image.image_id,
            image_name: image.image_name,
            mimetype: image.mimetype,
            longitude: image.longitude,
            latitude: image.latitude,
            problem: image.problem,
            stars: image.stars,
          });
        });
      } else {
        console.error("Error fetching data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
    get_data();
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
    return <div>Loading...</div>; // Show loading state
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
            markerContent={<Marker />}
            options={{
              position: [longitude, latitude],
            }}
          />

          {data_get.image_data.map((data) => (
            <AzureMapHtmlMarker
              key={data.image_id}
              markerContent={<CriticalMarker id={data.image_id} />}
              options={{
                position: [data.longitude, data.latitude],
              }}
            />
          ))}

          <AzureMapHtmlMarker
            markerContent={<CriticalMarker />}
            options={{
              position: [longitude, latitude],
            }}
          />
        </AzureMap>
      </AzureMapsProvider>
    </div>
  );
};

export default Home;
