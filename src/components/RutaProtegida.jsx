// Protege una ruta: si no hay sesión, redirige al login recordando a dónde quería ir.
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth();
  const ubicacion = useLocation();

  // Mientras se comprueba la sesión no decidimos nada (evita parpadeos)
  if (cargando) return <p className="cargando contenedor">Cargando…</p>;

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }
  return children;
}
