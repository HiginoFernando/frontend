// src/services/api.js

import axios from "axios";

// Cria a instância do Axios sem header fixo para Authorization
const api = axios.create({
  baseURL: "meu-backend-app-f0gjgrhkhsebe5g9.brazilsouth-01.azurewebsites.net/api",
});

// Interceptor que adiciona o token a cada requisição, lendo do localStorage no momento:
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
