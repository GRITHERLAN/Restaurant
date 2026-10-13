// Admin: listado de reservas con filtros, modificación y cancelación.
import { useCallback, useEffect, useState } from "react";
import { useAvisos } from "../../context/AvisosContext";
import SelectorFranjas from "../../components/SelectorFranjas";
import {
  cancelarReserva,
  formatearFecha,
  listarTodasLasReservas,
  modificarReserva,
  quitarSegundos,
} from "../../services/reservasService";

export default function AdminReservas() {
  const { mostrarAviso, confirmar } = useAvisos();
  const [reservas, setReservas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  // editando: copia de la reserva que se está modificando (o null)
  const [editando, setEditando] = useState(null);

  const cargar = useCallback(async () => {
    try {
      setReservas(await listarTodasLasReservas());
    } catch {
      mostrarAviso("error", "No se pudieron cargar las reservas.");
    }
  }, [mostrarAviso]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Aplica los tres filtros del listado
  const texto = busqueda.trim().toLowerCase();
  const visibles = reservas.filter(
    (r) =>
      (!filtroFecha || r.fecha === filtroFecha) &&
      (filtroEstado === "todas" || r.estado === filtroEstado) &&
      (!texto ||
        r.profiles?.nombre.toLowerCase().includes(texto) ||
        r.profiles?.email.toLowerCase().includes(texto))
  );

  function empezarEdicion(reserva) {
    // Guardamos también los valores originales para el cálculo de plazas libres
    setEditando({
      ...reserva,
      franja: quitarSegundos(reserva.franja),
      original: { fecha: reserva.fecha, franja: quitarSegundos(reserva.franja), comensales: reserva.comensales },
    });
  }

  async function guardarEdicion(evento) {
    evento.preventDefault();
    try {
      await modificarReserva(editando.id, {
        fecha: editando.fecha,
        franja: editando.franja,
        comensales: editando.comensales,
      });
      mostrarAviso("exito", `Reserva #${editando.id} modificada correctamente.`);
      setEditando(null);
      await cargar();
    } catch (fallo) {
      mostrarAviso("error", fallo.message);
    }
  }

  async function cancelar(reserva) {
    const acepta = await confirmar({
      titulo: "Cancelar reserva",
      texto: `¿Cancelar la reserva #${reserva.id} de ${reserva.profiles?.nombre || "cliente"} (${formatearFecha(reserva.fecha)}, ${quitarSegundos(reserva.franja)}h)?`,
      textoBoton: "Cancelar reserva",
    });
    if (!acepta) return;
    try {
      await cancelarReserva(reserva.id);
      mostrarAviso("exito", `Reserva #${reserva.id} cancelada.`);
      await cargar();
    } catch (fallo) {
      mostrarAviso("error", fallo.message);
    }
  }

  return (
    <section aria-labelledby="titulo-reservas">
      <h2 id="titulo-reservas">Listado de Reservas</h2>

      <form className="filtros" onSubmit={(e) => e.preventDefault()}>
        <label>Fecha
          <input type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
        </label>
        <label>Estado
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="confirmada">Confirmadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </label>
        <label>Buscar cliente
          <input type="search" placeholder="Nombre o correo" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </label>
      </form>

      {/* Formulario de edición (aparece al pulsar "Modificar") */}
      {editando && (
        <form className="formulario formulario--ancho" onSubmit={guardarEdicion}>
          <h3>Modificar reserva #{editando.id}</h3>
          <label>Fecha
            <input type="date" required value={editando.fecha}
              onChange={(e) => setEditando({ ...editando, fecha: e.target.value })} />
          </label>
          <label>Comensales
            <input type="number" min="1" max="14" required value={editando.comensales}
              onChange={(e) => setEditando({ ...editando, comensales: Number(e.target.value) })} />
          </label>
          <fieldset>
            <legend>Franja horaria</legend>
            <SelectorFranjas
              fecha={editando.fecha}
              comensales={editando.comensales}
              valor={editando.franja}
              propia={editando.original}
              onChange={(f) => setEditando({ ...editando, franja: f })}
            />
          </fieldset>
          <div className="acciones">
            <button className="boton boton--primario" type="submit">Guardar cambios</button>
            <button className="boton boton--secundario" type="button" onClick={() => setEditando(null)}>Descartar</button>
          </div>
        </form>
      )}

      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th><th>Cliente</th><th>Fecha y hora</th><th>Comensales</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((r) => (
              <tr key={r.id} className={r.estado === "cancelada" ? "fila--cancelada" : ""}>
                <td>#{r.id}</td>
                <td>{r.profiles?.nombre || "—"}<br /><small>{r.profiles?.email}</small></td>
                <td>{formatearFecha(r.fecha)}<br /><small>{quitarSegundos(r.franja)}h</small></td>
                <td>{r.comensales}</td>
                <td><span className={`insignia ${r.estado === "confirmada" ? "insignia--ok" : "insignia--error"}`}>{r.estado === "confirmada" ? "Confirmada" : "Cancelada"}</span></td>
                <td>
                  {r.estado === "confirmada" && (
                    <div className="acciones">
                      <button className="boton boton--secundario" onClick={() => empezarEdicion(r)}>Modificar</button>
                      <button className="boton boton--peligro" onClick={() => cancelar(r)}>Cancelar</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibles.length === 0 && <p className="vacio">No hay reservas con esos filtros.</p>}
      </div>
    </section>
  );
}
