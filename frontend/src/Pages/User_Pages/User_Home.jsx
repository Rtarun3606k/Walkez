import React, { useEffect, useState } from "react";
import "azure-maps-control/dist/atlas.min.css";
import "../../CSS/User_Css/Home.css";
import { FaPlus } from "react-icons/fa";
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
import CustomMarker from "./Components/CustomMarker";
import ImageModal from "./Components/Modal"; // Import the ImageModal component
import { toast } from "react-toastify";

const Home = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState(null);
  const [isMarkerVisible, setIsMarkerVisible] = useState(false);
  const [initdata, setInitData] = useState([]);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [roadImage, setRoadImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState("");

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const value = await get_longitude_latitude();
        setLatitude(value.latitude);
        setLongitude(value.longitude);
        setMapCenter([value.longitude, value.latitude]);
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchInitialData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_REACT_APP_URL + "/map_route/get_all"
        );

        if (response.ok) {
          const data = await response.json();
          toast.success("Data fetched successfully");
          setInitData(data.complaints_data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching data");
      }
    };

    fetchInitialData();
    fetchLocation();

    const handleTouchStart = (e) => {
      console.log("Touch detected:", e);
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  const searchLocation = async (query) => {
    const subscriptionKey = `${import.meta.env.VITE_AZURE_MAP_SUB_KEY}`;
    const url = `https://atlas.microsoft.com/search/fuzzy/json?api-version=1.0&subscription-key=${subscriptionKey}&query=${query}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchResults([]);
    setMapCenter([location.position.lon, location.position.lat]);
  };

  const options = {
    authOptions: {
      authType: AuthenticationType.subscriptionKey,
      subscriptionKey: `${import.meta.env.VITE_AZURE_MAP_SUB_KEY}`,
    },
    center: mapCenter,
    zoom: 18,
  };

  const toggleMarkerVisibility = () => {
    setIsMarkerVisible(!isMarkerVisible);
    if (!isMarkerVisible) {
      setPopupPosition([longitude, latitude]);
    }
  };

  const handleMarkerClick = (data) => {
    setModalImageUrl(data.images[0]);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setRoadImage(null);
  };

  if (loading || latitude === null || longitude === null) {
    return (
      <div className="bg-[rgba(32,13,13,0.27)] w-full h-[100vh] justify-center items-center flex">
        <Loader />
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div className="homeSearch">
        <input
          type="search"
          placeholder="Search for locations..."
          className="search xs:w-60vw xs:m-0 xs:mt-5"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchLocation(e.target.value);
            }
          }}
        />
        <img src="/logos/search.svg" alt="Search" className="searchIcon" />
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
      <div onClick={toggleMarkerVisibility} style={{ cursor: "pointer" }}>
        <FaPlus size={24} />
      </div>
      {isMarkerVisible && <div className="marker">{/* Marker content */}</div>}
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
                color: "Blue",
              }}
              events={[
                {
                  eventName: "dragend",
                  callback: (e) => {
                    setPopupPosition(e.target.getOptions().position);
                    setPopupVisible(true);
                  },
                },
              ]}
            />
          )}
          {popupVisible && popupPosition && (
            <AzureMapPopup
              isVisible={popupVisible}
              options={{
                position: popupPosition,
                pixelOffset: [0, -15],
                closeButton: true,
                closeOnMapClick: true,
              }}
              popupContent={
                <div
                  className="custom-popup"
                  style={{
                    width: "250px",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "16px",
                    padding: "16px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    position: "relative",
                    fontFamily: "'Inter', 'Segoe UI', sans-serif",
                  }}
                >
                  <div style={{ marginBottom: "14px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #6A11CB, #2575FC)",
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 4C8.736 4 6 6.736 6 10C6 14.445 11.1 20.3347 11.469 20.7193C11.6047 20.8653 11.7953 20.8653 11.931 20.7193C12.3 20.3347 18 14.445 18 10C18 6.736 15.264 4 12 4ZM12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#2D3748",
                        }}
                      >
                        Selected Location
                      </h3>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 10px",
                        background: "rgba(237, 242, 247, 0.7)",
                        borderRadius: "8px",
                        fontSize: "13px",
                        color: "#4A5568",
                        fontFamily: "monospace",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12.5 8.5L9.5 11.5M10.5 4.5L4.5 6.5L6.5 12.5L12.5 18.5L18.5 12.5L10.5 4.5Z"
                          stroke="#718096"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <code style={{ margin: 0 }}>
                        {popupPosition[0].toFixed(6)},{" "}
                        {popupPosition[1].toFixed(6)}
                      </code>
                    </div>
                  </div>

                  <a
                    href={`/user/upload/${popupPosition[0]}/${popupPosition[1]}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      background: "linear-gradient(135deg, #6A11CB, #2575FC)",
                      color: "white",
                      padding: "12px 18px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontWeight: "500",
                      fontSize: "15px",
                      textAlign: "center",
                      boxShadow: "0 4px 12px rgba(37, 117, 252, 0.3)",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow =
                        "0 6px 20px rgba(37, 117, 252, 0.45)";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(37, 117, 252, 0.3)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 16V4M12 4L7 9M12 4L17 9"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20 20H4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Upload New Image
                  </a>

                  <p
                    style={{
                      margin: "12px 0 0 0",
                      fontSize: "12px",
                      color: "#718096",
                      textAlign: "center",
                      lineHeight: "1.4",
                      flexGrow: 1,
                    }}
                  >
                    Upload an image to help improve walkability
                  </p>
                </div>
              }
            />
          )}

          {initdata.map((data, index) => (
            <AzureMapHtmlMarker
              key={index}
              options={{
                position: [data.longitude, data.latitude],
              }}
              events={[
                {
                  eventName: "click",
                  callback: () => {
                    setModalData(data);
                    setIsModalVisible(true);
                    console.log("Marker clicked:", data);
                  },
                },
              ]}
              markerContent={
                <div className="w-12 cursor-pointer hover:scale-[1.2] transition-all duration-300">
                  <CustomMarker
                    longitude={data.longitude}
                    latitude={data.latitude}
                    imgUrl={data.images[0]}
                  />
                </div>
              }
            />
          ))}
        </AzureMap>
      </AzureMapsProvider>
      <button
        className="upload-button"
        onClick={toggleMarkerVisibility}
        style={{
          background: "linear-gradient(90deg, #6A11CB 0%, #2575FC 100%)",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          position: "absolute",
          bottom: "20%",
          right: "0%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="uploadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#FF9E9E" />
              <stop offset="100%" stop-color="#FFCF9E" />
            </linearGradient>
          </defs>
          <path d="M11 14.9861C11 15.5384 11.4477 15.9861 12 15.9861C12.5523 15.9861 13 15.5384 13 14.9861V7.82831L16.2428 11.0711C16.6333 11.4616 17.2665 11.4616 17.657 11.0711C18.0475 10.6806 18.0475 10.0474 17.657 9.65692L12.7071 4.70703C12.3166 4.31651 11.6834 4.31651 11.2929 4.70703L6.34315 9.65692C5.95262 10.0474 5.95262 10.6806 6.34315 11.0711C6.73367 11.4616 7.36684 11.4616 7.75736 11.0711L11 7.82831V14.9861Z" fill="url(#uploadGradient)"/>
          <path d="M4 14H6V18H18V14H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V14Z" fill="url(#uploadGradient)"/>
        </svg>
        Upload
      </div>
    `;
          e.target.style.width = "140px";
          e.target.style.borderRadius = "30px";
          e.target.style.fontSize = "18px";
          e.target.style.background =
            "linear-gradient(90deg, #6A11CB 0%, #2575FC 100%)";
          e.target.style.height = "64px";
          e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";
          e.target.style.transition = "all 0.3s ease";
        }}
        onMouseLeave={(e) => {
          e.target.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.44772 4 12 4Z" fill="white"/>
      </svg>
    `;
          e.target.style.width = "60px";
          e.target.style.borderRadius = "50%";
          e.target.style.height = "60px";
          e.target.style.boxShadow = "none";
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.44772 4 12 4Z"
            fill="white"
          />
        </svg>
      </button>
      {isModalVisible && (
        <ImageModal
          isVisible={isModalVisible}
          data={modalData}
          onClose={closeModal}
        />
      )}
      {popupVisible && popupPosition && (
        <AzureMapPopup
          isVisible={popupVisible}
          options={{ position: popupPosition }}
          popupContent={
            <div style={{ padding: "20px", textAlign: "center" }}>
              <button
                className="close-button"
                onClick={closePopup}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  position: "absolute",
                  top: "5px",
                  right: "10px",
                }}
              >
                &times;
              </button>
              <img
                src={roadImage}
                alt="Road"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />
              <div
                className="more-info"
                style={{
                  fontSize: "14px",
                  color: "#333",
                  fontWeight: "bold",
                }}
              >
                More Info
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default Home;
