// Carta pública: platos agrupados por categoría, con buscador y filtro por categoría.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarCategorias, listarPlatos } from "../services/cartaService";

export default function Carta() {
  const [categorias, setCategorias] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Carga inicial de datos desde Supabase
  useEffect(() => {
    Promise.all([listarCategorias(), listarPlatos()])
      .then(([cats, plts]) => {
        setCategorias(cats);
        setPlatos(plts);
      })
      .catch(() => setError("No se pudo cargar la carta. Inténtalo de nuevo más tarde."))
      .finally(() => setCargando(false));
  }, []);

  // Filtra por texto (nombre/descripción) y solo muestra platos disponibles
  const texto = busqueda.trim().toLowerCase();
  const platosVisibles = platos.filter(
    (p) =>
      p.disponible &&
      (p.nombre.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto))
  );

  // Categorías a mostrar según la pestaña activa
  const categoriasVisibles = categorias.filter(
    (c) => categoriaActiva === "todas" || c.id === categoriaActiva
  );

  return (
    <main>
      <section className="heroe heroe--corto">
        <div className="contenedor">
          <h1>Nuestra Carta de Autor</h1>
          <p>Cada ingrediente tiene una razón de ser. Cortes de carne de máxima calidad y horneamos nuestro brioche cada mañana.</p>
          <input
            type="search"
            className="buscador"
            placeholder="Buscar por ingrediente o nombre…"
            aria-label="Buscar en la carta"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="pestanas" role="tablist">
            <button role="tab" aria-selected={categoriaActiva === "todas"} className="pestana" onClick={() => setCategoriaActiva("todas")}>Todas</button>
            {categorias.map((c) => (
              <button key={c.id} role="tab" aria-selected={categoriaActiva === c.id} className="pestana" onClick={() => setCategoriaActiva(c.id)}>
                {c.nombre}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="seccion contenedor">
        {cargando && <p className="cargando">Cargando carta…</p>}
        {error && <p className="mensaje mensaje--error" role="alert">{error}</p>}

        {categoriasVisibles.map((categoria) => {
          const delaCategoria = platosVisibles.filter((p) => p.categoria_id === categoria.id);
          if (delaCategoria.length === 0) return null;
          return (
            <section key={categoria.id} className="carta__categoria">
              <h2>{categoria.nombre}</h2>
              <div className="rejilla rejilla--4">
                {delaCategoria.map((plato) => (
                  <article className="plato" key={plato.id}>
                    {plato.imagen_url ? (
                      <img src={plato.imagen_url} alt={plato.nombre} loading="lazy" />
                    ) : (
                      <div className="plato__sin-imagen" aria-hidden="true" />
                    )}
                    <div className="plato__cuerpo">
                      <header className="plato__cabecera">
                        <h3>{plato.nombre}</h3>
                        <p className="plato__precio">{Number(plato.precio).toFixed(2).replace(".", ",")} €</p>
                      </header>
                      <p>{plato.descripcion}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        {!cargando && !error && platosVisibles.length === 0 && (
          <p className="vacio">No hay platos que coincidan con tu búsqueda.</p>
        )}

        <div className="llamada">
          <h2>¿Quieres probar estos platos recién salidos de la plancha?</h2>
          <Link to="/reservas" className="boton boton--primario boton--grande">Ir a Reservar Mesa</Link>
        </div>
      </div>
    </main>
  );
}
