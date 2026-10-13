// Página de inicio: presentación, filosofía y acceso rápido a la reserva.
import { Link } from "react-router-dom";

// Datos de las tres tarjetas de "filosofía" (texto fijo de la web)
const filosofia = [
  { titulo: "Maduración Perfecta", texto: "Carne de buey y novilla seleccionada con 45 días de maduración dry-aged para lograr una concentración de sabor intensa, umami y textura inigualable." },
  { titulo: "Smash Ultrafina & Costra", texto: "Planchas de cromo duro a más de 260 °C. Presión brutal y milimétrica que desencadena la reacción de Maillard para una corteza crujiente y jugo interior intacto." },
  { titulo: "Salsas desde Cero", texto: "Emulsiones, reducciones de bourbon y salsas ahumadas preparadas diariamente en nuestro obrador sin aditivos ni ultraprocesados comerciales." },
];

export default function Inicio() {
  return (
    <main>
      <section className="heroe">
        <div className="contenedor heroe__interior">
          <h1>El arte del smash con actitud y fuego</h1>
          <p>
            Carne madurada 45 días, pan brioche artesanal tostado con mantequilla ahumada y
            salsas secretas de autor. Bienvenidos al templo de la hamburguesa definitiva.
          </p>
          <div className="heroe__botones">
            <Link to="/reservas" className="boton boton--primario boton--grande">Reservar Mesa Ahora</Link>
            <Link to="/carta" className="boton boton--secundario boton--grande">Explorar Nuestra Carta</Link>
          </div>
          <ul className="etiquetas">
            <li>100% Black Angus Selección</li>
            <li>4.9/5 en Reseñas Gastronómicas</li>
            <li>Servicio Rápido y Exclusivo</li>
          </ul>
        </div>
      </section>

      <section className="seccion contenedor">
        <p className="sobretitulo">Obsesión por el detalle</p>
        <h2 className="titulo-centrado">Nuestra Filosofía de Fuego</h2>
        <div className="rejilla rejilla--3">
          {filosofia.map((item) => (
            <article className="tarjeta" key={item.titulo}>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="seccion contenedor">
        <div className="llamada">
          <h2>Reserva Rápida de Mesa</h2>
          <p>Asegura tu templo cárnico hoy mismo. Plazas limitadas por pase para garantizar máxima calidad.</p>
          <p className="llamada__nota">Horario de cenas: 20:00h – 23:30h. Solo clientes registrados pueden confirmar mesa.</p>
          <Link to="/reservas" className="boton boton--primario boton--grande">Comprobar Disponibilidad</Link>
        </div>
      </section>
    </main>
  );
}
