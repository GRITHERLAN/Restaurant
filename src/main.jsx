// Punto de entrada: monta React y envuelve la app con el router y los contextos.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { AvisosProvider } from "./context/AvisosContext";
import "./styles/base.css";
import "./styles/componentes.css";
import "./styles/paginas.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AvisosProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AvisosProvider>
    </BrowserRouter>
  </StrictMode>
);
