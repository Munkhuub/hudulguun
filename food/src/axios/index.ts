import axios from "axios";

export const api = axios.create({
  baseURL: process.env.API_URL,
  timeout: 15000,
});

const readToken = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

// Attach the saved token to every request, so calls made on page load
// (before AuthProvider's effect runs) are still authenticated.
api.interceptors.request.use((config) => {
  const token = readToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = token;
  }
  return config;
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = token;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
