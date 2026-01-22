// ====================
// PUNTO DE ENTRADA DE LA APLICACIÓN REACT
// ====================
// Este es el archivo principal que inicia la aplicación React
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Renderizar la aplicación en el elemento con id="root" del HTML
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
