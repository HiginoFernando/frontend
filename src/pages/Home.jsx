import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";
import api from "../services/api";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [totalConsultasMes, setTotalConsultasMes] = useState(0);
  const [totalProfissionais, setTotalProfissionais] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role === "ROLE_ADMIN") {
      // busca métricas apenas para ADMIN
      fetchMetrics();
    }
  }, [user, navigate]);

  if (!user) return null;

  const { username, role } = user;

  const displayRole = {
    ROLE_CLIENTE: "Cliente",
    ROLE_ESTETICISTA: "Esteticista",
    ROLE_ADMIN: "Administrador",
  }[role] || "Usuário";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  async function fetchMetrics() {
    try {
      // 1) total de agendamentos no mês
      const resCons = await api.get("/consultas", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const todas = Array.isArray(resCons.data) ? resCons.data : [];
      const now = new Date();
      const mesAtual = now.getMonth();
      const anoAtual = now.getFullYear();
      const countMes = todas.filter((c) => {
        const d = new Date(c.data);
        return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
      }).length;
      setTotalConsultasMes(countMes);

      // 2) total de profissionais
      const resProf = await api.get("/esteticistas");
      setTotalProfissionais(Array.isArray(resProf.data) ? resProf.data.length : 0);

      // 3) total de clientes
      const resCli = await api.get("/pacientes");
      setTotalClientes(Array.isArray(resCli.data) ? resCli.data.length : 0);
    } catch (err) {
      console.error("Erro ao buscar métricas:", err);
    }
  }

  return (
    <div className="home-container">
      <button onClick={handleLogout} className="logout-btn">Sair</button>

      <div className="home-hero">
        <div className="hero-overlay">
          <h1>Bem-vindo à Belle Esthétique</h1>
          <p>Elegância e bem-estar em cada toque.</p>
          <span className="user-badge">
            {username} — {displayRole}
          </span>
        </div>
      </div>

      {/* Dashboard de métricas (apenas ADMIN) */}
      {role === "ROLE_ADMIN" && (
        <div className="dashboard-cards">
          <div className="dash-card">
            <h4>Agendamentos este mês</h4>
            <p>{totalConsultasMes}</p>
          </div>
          <div className="dash-card">
            <h4>Profissionais</h4>
            <p>{totalProfissionais}</p>
          </div>
          <div className="dash-card">
            <h4>Clientes</h4>
            <p>{totalClientes}</p>
          </div>
        </div>
      )}

      <div className="home-actions">
        {/* Botão extra comum a todos */}
        <Link to="/appointments" className="action-card">
          <h3>Agendamento de Consultas</h3>
          <p>Marque uma consulta rapidamente.</p>
        </Link>

        {role === "ROLE_CLIENTE" && (
          <>
            
          </>
        )}

        {role === "ROLE_ESTETICISTA" && (
          <>
            <Link to="/appointments" className="action-card">
              <h3>Meus Atendimentos</h3>
              <p>Gerencie suas consultas.</p>
            </Link>
            <Link to="/patients" className="action-card">
              <h3>Clientes</h3>
              <p>Veja sua lista de clientes.</p>
            </Link>
            <Link to="/reports" className="action-card">
              <h3>Relatórios</h3>
              <p>Análises de atendimentos.</p>
            </Link>
          </>
        )}

        {role === "ROLE_ADMIN" && (
          <>
            <Link to="/patients" className="action-card">
              <h3>Pacientes</h3>
              <p>Gerencie todos os clientes.</p>
            </Link>
            <Link to="/esteticista" className="action-card">
              <h3>Profissionais</h3>
              <p>Cadastre e gerencie equipe.</p>
            </Link>
            <Link to="/reports" className="action-card">
              <h3>Relatórios</h3>
              <p>Extrair dados completos.</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
