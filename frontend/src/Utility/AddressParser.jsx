export const ParseData = (data) => {
  return data.features.map((feature) => {
    const address = feature.properties.address;
    return {
      name: address.formattedAddress,
      state: address.adminDistricts
        .map((district) => district.shortName)
        .join(", "),
      country: address.countryRegion.name,
      type: feature.properties.type,
    };
  });
};
