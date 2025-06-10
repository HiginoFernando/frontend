// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Páginas principais (em src/pages)
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import Appointments from "./pages/Appointments";
import Esteticistas from "./pages/Esteticista";
import Patients from "./pages/Patients";
import MyAppointments from "./pages/MyAppointments";  // nova página

// Componentes de infraestrutura
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Home ("/") */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      {/* Agendamentos gerais */}
      <Route
        path="/appointments"
        element={
          <PrivateRoute>
            <Appointments />
          </PrivateRoute>
        }
      />

      {/* Meus Agendamentos (para clientes) */}
      <Route
        path="/myappointments"
        element={
          <PrivateRoute>
            <MyAppointments />
          </PrivateRoute>
        }
      />

      {/* Esteticistas */}
      <Route
        path="/esteticistas"
        element={
          <PrivateRoute>
            <Esteticistas />
          </PrivateRoute>
        }
      />

      {/* Pacientes */}
      <Route
        path="/patients"
        element={
          <PrivateRoute>
            <Patients />
          </PrivateRoute>
        }
      />

      {/* Relatórios */}
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        }
      />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Qualquer outra rota redireciona para Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
