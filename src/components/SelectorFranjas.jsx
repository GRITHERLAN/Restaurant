// Muestra las franjas horarias de una fecha con su disponibilidad en vivo.
// Se reutiliza en la reserva del cliente y en la edición del administrador.
import { useEffect, useState } from "react";
import { consultarDisponibilidad, quitarSegundos } from "../services/reservasService";

// Props:
// - fecha: "AAAA-MM-DD" (si está vacía no muestra nada)
// - comensales: nº de personas que se quiere sentar
// - valor: franja seleccionada ("21:00")
// - onChange: se llama con la franja elegida
// - propia: (opcional) reserva que se está editando; sus plazas cuentan como libres
export default function SelectorFranjas({ fecha, comensales, valor, onChange, propia }) {
  const [franjas, setFranjas] = useState([]);
  const [error, setError] = useState("");

  // Cada vez que cambia la fecha se vuelve a consultar la disponibilidad
  useEffect(() => {
    if (!fecha) return;
    setError("");
    consultarDisponibilidad(fecha)
      .then(setFranjas)
      .catch(() => setError("No se pudo comprobar la disponibilidad."));
  }, [fecha]);

  if (!fecha) return <p className="ayuda">Elige una fecha para ver las franjas disponibles.</p>;
  if (error) return <p className="mensaje mensaje--error" role="alert">{error}</p>;

  return (
    <div className="franjas" role="radiogroup" aria-label="Franja horaria">
      {franjas.map((f) => {
        const hora = quitarSegundos(f.franja);
        // Si editamos una reserva en esta misma franja, sus plazas vuelven a estar libres
        const devueltas = propia && propia.fecha === fecha && propia.franja === hora ? propia.comensales : 0;
        const libres = f.libres + devueltas;
        const cabe = libres >= comensales;
        return (
          <button
            key={f.franja}
            type="button"
            role="radio"
            aria-checked={valor === hora}
            className={`franja ${valor === hora ? "franja--activa" : ""}`}
            disabled={!cabe}
            onClick={() => onChange(hora)}
          >
            <strong>{hora}</strong>
            <span>{cabe ? `${libres} plazas libres` : "Completo"}</span>
          </button>
        );
      })}
    </div>
  );
}
