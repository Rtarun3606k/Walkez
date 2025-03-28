const reverseGeocoding = async () => {
  try {
    const getAddress = await fetch(
      `https://atlas.microsoft.com/reverseGeocode?api-version=2025-01-01&coordinates=77.6077893376339,12.969548567990145&subscription-key=${
        import.meta.env.VITE_AZURE_MAP_SUB_KEY
      }`
    );

    const addressData = await getAddress.json();

    if (addressData.error) {
      console.error(addressData.error.message);
      return;
    }
    console.dir(addressData, { depth: null });
    return addressData;
  } catch (error) {
    console.error(error);
    return;
  }
};

// reverseGeocoding();
