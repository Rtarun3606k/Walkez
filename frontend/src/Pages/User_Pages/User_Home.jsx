import React, { useEffect, useState } from "react";
import "azure-maps-control/dist/atlas.min.css";
import {
  AzureMap,
  AzureMapsProvider,
  AuthenticationType,
  AzureMapHtmlMarker,
} from "react-azure-maps";
import {
  get_longitude_latitude,
  fetchAddressDataWithSASToken,
} from "../../Utility/get_Location";
import {
  UserMarker as Marker,
  CriticalMarker,
} from "./Components/Map_componets/Marker";
import "../../CSS/Map_CSS/Map.css";

const Home = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataGet, setDataGet] = useState({});
  const apiUrl = import.meta.env.VITE_REACT_APP_URL;
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [mapOptions, setMapOptions] = useState({
    authOptions: {
      authType: AuthenticationType.subscriptionKey,
      subscriptionKey: import.meta.env.VITE_AZURE_MAP_SUB_KEY || "",
    },
    center: [0, 0],
    zoom: 18,
  });

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
        const location = await get_longitude_latitude();
        setLatitude(location.latitude);
        setLongitude(location.longitude);
        setMapOptions((prevOptions) => ({
          ...prevOptions,
          center: [location.longitude, location.latitude],
        }));
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
    getData();
  }, []);

  const handleSearchChange = async (e) => {
    e.preventDefault();
    const newSearch = e.target.value;
    setSearch(newSearch);

    try {
      const response = await fetchAddressDataWithSASToken(newSearch);
      setSearchData(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const handleLatitudeLongitudeChange = (lat, lon) => {
    setLatitude(lat);
    setLongitude(lon);
    setMapOptions((prevOptions) => ({
      ...prevOptions,
      center: [lon, lat],
    }));
  };

  if (loading || latitude === null || longitude === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div
        className="absolute flex bg-transparent border flex-col rounded-lg left-1/4 gap-3 mt-2"
        style={{
          zIndex: "999",
          width: "30%",
          height: "100vh",
          overflowY: "auto",
          top: "0",
        }}
      >
        <input
          type="search"
          placeholder="Destination"
          className="max-w-full bg-slate-900 rounded-lg text-center text-white p-2"
          style={{ width: "90%", height: "7vh" }}
          value={search}
          onChange={(e) => handleSearchChange(e)}
        />
        {searchData?.length > 1 && (
          <div
            className="flex items-center flex-col gap-2"
            style={{
              height: "50vh",
              width: "100%",
              overflowY: "scroll",
            }}
          >
            {searchData.map((data) => (
              <div
                className="bg-slate-900 text-white p-2 w-full rounded-lg"
                key={data.latitude}
                onClick={() =>
                  handleLatitudeLongitudeChange(data.latitude, data.longitude)
                }
              >
                <p className="-m-1">{data?.municipalitySubdivision}</p>
                <p>{data?.municipality}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ width: "100vw", height: "100vh" }}>
        <AzureMapsProvider>
          <AzureMap
            options={mapOptions}
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
            {dataGet?.image_data?.map((data) => (
              <AzureMapHtmlMarker
                key={data.image_id}
                markerContent={<CriticalMarker img_id={data.image_id} />}
                options={{ position: [data.longitude, data.latitude] }}
              />
            ))}
          </AzureMap>
        </AzureMapsProvider>
      </div>
    </>
  );
};

export default Home;
