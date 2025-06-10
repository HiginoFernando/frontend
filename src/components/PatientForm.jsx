// src/components/PatientForm.jsx

import { useState } from "react";
import api from "../services/api";
import "./PatientForm.css";

export default function PatientForm() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    fone: "",
    dataNasc: "",
    password: "",    // adicionado
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado como ADMIN para cadastrar pacientes.");
      return;
    }

    console.log("JSON a ser enviado:", form);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await api.post("/pacientes", form, config);
      console.log("Resposta da API:", response.data);
      alert("Paciente cadastrado com sucesso!");
      setForm({ nome: "", email: "", fone: "", dataNasc: "", password: "" });
    } catch (err) {
      console.error("Erro ao cadastrar paciente:", err);
      console.error("→ status:", err.response?.status);
      console.error("→ response:", err.response?.data);
      const serverMsg =
        err.response?.data && typeof err.response.data !== "string"
          ? JSON.stringify(err.response.data, null, 2)
          : err.response?.data || err.message;
      alert("Erro ao cadastrar paciente:\n" + serverMsg);
    }
  };

  const toggleMenu = () => setMenuOpen((o) => !o);

  return (
    <div className="patient-page-background">
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
            <li><a href="/Home" onClick={() => setMenuOpen(false)}>Início</a></li>
            <li><a href="/esteticistas" onClick={() => setMenuOpen(false)}>Esteticistas</a></li>
            <li><a href="/pacientes" onClick={() => setMenuOpen(false)}>Pacientes</a></li>
            <li><a href="/consultas" onClick={() => setMenuOpen(false)}>Consultas</a></li>
            <li><a href="/reports" onClick={() => setMenuOpen(false)}>Relatórios</a></li>
          </ul>
        </nav>
      </header>

      <div className="patient-card animate-card">
        <div className="patient-header animate-header">
          <svg
            className="patient-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            fill="currentColor"
          >
            <circle cx="32" cy="16" r="12" />
            <path d="M48 58c0-7.732-6.268-14-14-14s-14 6.268-14 14h28z" />
            <rect x="24" y="32" width="16" height="20" rx="4" ry="4" />
          </svg>
          <h2 className="patient-title">Cadastro de Paciente</h2>
        </div>

        <form className="patient-form" onSubmit={handleSubmit}>
          {/* Nome */}
          <div className="input-group animate-input" style={{ animationDelay: "0.2s" }}>
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Digite o nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group animate-input" style={{ animationDelay: "0.4s" }}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="exemplo@dominio.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Telefone */}
          <div className="input-group animate-input" style={{ animationDelay: "0.6s" }}>
            <label htmlFor="fone">Telefone</label>
            <input
              id="fone"
              name="fone"
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              value={form.fone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Data de Nascimento */}
          <div className="input-group animate-input" style={{ animationDelay: "0.8s" }}>
            <label htmlFor="dataNasc">Data de Nascimento</label>
            <input
              id="dataNasc"
              name="dataNasc"
              type="date"
              value={form.dataNasc}
              onChange={handleChange}
              required
            />
          </div>

          {/* Senha */}
          <div className="input-group animate-input" style={{ animationDelay: "1s" }}>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Digite uma senha"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-submit animate-button" style={{ animationDelay: "1.2s" }}>
            Cadastrar Paciente
          </button>
        </form>
      </div>
    </div>
  );
}
