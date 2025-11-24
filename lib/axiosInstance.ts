// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api", // ✅ بيروح على الريرايت اللي في next.config
  withCredentials: true, // ✅ ده أهم سطر عشان الكوكي تتبعت مع كل request
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;