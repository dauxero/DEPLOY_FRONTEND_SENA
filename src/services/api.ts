import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "https://deploy-api-inventory-sena.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("token");
          window.location.href = "/login";
          toast.error("Session expired. Please login again.");
          break;
        case 403:
          toast.error("You do not have permission to perform this action.");
          break;
        case 404:
          toast.error("Resource not found.");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error("An error occurred. Please try again.");
      }
    } else if (error.request) {
      // Network error
      toast.error(
        "Unable to connect to the server. Please check your internet connection."
      );
    } else {
      toast.error("An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

export default api;
