// src/services/auth.service.js

import axios from "axios";

// baseURL do seu back
axios.defaults.baseURL = "meu-backend-app-f0gjgrhkhsebe5g9.brazilsouth-01.azurewebsites.net";

const API_URL = "/api/auth";

/** Salva o token JWT no localStorage */
export function setToken(token) {
  localStorage.setItem("token", token);
}

/** Pega o token JWT do localStorage */
export function getToken() {
  return localStorage.getItem("token");
}

/** Remove o token JWT do localStorage */
export function removeToken() {
  localStorage.removeItem("token");
}

/**
 * Decodifica o payload de um JWT (sem validar assinatura).
 * @private
 */
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

/**
 * Devolve `{ username, role }` do usuário atual, ou `null` se não estiver logado.
 * Assume:
 *  - claim `sub` → username  
 *  - claim `role` ou `roles` → papel do usuário
 */
export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  // extrai username e role
  const username = payload.sub;
  let role = payload.role;
  if (!role && Array.isArray(payload.roles)) {
    role = payload.roles[0];
  }

  return { username, role };
}

/**
 * Configura o header Authorization em todas as requisições Axios
 * se existir token.
 */
export function setupAxiosInterceptors() {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

/**
 * Faz login, armazena token e configura interceptor.
 * @returns {Promise<object>} dados completos do back, mas você pode ignorar—
 * use só o token e depois getCurrentUser()
 */
export async function loginService(username, password) {
  const response = await axios.post(`${API_URL}/signin`, {
    username,
    password,
  });

  if (response.data.token) {
    setToken(response.data.token);
    setupAxiosInterceptors();
  }

  return response.data;
}

/** Faz logout: remove token e limpa interceptor */
export function logout() {
  removeToken();
  delete axios.defaults.headers.common["Authorization"];
}
