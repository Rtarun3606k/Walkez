import { mappls } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";
import { get_longitude_latitude } from "../../Utility/get_Location";

// Initialize the mappls object
const mapplsClassObject = new mappls();

const App = () => {
  const map = useRef(null); // Reference for the map
  const circleRef = useRef(null); // Reference for the circle
  const [isMapLoaded, setIsMapLoaded] = useState(false); // Map load state
  const [latitude, setLatitude] = useState(28.529467); // Default latitude
  const [longitude, setLongitude] = useState(77.22315); // Default longitude

  useEffect(() => {
    // Fetch current location and initialize map
    get_longitude_latitude()
      .then((location) => {
        setLatitude(location.latitude);
        setLongitude(location.longitude);

        if (circleRef.current) {
          mapplsClassObject.removeLayer({
            map: map.current,
            layer: circleRef.current,
          });
        }

        // Initialize the map with user's location
        mapplsClassObject.initialize(
          "d24e2bbe899f9aa7efa00d5fed297af8", // Your API Key here
          { map: true },
          () => {
            // Create a new map instance
            if (map.current) {
              map.current.remove(); // Remove previous instance if it exists
            }
            map.current = mapplsClassObject.Map({
              id: "map", // Map container ID
              properties: {
                center: [location.latitude, location.longitude],
                zoom: 15,
              },
            });

            // Map load event
            map.current.on("load", () => {
              setIsMapLoaded(true);

              // Add a circle at user's location with custom color
              circleRef.current = mapplsClassObject.Circle({
                map: map.current,
                center: { lat: location.latitude, lng: location.longitude },
                radius: 30, // Radius in meters
                strokeColor: "red",
              });

              // Add a marker at user's location
              const marker = mapplsClassObject.addMarker({
                map: map.current,
                position: { lat: location.latitude, lng: location.longitude },
              });
            });
          }
        );
      })
      .catch((error) => {
        console.error("Error getting location: ", error);
      });
  }, []); // Empty dependency array to run only on mount

  return (
    <div id="map" style={{ width: "100%", height: "99vh" }}>
      {isMapLoaded && <p>Map is loaded!</p>}
    </div>
  );
};

export default App;
