// src/lib/axios.ts

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
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

      // هنبعت رسالة للكومبوننت إن مفيش صلاحية
      error.customMessage = "You don’t have permission to view this data.";
    }

    return Promise.reject(error);
  }
);

export default api;