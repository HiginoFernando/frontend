// src/services/auth.service.js
import axios from "axios";
// src/services/auth.service.js (ou api.js)
console.log("VITE_API_BASE_URL =", import.meta.env.VITE_API_BASE_URL);

const API_BASE = import.meta.env.VITE_API_BASE_URL;
axios.defaults.baseURL = API_BASE;

const API_URL = "/api/auth";  // permanece

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

function decodeJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch (err) {
    console.error("Falha ao decodificar JWT:", err);
    return null;
  }
}

export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  const username = payload.sub;
  let role = payload.role;
  if (!role && Array.isArray(payload.roles)) {
    role = payload.roles[0];
  }
  return { username, role };
}

export function setupAxiosInterceptors() {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

export async function loginService(username, password) {
  const response = await axios.post(`${API_URL}/signin`, { username, password });
  if (response.data.token) {
    setToken(response.data.token);
    setupAxiosInterceptors();
  }
  return response.data;
}

export function logout() {
  removeToken();
  delete axios.defaults.headers.common["Authorization"];
}
