export const reverseGeocoding = async (long, lat) => {
  try {
    const getAddress = await fetch(
      `https://atlas.microsoft.com/reverseGeocode?api-version=2025-01-01&coordinates=${long},${lat}&subscription-key=${
        import.meta.env.VITE_AZURE_MAP_SUB_KEY
      }`
    );

    const addressData = await getAddress.json();

    if (addressData.error) {
      console.error(addressData.error.message);
      return;
    }
    console.dir(addressData, { depth: null });

    const objectResult = addressData;

    if (objectResult.features && objectResult.features.length > 0) {
      const feature = objectResult.features[0];
      const { properties } = feature;

      if (properties.confidence === "High") {
        const { address, intersection } = properties;

        let formattedAddress = address.formattedAddress;

        if (
          intersection &&
          intersection.intersectionType &&
          intersection.secondaryStreet1 &&
          intersection.secondaryStreet2
        ) {
          formattedAddress = `${address.streetNumber || ""} ${
            address.streetName || ""
          }, between ${intersection.secondaryStreet1 || ""} and ${
            intersection.secondaryStreet2 || ""
          }, ${address.locality || ""}, ${
            address.adminDistricts?.[0]?.name || ""
          }, ${address.countryRegion?.name || ""}`;
        }

        return {
          formattedAddress,
          stateName: address.adminDistricts?.[0]?.name || "",
          cityName: address.locality || "",
          pincode: address.postalCode || "",
        };
      } else {
        return { error: "Confidence is not high. Data is not reliable." };
      }
    } else {
      return { error: "No features found in the object result." };
    }
  } catch (error) {
    console.error(error);
    return;
  }
};

// reverseGeocoding();
