import { mappls } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";
import { get_longitude_latitude } from "../../Utility/get_Location";

const mapplsClassObject = new mappls();

const App = () => {
  const map = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [latitude, setLatitude] = useState(28.529467); // Default latitude
  const [longitude, setLongitude] = useState(77.22315); // Default longitude

  useEffect(() => {
    get_longitude_latitude()
      .then((location) => {
        setLatitude(location.latitude);
        setLongitude(location.longitude);

        // Initialize the map after receiving the location
        mapplsClassObject.initialize(
          "d24e2bbe899f9aa7efa00d5fed297af8",
          { map: true },
          () => {
            if (map.current) {
              map.current.remove();
            }
            map.current = mapplsClassObject.Map({
              id: "map",
              properties: {
                center: [location.latitude, location.longitude],
                zoom: 15,
              },
            });
            map.current.on("load", () => {
              setIsMapLoaded(true);
              mapplsClassObject.setStyle("standard-hybrid");
            });
          }
        );
      })
      .catch((error) => {
        console.error("Error getting location: ", error);
      });
  }, []); // Empty dependency array to ensure it runs only once

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
