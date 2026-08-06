import axios from "axios";
import { getAuth } from "firebase/auth";

// Single source of truth for the API base URL.
// Defaults to the local dev server — override with VITE_API_URL in .env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Plain client — no auth header (public endpoints, registration, role checks)
export const httpClient = axios.create({
  baseURL: API_BASE_URL,
});

// Authed client — automatically attaches the current Firebase ID token
// to every request. Use for all protected endpoints.
export const authHttpClient = axios.create({
  baseURL: API_BASE_URL,
});

authHttpClient.interceptors.request.use(
  async (config) => {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Reads the most useful error message from an axios error
export const getErrorMessage = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.message || fallback;

export default API_BASE_URL;
