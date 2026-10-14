// Admin: CRUD de categorías y de platos de la carta.
import { useCallback, useEffect, useRef, useState } from "react";
import { useAvisos } from "../../context/AvisosContext";
import {
  borrarCategoria,
  borrarPlato,
  guardarCategoria,
  guardarPlato,
  listarCategorias,
  listarPlatos,
} from "../../services/cartaService";

// Valores iniciales de los formularios vacíos
const categoriaVacia = { nombre: "", orden: 0 };
const platoVacio = { categoria_id: "", nombre: "", descripcion: "", precio: "", imagen_url: "", disponible: true };

export default function AdminCarta() {
  const { mostrarAviso, confirmar } = useAvisos();
  const [categorias, setCategorias] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [categoriaForm, setCategoriaForm] = useState(categoriaVacia);
  const [platoForm, setPlatoForm] = useState(platoVacio);
  // Referencia al formulario de plato, para desplazarse hasta él al editar
  const formularioPlatoRef = useRef(null);

  const cargar = useCallback(async () => {
    try {
      const [cats, plts] = await Promise.all([listarCategorias(), listarPlatos()]);
      setCategorias(cats);
      setPlatos(plts);
    } catch {
      mostrarAviso("error", "No se pudo cargar la carta.");
    }
  }, [mostrarAviso]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // ---------- Categorías ----------
  async function enviarCategoria(evento) {
    evento.preventDefault();
    try {
      await guardarCategoria({ ...categoriaForm, nombre: categoriaForm.nombre.trim(), orden: Number(categoriaForm.orden) });
      mostrarAviso("exito", categoriaForm.id ? "Categoría actualizada." : "Categoría creada.");
      setCategoriaForm(categoriaVacia);
      await cargar();
    } catch (fallo) {
      mostrarAviso("error", fallo.message.includes("unique") ? "Ya existe una categoría con ese nombre." : fallo.message);
    }
  }

  async function eliminarCategoria(categoria) {
    // Una categoría con platos no se puede borrar (la BD también lo impide)
    if (platos.some((p) => p.categoria_id === categoria.id)) {
      mostrarAviso("error", "No puedes borrar una categoría que tiene platos. Mueve o borra sus platos primero.");
      return;
    }
    const acepta = await confirmar({
      titulo: "Eliminar categoría",
      texto: `¿Eliminar la categoría "${categoria.nombre}"?`,
      textoBoton: "Eliminar",
    });
    if (!acepta) return;
    try {
      await borrarCategoria(categoria.id);
      mostrarAviso("exito", "Categoría eliminada.");
      await cargar();
    } catch (fallo) {
      mostrarAviso("error", fallo.message);
    }
  }

  // ---------- Platos ----------
  async function enviarPlato(evento) {
    evento.preventDefault();
    if (!platoForm.categoria_id) {
      mostrarAviso("error", "Selecciona una categoría para el plato.");
      return;
    }
    try {
      await guardarPlato({
        ...platoForm,
        categoria_id: Number(platoForm.categoria_id),
        nombre: platoForm.nombre.trim(),
        precio: Number(platoForm.precio),
      });
      mostrarAviso("exito", platoForm.id ? "Plato actualizado." : "Plato creado.");
      setPlatoForm(platoVacio);
      await cargar();
    } catch (fallo) {
      mostrarAviso("error", fallo.message);
    }
  }

  async function eliminarPlato(plato) {
    const acepta = await confirmar({
      titulo: "Eliminar plato",
      texto: `¿Eliminar "${plato.nombre}" de la carta?`,
      textoBoton: "Eliminar",
    });
    if (!acepta) return;
    try {
      await borrarPlato(plato.id);
      mostrarAviso("exito", "Plato eliminado.");
      await cargar();
    } catch (fallo) {
      mostrarAviso("error", fallo.message);
    }
  }

  // Carga el plato en el formulario y baja hasta él (el formulario está encima de la tabla)
  function editarPlato(plato) {
    setPlatoForm({ ...plato, imagen_url: plato.imagen_url || "" });
    formularioPlatoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Cambia disponibilidad rápidamente desde la lista (Pausar / Reactivar)
  async function alternarDisponible(plato) {
    try {
      await guardarPlato({ ...plato, disponible: !plato.disponible });
      mostrarAviso("exito", plato.disponible ? "Plato pausado." : "Plato reactivado.");
      await cargar();
    } catch (fallo) {
      mostrarAviso("error", fallo.message);
    }
  }

  const nombreCategoria = (id) => categorias.find((c) => c.id === id)?.nombre ?? "—";

  return (
    <div className="admin-carta">
      <section aria-labelledby="titulo-categorias">
        <h2 id="titulo-categorias">Categorías de la Carta</h2>
        <form className="formulario formulario--fila" onSubmit={enviarCategoria}>
          <label>Nombre
            <input required value={categoriaForm.nombre} onChange={(e) => setCategoriaForm({ ...categoriaForm, nombre: e.target.value })} />
          </label>
          <label>Orden
            <input type="number" value={categoriaForm.orden} onChange={(e) => setCategoriaForm({ ...categoriaForm, orden: e.target.value })} />
          </label>
          <button className="boton boton--primario" type="submit">{categoriaForm.id ? "Guardar" : "Crear categoría"}</button>
          {categoriaForm.id && <button type="button" className="boton boton--secundario" onClick={() => setCategoriaForm(categoriaVacia)}>Descartar</button>}
        </form>
        <ul className="lista-simple">
          {categorias.map((c) => (
            <li key={c.id}>
              <span>{c.nombre} <small>(orden {c.orden})</small></span>
              <span className="acciones">
                <button className="boton boton--secundario" onClick={() => setCategoriaForm(c)}>Editar</button>
                <button className="boton boton--peligro" onClick={() => eliminarCategoria(c)}>Eliminar</button>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="titulo-platos">
        <h2 id="titulo-platos">Platos</h2>
        <form ref={formularioPlatoRef} className="formulario formulario--ancho" onSubmit={enviarPlato}>
          <h3>{platoForm.id ? "Editar plato" : "Añadir nuevo plato"}</h3>
          <label>Nombre comercial
            <input required value={platoForm.nombre} onChange={(e) => setPlatoForm({ ...platoForm, nombre: e.target.value })} />
          </label>
          <label>Categoría
            <select required value={platoForm.categoria_id} onChange={(e) => setPlatoForm({ ...platoForm, categoria_id: e.target.value })}>
              <option value="">Selecciona…</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </label>
          <label>Precio (€)
            <input type="number" step="0.01" min="0" required value={platoForm.precio} onChange={(e) => setPlatoForm({ ...platoForm, precio: e.target.value })} />
          </label>
          <label>Descripción
            <textarea rows="3" value={platoForm.descripcion} onChange={(e) => setPlatoForm({ ...platoForm, descripcion: e.target.value })} />
          </label>
          <label>URL de la imagen (opcional)
            <input type="url" value={platoForm.imagen_url || ""} onChange={(e) => setPlatoForm({ ...platoForm, imagen_url: e.target.value })} />
          </label>
          <label className="casilla">
            <input type="checkbox" checked={platoForm.disponible} onChange={(e) => setPlatoForm({ ...platoForm, disponible: e.target.checked })} />
            Disponible en carta
          </label>
          <div className="acciones">
            <button className="boton boton--primario" type="submit">Guardar plato</button>
            {platoForm.id && <button type="button" className="boton boton--secundario" onClick={() => setPlatoForm(platoVacio)}>Descartar</button>}
          </div>
        </form>

        <div className="tabla-contenedor">
          <table className="tabla">
            <thead>
              <tr><th>Plato</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {platos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{nombreCategoria(p.categoria_id)}</td>
                  <td>{Number(p.precio).toFixed(2).replace(".", ",")} €</td>
                  <td><span className={`insignia ${p.disponible ? "insignia--ok" : "insignia--error"}`}>{p.disponible ? "En carta" : "Pausado"}</span></td>
                  <td>
                    <div className="acciones">
                      <button className="boton boton--secundario" onClick={() => editarPlato(p)}>Editar</button>
                      <button className="boton boton--secundario" onClick={() => alternarDisponible(p)}>{p.disponible ? "Pausar" : "Reactivar"}</button>
                      <button className="boton boton--peligro" onClick={() => eliminarPlato(p)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
