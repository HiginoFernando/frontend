import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginService,
  setupAxiosInterceptors,
  getCurrentUser,
} from "../services/authService";
import { AuthContext } from "../contexts/AuthContext";

// IMPORTAR O CSS criado acima:
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // Pequeno useEffect apenas para “forçar” a animação de card
  useEffect(() => {
    // mesmo que não precise de lógica, isso garante que o card seja exibido após montagem
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const responseData = await loginService(username, password);
      setupAxiosInterceptors();

      const decoded = getCurrentUser();
      if (!decoded) {
        throw new Error("Não foi possível decodificar o token");
      }

      setUser(decoded);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="login-page-background">
      <div className="login-card">
        <div className="login-header">
          <h2>Login</h2>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group" style={{ animationDelay: "0.2s" }}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              required
            />
          </div>

          <div className="input-group" style={{ animationDelay: "0.3s" }}>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
            />
          </div>

          {error && (
            <p className="login-error" style={{ animationDelay: "0.4s" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-login"
            style={{ animationDelay: "0.5s" }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
