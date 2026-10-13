// Cabecera con navegación. Cambia según el usuario esté logueado y sea Admin o no.
// En móvil el menú se oculta y se abre con el botón hamburguesa.
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAvisos } from "../context/AvisosContext";

export default function Navbar() {
  const { usuario, perfil, esAdmin, cerrarSesion } = useAuth();
  const { mostrarAviso } = useAvisos();
  const navegar = useNavigate();

  // abierto: indica si el menú móvil está desplegado
  const [abierto, setAbierto] = useState(false);
  const cerrarMenu = () => setAbierto(false);

  async function salir(evento) {
    evento.preventDefault();
    await cerrarSesion();
    cerrarMenu();
    mostrarAviso("exito", "Has cerrado sesión correctamente.");
    navegar("/");
  }

  return (
    <header className="cabecera">
      <div className="cabecera__interior contenedor">
        <Link to="/" className="logo" onClick={cerrarMenu}>
          Legacy Of Burger
        </Link>

        {/* Botón hamburguesa: solo visible en pantallas pequeñas */}
        <button
          type="button"
          className="hamburguesa"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
          aria-controls="panel-menu"
          onClick={() => setAbierto(!abierto)}
        >
          <span className="hamburguesa__linea" />
          <span className="hamburguesa__linea" />
          <span className="hamburguesa__linea" />
        </button>

        {/* Panel con enlaces y acciones; en móvil se muestra/oculta según "abierto" */}
        <div id="panel-menu" className={`cabecera__panel ${abierto ? "cabecera__panel--abierto" : ""}`}>
          <nav aria-label="Navegación principal" className="menu">
            <NavLink to="/carta" onClick={cerrarMenu}>Carta</NavLink>
            <NavLink to="/reservas" onClick={cerrarMenu}>Reservas</NavLink>
            <NavLink to="/historia" onClick={cerrarMenu}>Nuestra Historia</NavLink>
            <NavLink to="/ubicacion" onClick={cerrarMenu}>Ubicación</NavLink>
            {esAdmin && <NavLink to="/admin" onClick={cerrarMenu}>Panel Admin</NavLink>}
          </nav>
          <div className="cabecera__acciones">
            {usuario ? (
              <>
                <span className="cabecera__usuario">{perfil?.nombre || usuario.email}</span>
                <button className="boton boton--secundario" onClick={salir}>
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="boton boton--secundario" onClick={cerrarMenu}>
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="boton boton--primario" onClick={cerrarMenu}>
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
