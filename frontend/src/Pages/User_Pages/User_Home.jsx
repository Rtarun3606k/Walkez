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
  const [data_get, setDataGet] = useState({});
  const apiUrl = import.meta.env.VITE_REACT_APP_URL;

  const searchBox = async (searchQuery) => {};

  const getData = async () => {
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
        console.log("Data fetched successfully:", data);
        setDataGet(data);
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
        setLatitude(value.latitude);
        setLongitude(value.longitude);
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
    getData();
  }, []);

  const options = {
    authOptions: {
      authType: AuthenticationType.subscriptionKey,
      subscriptionKey: `${import.meta.env.VITE_AZURE_MAP_SUB_KEY}`,
    },
    center: [longitude || 0, latitude || 0],
    zoom: 18,
  };

  if (loading || latitude === null || longitude === null) {
    return <div>Loading...</div>;
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
          styleOptions={{ showFeedbackLink: false }}
        >
          <AzureMapHtmlMarker
            markerContent={<Marker />}
            options={{ position: [longitude, latitude] }}
          />

          {data_get?.image_data?.map((data) => (
            <AzureMapHtmlMarker
              key={data.image_id}
              markerContent={<CriticalMarker img_id={data.image_id} />}
              options={{ position: [data.longitude, data.latitude] }}
            />
          ))}

          {/* <AzureMapHtmlMarker
            markerContent={<CriticalMarker />}
            options={{ position: [longitude, latitude] }}
          /> */}
        </AzureMap>
      </AzureMapsProvider>
    </div>
  );
};

export default Home;
