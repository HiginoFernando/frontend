// src/services/api.js

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL; 
// vai valer algo como "https://meu-backend-app-f0gjgrhkhsebe5g9.brazilsouth-01.azurewebsites.net/api"

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
