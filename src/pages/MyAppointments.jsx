import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyAppointments = () => {
  const [consultas, setConsultas] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const resp = await axios.get('http://localhost:8080/api/consultas/meus');
        setConsultas(resp.data);
        setErro(null);
      } catch (err) {
        console.error("Erro ao buscar minhas consultas:", err);
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            setErro("Você não está autenticado ou não tem permissão.");
          } else if (err.response.status === 404) {
            setErro("Endpoint não encontrado — verifique seu servidor.");
          } else {
            setErro("Erro ao buscar consultas.");
          }
        } else {
          setErro("Erro de rede.");
        }
      }
    };

    fetchConsultas();
  }, []);

  return (
    <div>
      <h2>Minhas Consultas</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {!erro && consultas.length === 0 && (
        <p>Você não possui consultas agendadas.</p>
      )}
      {consultas.length > 0 && (
        <ul>
          {consultas.map((c, i) => (
            <li key={i}>
              <strong>Data:</strong> {c.data}<br/>
              <strong>Esteticista:</strong> {c.esteticista}<br/>
              <strong>Especialidade:</strong> {c.especialidade}
              <hr/>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyAppointments;
