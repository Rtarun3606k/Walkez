import { mappls } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";
import { get_longitude_latitude } from "../../Utility/get_Location";

const mapplsClassObject = new mappls();

const App = () => {
  const map = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  useEffect(() => {
    get_longitude_latitude()
      .then((location) => {
        setLatitude(location.latitude);
        setLongitude(location.longitude);
      })
      .catch((error) => {
        setLatitude(28.529467);
        setLongitude(77.22315);
      });
    console.log("Latitude: ", latitude);
    console.log("Longitude: ", longitude);
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
            center: [latitude, longitude],
            // center: [20.593683, 78.962883],
            zoom: 15,
          },
        });
        map.current.on("load", () => {
          setIsMapLoaded(true);
          mapplsClassObject.setStyle("standard-hybrid");
        });
      }
    );
  }, []);

  return (
    <div
      id="map"
      style={{ width: "100%", height: "99vh", display: "inline-block" }}
    >
      {isMapLoaded}
    </div>
  );
};
export default App;
