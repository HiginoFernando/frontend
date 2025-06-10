import { useEffect, useState } from "react";
import api from "../services/api";
import "./AppointmentForm.css";
import { Link } from "react-router-dom";

export default function AppointmentForm() {
  const [form, setForm] = useState({
    data: "",
    pacienteId: "",
    esteticistaId: "",
  });

  const [esteticistas, setEsteticistas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [estetRes, pacRes] = await Promise.all([
          api.get("/esteticistas"),
          api.get("/pacientes"),
        ]);
        setEsteticistas(Array.isArray(estetRes.data) ? estetRes.data : []);
        setPacientes(Array.isArray(pacRes.data) ? pacRes.data : []);
      } catch (err) {
        console.error("Erro ao buscar esteticistas/pacientes:", err);
        setEsteticistas([]);
        setPacientes([]);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "pacienteId" || name === "esteticistaId" ? Number(value) : value,
    }));
  };

  const formatData = (input) => {
    // Garante que a data tenha segundos (formato "yyyy-MM-ddTHH:mm:ss")
    return input.length === 16 ? `${input}:00` : input;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Faça login para agendar consulta.");
      return;
    }

    const consultaData = {
      ...form,
      data: formatData(form.data),
    };

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await api.post("/consultas", consultaData, config);
      alert("Consulta cadastrada com sucesso!");
      setForm({ data: "", pacienteId: "", esteticistaId: "" });
    } catch (err) {
      console.error("Erro ao cadastrar consulta:", err.response?.data || err);
      alert(
        "Erro ao cadastrar consulta: " +
          (err.response?.data?.erro || JSON.stringify(err.response?.data) || err.message)
      );
    }
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="appointment-page-background">
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
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Início</Link></li>
            <li><Link to="/esteticistas" onClick={() => setMenuOpen(false)}>Esteticistas</Link></li>
            <li><Link to="/pacientes" onClick={() => setMenuOpen(false)}>Pacientes</Link></li>
            <li><Link to="/consultas" onClick={() => setMenuOpen(false)}>Consultas</Link></li>
            <li><Link to="/reports" onClick={() => setMenuOpen(false)}>Relatórios</Link></li>
          </ul>
        </nav>
      </header>

      <div className="appointment-card animate-card">
        <div className="appointment-header animate-header">
          <svg
            className="doctor-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            fill="currentColor"
          >
            <circle cx="32" cy="16" r="12" />
            <path d="M44 36H20c-4.418 0-8 3.582-8 8v8h40v-8c0-4.418-3.582-8-8-8z" />
            <rect x="28" y="48" width="8" height="12" rx="2" ry="2" />
          </svg>
          <h2 className="appointment-title">Painel de Agendamento</h2>
        </div>

        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="input-group animate-input" style={{ animationDelay: "0.2s" }}>
            <label htmlFor="data">Data e Hora</label>
            <input
              type="datetime-local"
              id="data"
              name="data"
              value={form.data}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group animate-input" style={{ animationDelay: "0.4s" }}>
            <label htmlFor="pacienteId">Paciente</label>
            <select
              id="pacienteId"
              name="pacienteId"
              value={form.pacienteId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o paciente</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group animate-input" style={{ animationDelay: "0.6s" }}>
            <label htmlFor="esteticistaId">Esteticista</label>
            <select
              id="esteticistaId"
              name="esteticistaId"
              value={form.esteticistaId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o esteticista</option>
              {esteticistas.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nome} ({e.especialidade})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn-submit animate-button"
            style={{ animationDelay: "0.8s" }}
          >
            Agendar Consulta
          </button>
        </form>
      </div>
    </div>
  );
}
