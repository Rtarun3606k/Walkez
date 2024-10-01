import { mappls } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";
import { get_longitude_latitude } from "../../Utility/get_Location";

const mapplsClassObject = new mappls();

const App = () => {
  const map = useRef(null);
  const circleRef = useRef(null); // Circle reference
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [latitude, setLatitude] = useState(28.529467); // Default latitude
  const [longitude, setLongitude] = useState(77.22315); // Default longitude

  useEffect(() => {
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

        // Add the new circle
        circleRef.current = mapplsClassObject.Circle({
          map: map.current,
          center: { lat: location.latitude, lng: location.longitude },
          radius: 100,
        });

        // Initialize the map after receiving the location
        mapplsClassObject.initialize(
          "d24e2bbe899f9aa7efa00d5fed297af8",
          { map: true },
          () => {
            if (map.current) {
              map.current.remove(); // Remove existing map instance
            }
            map.current = mapplsClassObject.Map({
              id: "map",
              properties: {
                center: [location.latitude, location.longitude],
                zoom: 15,
              },
            });

            // Map load event
            map.current.on("load", () => {
              setIsMapLoaded(true);
              mapplsClassObject.setStyle("standard-hybrid");

              // Remove the previous circle layer if exists
            });
            markerObject = mapplsClassObject.marker({
              map: mapObject,
              position: { lat: location.latitude, lng: location.longitude },
            });
          }
        );
      })
      .catch((error) => {
        console.error("Error getting location: ", error);
      });
  }, []); // Runs only once when component mounts

  return (
    <div
      id="map"
      style={{ width: "100%", height: "99vh", display: "inline-block" }}
    >
      {isMapLoaded && <p>Map is loaded!</p>}
    </div>
  );
};

export default App;
