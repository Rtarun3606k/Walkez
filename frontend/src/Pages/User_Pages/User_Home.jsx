import { mappls, mappls_plugin } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";

const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();

const User_Home = () => {
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const loadObject = {
    map: true,
    layer: "raster", // Optional Default Vector
    version: "3.0", // // Optional, other version 3.5 also available with CSP headers
    libraries: ["polydraw"], //Optional for Polydraw and airspaceLayers
    plugins: ["direction"], // Optional for All the plugins
  };

  useEffect(() => {
    mapplsClassObject.initialize(
      "d24e2bbe899f9aa7efa00d5fed297af8",
      loadObject,
      () => {
        const newMap = mapplsClassObject.Map({
          id: "map",
          properties: {
            center: [28.633, 77.2194],
            zoom: 4,
          },
        });

        newMap.on("load", () => {
          setIsMapLoaded(true);
        });
        mapRef.current = newMap;
      }
    );
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
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

export default User_Home;
