// src/lib/axios.ts

import axios from "axios";

const WEB_API_URL =  "/api";
const MOBILE_API_URL =  "/api";

// Default axios instance for web
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate instance for mobile if needed
export const apiMobile = axios.create({
  baseURL: MOBILE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================================
// RESPONSE INTERCEPTOR
// ================================
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;

    if (status === 403) {
      console.warn("⚠️ 403 Forbidden: User doesn't have access.");
      error.customMessage = "You don’t have permission to view this data.";
    }

    return Promise.reject(error);
  }
);

export default api;