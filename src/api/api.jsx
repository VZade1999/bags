import axios from "axios";
import Cookies from "js-cookie";

// const API_URL = "http://localhost:5000";
const API_URL = "https://bagsbe-production.up.railway.app";

// Function to get auth headers from cookies
const getAuthHeaders = () => {
  const authToken = Cookies.get("authCode");
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

// Function for POST requests
export const PostApi = async (path, payload, auth = false) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(auth ? getAuthHeaders() : {}), // Conditionally include auth headers
    };

    const response = await axios.post(`${API_URL}${path}`, payload, {
      headers,
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
};

// Function for GET requests
export const GetApi = async (path, auth = false) => {
  try {
    const headers = {
      ...(auth ? getAuthHeaders() : {}), // Conditionally include auth headers
    };

    const response = await axios.get(`${API_URL}${path}`, { headers });
    return response;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
};
