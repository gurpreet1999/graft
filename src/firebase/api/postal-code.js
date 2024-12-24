import logger from "../../utilities/logger";

// https://api.postcodes.io/ - API playground
const API_URL = "https://api.postcodes.io";

// Write a general fetch client to get data by endpoint from the API
export const fetchClient = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    return response.json();
  } catch (error) {
    logger.error(error, "Error fetching data from the postcode API.");
    return null;
  }
};

/**
 * Validates a UK postal code.
 * @param {postalCode} - UK postal code to validate.
 * @returns {boolean} - True if the postal code is valid, false otherwise.
 */
export const validatePostalCode = async (postalCode) => {
  if (!postalCode || typeof postalCode !== "string" || postalCode.length < 4) {
    return false;
  }

  const response = await fetchClient(`postcodes/${postalCode}/validate`);
  return response?.result ?? false;
};

/**
 * Look up a UK postal code.
 * @param {postalCode} - UK postal code to look up.
 * @returns {object} - The postal code data.
 */
export const lookupPostalCode = async (postalCode) => {
  if (!postalCode || typeof postalCode !== "string" || postalCode.length < 4) {
    return null;
  }

  const response = await fetchClient(`postcodes/${postalCode}`);

  // Contains longitude and latitude.
  return response?.result;
};

export const calculateDistance = (geoPoint1, geoPoint2) => {
  const { longitude: lon1, latitude: lat1 } = geoPoint1;
  const { longitude: lon2, latitude: lat2 } = geoPoint2;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180; // Convert degrees to radians
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};
