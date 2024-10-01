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
