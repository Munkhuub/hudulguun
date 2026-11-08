import axios from "axios";

export const api = axios.create({
  // Same-origin: on Vercel, /api/* is routed to the food-api service.
  // Locally, next.config.ts proxies /api/* to API_PROXY_URL.
  baseURL: "/api",
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
