// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./contexts/AuthContext"; // caminho para seu AuthContext

// Se estiver usando CSS global:
// import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* 1) BrowserRouter precisa envolver toda a aplicação */}
    <BrowserRouter>
      {/* 2) AuthProvider precisa envolver todo o <App />, 
          para que useContext(AuthContext) funcione em qualquer componente. */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
