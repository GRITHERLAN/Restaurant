// Formulario de inicio de sesión.
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAvisos } from "../context/AvisosContext";

export default function Login() {
  const { usuario, iniciarSesion } = useAuth();
  const { mostrarAviso } = useAvisos();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Si ya hay sesión, no tiene sentido ver el login
  if (usuario) return <Navigate to="/" replace />;

  async function enviar(evento) {
    evento.preventDefault(); // evita que el navegador recargue la página
    setError("");
    setEnviando(true);
    const { error: fallo } = await iniciarSesion(email, password);
    setEnviando(false);
    if (fallo) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    mostrarAviso("exito", "¡Bienvenido de nuevo!");
    // Volvemos a la página que intentaba abrir (si venía de una ruta protegida)
    navegar(ubicacion.state?.desde || "/", { replace: true });
  }

  return (
    <main className="seccion contenedor contenedor--estrecho">
      <form className="formulario" onSubmit={enviar}>
        <h1>Iniciar Sesión</h1>
        <label>
          Correo electrónico
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </label>
        {error && <p className="mensaje mensaje--error" role="alert">{error}</p>}
        <button className="boton boton--primario" type="submit" disabled={enviando}>
          {enviando ? "Entrando…" : "Entrar"}
        </button>
        <p>¿Aún no tienes cuenta? <Link to="/registro">Regístrate</Link></p>
      </form>
    </main>
  );
}
