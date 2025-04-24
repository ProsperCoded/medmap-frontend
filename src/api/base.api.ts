import axios from "axios";
import { getSession } from "../lib/utils";
// Set config defaults when creating the instance
export const api = axios.create({
  // baseURL: "https://medmap-backend.up.railway.app",
  baseURL: "http://localhost:3100",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const tokenObj = getSession(); // Get the object
    const token = tokenObj?.session;
    console.log(token); // Extract the token from the object
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
    }
    return config;
  },
  (error) => Promise.reject(error) // Handle request errors
);
