// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  setupAxiosInterceptors,
  logout as doLogout,
} from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) Configura axios com o token (se estiver salvo)
    setupAxiosInterceptors();

    // 2) Decodifica o token (se existir) e define o usuário
    const loggedUser = getCurrentUser();
    setUser(loggedUser);

    // 3) Finaliza o estado de loading
    setLoading(false);
  }, []);

  const logout = () => {
    doLogout();
    setUser(null);
  };

  const value = { user, setUser, loading, logout };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
