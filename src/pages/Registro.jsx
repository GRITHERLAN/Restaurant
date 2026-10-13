// Formulario de registro de clientes (rol "Cliente" por defecto en la base de datos).
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAvisos } from "../context/AvisosContext";

export default function Registro() {
  const { usuario, registrar, iniciarSesion } = useAuth();
  const { mostrarAviso } = useAvisos();
  const navegar = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetir, setRepetir] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to="/" replace />;

  async function enviar(evento) {
    evento.preventDefault();
    setError("");

    // Validaciones en cliente antes de llamar a Supabase
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== repetir) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setEnviando(true);
    const { data, error: fallo } = await registrar(nombre.trim(), email, password);
    setEnviando(false);

    if (fallo) {
      setError(
        fallo.message.includes("already")
          ? "Ya existe una cuenta con ese correo."
          : "No se pudo crear la cuenta: " + fallo.message
      );
      return;
    }

    // Si el registro no devolvió sesión, iniciamos sesión nosotros directamente:
    // el correo ya queda confirmado automáticamente en la base de datos.
    if (!data.session) {
      const { error: falloLogin } = await iniciarSesion(email, password);
      if (falloLogin) {
        mostrarAviso("exito", "Cuenta creada. Ya puedes iniciar sesión.");
        navegar("/login");
        return;
      }
    }
    mostrarAviso("exito", "Cuenta creada. ¡Ya puedes reservar tu mesa!");
    navegar("/reservas");
  }

  return (
    <main className="seccion contenedor contenedor--estrecho">
      <form className="formulario" onSubmit={enviar}>
        <h1>Crear Cuenta</h1>
        <label>
          Nombre
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required autoComplete="name" />
        </label>
        <label>
          Correo electrónico
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
        </label>
        <label>
          Repetir contraseña
          <input type="password" value={repetir} onChange={(e) => setRepetir(e.target.value)} required autoComplete="new-password" />
        </label>
        {error && <p className="mensaje mensaje--error" role="alert">{error}</p>}
        <button className="boton boton--primario" type="submit" disabled={enviando}>
          {enviando ? "Creando…" : "Registrarme"}
        </button>
        <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </form>
    </main>
  );
}
