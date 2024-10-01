import { mappls } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";

const mapplsClassObject = new mappls();

const App = () => {
  const map = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
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
            center: [28.529467, 77.22315],
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
