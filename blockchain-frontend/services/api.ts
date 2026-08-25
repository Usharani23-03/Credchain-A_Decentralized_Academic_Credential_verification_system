import axios from "axios";

const api = axios.create({
  // Backend URL
  baseURL: "http://127.0.0.1:5555",

  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("========== API ERROR ==========");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Status:", error.response?.status);
    console.error("URL:", error.config?.url);
    console.error("Method:", error.config?.method);
    console.error("Response:", error.response?.data);
    console.error("Full error:", error);
    console.error("==============================");

    return Promise.reject(error);
  }
);
export default api;