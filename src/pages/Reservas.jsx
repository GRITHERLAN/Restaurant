// Página de reservas del cliente (ruta protegida):
// elegir comensales, fecha y franja -> crear reserva, y gestionar "Mis reservas".
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAvisos } from "../context/AvisosContext";
import SelectorFranjas from "../components/SelectorFranjas";
import {
  cancelarReserva,
  crearReserva,
  formatearFecha,
  hoyISO,
  listarMisReservas,
  quitarSegundos,
} from "../services/reservasService";

export default function Reservas() {
  const { usuario, perfil } = useAuth();
  const { mostrarAviso, confirmar } = useAvisos();

  const [comensales, setComensales] = useState(2);
  const [fecha, setFecha] = useState("");
  const [franja, setFranja] = useState("");
  const [notas, setNotas] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [misReservas, setMisReservas] = useState([]);

  // Recarga la lista de reservas del usuario
  const cargarReservas = useCallback(async () => {
    try {
      setMisReservas(await listarMisReservas());
    } catch {
      mostrarAviso("error", "No se pudieron cargar tus reservas.");
    }
  }, [mostrarAviso]);

  useEffect(() => {
    cargarReservas();
  }, [cargarReservas]);

  // Cambiar el nº de comensales o la fecha invalida la franja elegida
  function cambiarComensales(valor) {
    setComensales(Math.min(14, Math.max(1, valor)));
    setFranja("");
  }

  async function reservar(evento) {
    evento.preventDefault();
    if (!fecha || !franja) {
      mostrarAviso("error", "Selecciona una fecha y una franja horaria.");
      return;
    }
    setEnviando(true);
    try {
      await crearReserva({ userId: usuario.id, fecha, franja, comensales, notas });
      mostrarAviso("exito", `¡Reserva confirmada para el ${formatearFecha(fecha)} a las ${franja}!`);
      setFranja("");
      setNotas("");
      await cargarReservas();
    } catch (fallo) {
      // Aquí llegan los errores del trigger (aforo completo, reserva duplicada…)
      const duplicada = fallo.message.includes("reservas_usuario_franja_uq");
      mostrarAviso(
        "error",
        duplicada ? "Ya tienes una reserva en esa fecha y franja." : fallo.message
      );
    } finally {
      setEnviando(false);
    }
  }

  async function cancelar(reserva) {
    const acepta = await confirmar({
      titulo: "Cancelar reserva",
      texto: `¿Seguro que quieres cancelar tu reserva del ${formatearFecha(reserva.fecha)} a las ${quitarSegundos(reserva.franja)}?`,
      textoBoton: "Sí, cancelar",
    });
    if (!acepta) return;
    try {
      await cancelarReserva(reserva.id);
      mostrarAviso("exito", "Tu reserva ha sido cancelada.");
      await cargarReservas();
    } catch {
      mostrarAviso("error", "No se pudo cancelar la reserva.");
    }
  }

  const activas = misReservas.filter((r) => r.estado === "confirmada" && r.fecha >= hoyISO());
  const historial = misReservas.filter((r) => !activas.includes(r));

  return (
    <main className="seccion contenedor contenedor--medio">
      <h1>Reserva tu mesa en Legacy Of Burger</h1>
      <p className="mensaje mensaje--info">
        Sesión iniciada: <strong>{perfil?.nombre || usuario.email}</strong>. Tus reservas quedan vinculadas a tu cuenta.
      </p>

      <form className="formulario formulario--ancho" onSubmit={reservar}>
        <fieldset>
          <legend>1. Número de comensales</legend>
          <div className="contador">
            <button type="button" className="boton boton--secundario" onClick={() => cambiarComensales(comensales - 1)} aria-label="Menos comensales">−</button>
            <output aria-live="polite">{comensales}</output>
            <button type="button" className="boton boton--secundario" onClick={() => cambiarComensales(comensales + 1)} aria-label="Más comensales">+</button>
            <small>Máximo 14 comensales online</small>
          </div>
        </fieldset>

        <label>
          2. Fecha
          <input
            type="date"
            min={hoyISO()}
            value={fecha}
            onChange={(e) => { setFecha(e.target.value); setFranja(""); }}
            required
          />
        </label>

        <fieldset>
          <legend>3. Franja horaria</legend>
          <SelectorFranjas fecha={fecha} comensales={comensales} valor={franja} onChange={setFranja} />
        </fieldset>

        <label>
          Notas (opcional)
          <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows="2" maxLength="200" />
        </label>

        <button className="boton boton--primario boton--grande" type="submit" disabled={enviando}>
          {enviando ? "Reservando…" : "Confirmar reserva"}
        </button>
      </form>

      <section aria-labelledby="mis-reservas">
        <h2 id="mis-reservas">Mis Reservas Activas</h2>
        {activas.length === 0 && <p className="vacio">No tienes reservas activas.</p>}
        <div className="lista">
          {activas.map((r) => (
            <article className="reserva" key={r.id}>
              <div>
                <h3>Reserva #{r.id} <span className="insignia insignia--ok">Confirmada</span></h3>
                <p>{formatearFecha(r.fecha)} · {quitarSegundos(r.franja)}h · {r.comensales} {r.comensales === 1 ? "persona" : "personas"}</p>
              </div>
              <button className="boton boton--peligro" onClick={() => cancelar(r)}>Cancelar Reserva</button>
            </article>
          ))}
        </div>

        {historial.length > 0 && (
          <>
            <h2>Historial</h2>
            <div className="lista">
              {historial.map((r) => (
                <article className="reserva reserva--pasada" key={r.id}>
                  <div>
                    <h3>Reserva #{r.id} <span className={`insignia ${r.estado === "cancelada" ? "insignia--error" : ""}`}>{r.estado === "cancelada" ? "Cancelada" : "Finalizada"}</span></h3>
                    <p>{formatearFecha(r.fecha)} · {quitarSegundos(r.franja)}h · {r.comensales} pers.</p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
