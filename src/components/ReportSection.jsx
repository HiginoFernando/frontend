// src/components/ReportSection.jsx

import { useState, useEffect } from "react";
import api from "../services/api";
import "./ReportSection.css";

export default function ReportSection() {
  const [especialidade, setEspecialidade] = useState("");
  const [esteticistaId, setEsteticistaId] = useState("");
  const [resultados, setResultados] = useState([]);
  const [esteticistas, setEsteticistas] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api
      .get("/esteticistas")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setEsteticistas(res.data);
        } else if (res.data.content && Array.isArray(res.data.content)) {
          setEsteticistas(res.data.content);
        } else {
          setEsteticistas([]);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar /esteticistas:", err);
        setEsteticistas([]);
      });
  }, []);

  const buscar = async () => {
    try {
      const res = await api.get("/consultas/relatorio", {
        params: { especialidade, esteticistaId },
      });
      setResultados(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erro ao buscar relatório:", err);
      setResultados([]);
    }
  };

  const gerarPDF = async () => {
    try {
      const response = await api.get("/consultas/relatorio/pdf", {
        params: { especialidade, esteticistaId },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "relatorio_consultas.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Falha ao gerar PDF. Tente novamente.");
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="report-page-background">
      {/* HEADER COM MENU HAMBÚRGUER */}
      <header className="appointment-header-container">
        <div className="logo-title">
          <h1 className="site-title">Clínica Rostov</h1>
        </div>
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span className="bar top-bar"></span>
          <span className="bar mid-bar"></span>
          <span className="bar bot-bar"></span>
        </button>
        <nav className={`nav-menu ${menuOpen ? "show" : ""}`}>
          <ul>
            <li>
              <a href="/home" onClick={() => setMenuOpen(false)}>
                Início
              </a>
            </li>
            <li>
              <a href="/esteticistas" onClick={() => setMenuOpen(false)}>
                Esteticistas
              </a>
            </li>
            <li>
              <a href="/pacientes" onClick={() => setMenuOpen(false)}>
                Pacientes
              </a>
            </li>
            <li>
              <a href="/consultas" onClick={() => setMenuOpen(false)}>
                Consultas
              </a>
            </li>
            <li>
              <a href="/reports" onClick={() => setMenuOpen(false)}>
                Relatórios
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* CARD DE RELATÓRIO */}
      <div className="report-card animate-card">
        {/* Cabeçalho interno do card */}
        <div className="report-header animate-inner-header">
          <svg
            className="report-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            fill="currentColor"
          >
            <path d="M8 56h48v-4H8v4zm0-12h48v-4H8v4zm0-12h48v-4H8v4zm0-12h48V16H8v4z" />
          </svg>
          <h2 className="report-title">Relatório de Consultas</h2>
        </div>

        {/* FILTROS */}
        <div className="filters animate-input" style={{ animationDelay: "0.2s" }}>
          <div className="input-group">
            <label htmlFor="esteticistaId">Esteticista</label>
            <select
              id="esteticistaId"
              value={esteticistaId}
              onChange={(e) => setEsteticistaId(e.target.value)}
            >
              <option value="">Todos os Esteticistas</option>
              {esteticistas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="especialidade">Especialidade</label>
            <input
              type="text"
              id="especialidade"
              placeholder="Ex: Cardiologia"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
            />
          </div>

          <button
            className="btn-submit animate-button"
            onClick={buscar}
            style={{ animationDelay: "0.4s", marginRight: "1rem" }}
          >
            Buscar
          </button>
          <button
            className="btn-submit animate-button"
            onClick={gerarPDF}
            style={{
              animationDelay: "0.4s",
              backgroundColor: "var(--accent-color)",
            }}
          >
            Gerar PDF
          </button>
        </div>

        {/* RESULTADOS */}
        <div className="results animate-input" style={{ animationDelay: "0.6s" }}>
          {resultados.length > 0 ? (
            <ul className="result-list">
              {resultados.map((c, i) => (
                <li key={i} className="result-item">
                  <p className="result-date">
                    📅{" "}
                    {new Date(c.data).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="result-info">
                    <span className="info-label">Esteticista:</span>{" "}
                    <span className="info-value">{c.esteticista_nome}</span> —{" "}
                    {c.especialidade}
                  </p>
                  <p className="result-info">
                    <span className="info-label">Paciente:</span>{" "}
                    <span className="info-value">{c.paciente_nome}</span>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-results">Nenhum resultado encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
