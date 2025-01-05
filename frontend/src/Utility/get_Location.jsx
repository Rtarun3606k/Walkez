export const get_longitude_latitude = async () => {
  const get_location = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  try {
    const location = await get_location();
    return location;
  } catch (error) {
    console.log("Error: ", error);
    return { latitude: 28.529467, longitude: 77.22315 }; // Fallback location
  }
};

export const fetchAddressDataWithSASToken = async (address) => {
  const sasToken = import.meta.env.VITE_AZURE_MAP_SUB_KEY;
  const query = encodeURIComponent(address);

  const url = `https://atlas.microsoft.com/search/address/json?api-version=1.0&query=${encodeURIComponent(
    address
  )}&subscription-key=${sasToken}&top=5`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    console.log(data);
    // console.log(address);
    // console.log(data.results[0].position.lat);
    // console.log(data.results[0].position.lon);
    // console.log(data.results[0].address);
    let output = {};
    const outputData = [];
    data.results.map((item) => {
      output = {
        latitude: item?.position?.lat,
        longitude: item?.position?.lon,
        municipalitySubdivision: item?.address?.municipalitySubdivision,
        municipality: item?.address?.municipality,
      };
      outputData.push(output);
    });

    console.log(outputData);
    return outputData;
  } catch (error) {
    console.error("Error:", error);
  }
};
