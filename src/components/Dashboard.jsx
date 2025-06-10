import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Exemplo: consulta a rota protegida /api/test/user no backend
    axios
      .get('meu-backend-app-f0gjgrhkhsebe5g9.brazilsouth-01.azurewebsites.net/api/test/user')
      .then(res => {
        if (res.data) {
          setMensagem(res.data);
        }
      })
      .catch(err => {
        console.error('Erro ao buscar dados protegidos:', err);
        // Se o token expirou (401), faz logout e redireciona para login
        if (err.response && err.response.status === 401) {
          logout();
          navigate('/login');
        }
      });
  }, [logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', paddingTop: '50px' }}>
      <h2>Dashboard</h2>
      <p>Olá, {user.username}! (ID: {user.id})</p>
      <p>{mensagem}</p>
      <button onClick={handleLogout} style={{ padding: '8px 16px', marginTop: '20px' }}>
        Sair
      </button>
    </div>
  );
}
