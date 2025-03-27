export const CitiesAPI = async (stateCode, APIKEY) => {
  const headers = new Headers();
  console.log(APIKEY);
  headers.append("X-CSCAPI-KEY", APIKEY); // Ensure the key is correctly set up

  const requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `https://api.countrystatecity.in/v1/countries/IN/states/${stateCode}/cities`, // Replace placeholders with actual values
      requestOptions
    );
    const result = await response.json(); // Use `.json()` for parsing JSON response
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};
