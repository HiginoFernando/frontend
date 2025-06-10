// src/components/PrivateRoute.jsx

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

/**
 * Componente de rota protegida.
 *
 * Props:
 * - children: elemento(s) React a serem renderizados se o usuário estiver autorizado.
 * - requiredRole (opcional): string com o role requerido (ex.: "ROLE_MEDICO" ou "ROLE_PACIENTE").
 *
 * Fluxo:
 * 1. Se ainda estiver carregando o estado de autenticação (loading === true), exibe "Carregando...".
 * 2. Se não houver usuário (user === null), redireciona para "/login".
 * 3. Se houver requiredRole e user.role for diferente, redireciona para "/not-authorized".
 * 4. Caso contrário, renderiza o conteúdo passado em children.
 */
export default function PrivateRoute({ children, requiredRole }) {
  const { user, loading } = useContext(AuthContext);

  // 1) Enquanto estiver verificando token / carregando contexto:
  if (loading) {
    return <div>Carregando...</div>;
  }

  // 2) Se não estiver logado, redireciona para /login:
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3) Se exigir role específico e o usuário não tiver esse role:
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/not-authorized" replace />;
  }

  // 4) Usuário está autenticado (e, se exigido, possui o role correto):
  return children;
}
