import { useState } from "react";
import api from "../services/api";
import "./EsteticistaForm.css"; // renomeado

export default function EsteticistaForm() {
  const [form, setForm] = useState({
    nome: "",
    especialidade: "",
    email: "",
    fone: "",         // não esqueça de adicionar telefone se exigir no back
    password: "",
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado como ADMIN para cadastrar esteticistas.");
      return;
    }
    try {
      console.log("Vai enviar este JSON:", form);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await api.post("/esteticistas", form, config);
      console.log("Resposta da API:", response.data);
      alert("Esteticista cadastrado com sucesso!");
      setForm({ nome: "", especialidade: "", email: "", fone: "", password: "" });
    } catch (err) {
      console.error("Erro ao tentar cadastrar esteticista:", err);
      console.error("→ err.response:", err.response);
      const serverMsg =
        err.response?.data && typeof err.response.data !== "string"
          ? JSON.stringify(err.response.data, null, 2)
          : err.response?.data || err.message;
      alert("Falha ao cadastrar:\n" + serverMsg);
    }
  };

  const toggleMenu = () => setMenuOpen((o) => !o);

  return (
    <div className="doctor-page-background">
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
          <span className="bar top-bar" />
          <span className="bar mid-bar" />
          <span className="bar bot-bar" />
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

      <div className="doctor-card animate-card">
        <div className="doctor-header animate-header">
          <svg className="doctor-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
            <path d="M32 2C18.745 2 8 12.745 8 26c0 10.905 7.137 20.105 17 23.338V62h10V49.338C48.863 46.105 56 36.905 56 26 56 12.745 45.255 2 32 2zM32 6c12.15 0 22 9.85 22 22 0 9.065-5.161 17.04-12.75 20.967L41 50H23l-.25-1.033C17.161 45.04 12 37.065 12 28 12 15.85 21.85 6 32 6zm-6 14h12v4H26zm0 8h12v4H26z" />
          </svg>
          <h2 className="doctor-title">Cadastro de Esteticista</h2>
        </div>

        <form className="doctor-form" onSubmit={handleSubmit}>
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

          {/* Especialidade */}
          <div className="input-group animate-input" style={{ animationDelay: "0.4s" }}>
            <label htmlFor="especialidade">Especialidade</label>
            <input
              id="especialidade"
              name="especialidade"
              type="text"
              placeholder="Ex: Esteticista Facial"
              value={form.especialidade}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group animate-input" style={{ animationDelay: "0.6s" }}>
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
          <div className="input-group animate-input" style={{ animationDelay: "0.8s" }}>
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

          <button type="submit" className="btn-submit animate-button">
            Cadastrar Esteticista
          </button>
        </form>
      </div>
    </div>
  );
}
