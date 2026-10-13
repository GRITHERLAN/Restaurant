// Protege el panel: solo usuarios con rol "Admin". Los clientes vuelven al inicio.
// (La seguridad real la garantizan las políticas RLS de Supabase; esto es solo UX.)
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaAdmin({ children }) {
  const { usuario, perfil, esAdmin, cargando } = useAuth();

  if (cargando || (usuario && !perfil)) {
    return <p className="cargando contenedor">Cargando…</p>;
  }
  if (!usuario) return <Navigate to="/login" replace state={{ desde: "/admin" }} />;
  if (!esAdmin) return <Navigate to="/" replace />;
  return children;
}
