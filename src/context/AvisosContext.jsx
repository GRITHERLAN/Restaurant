// Contexto de avisos: sustituye a alert() y confirm().
// - mostrarAviso(tipo, texto): mensaje temporal (toast) en pantalla.
// - confirmar({titulo, texto}): abre un modal propio y devuelve una Promesa<boolean>.
import { createContext, useCallback, useContext, useRef, useState } from "react";

const AvisosContext = createContext(null);

export function AvisosProvider({ children }) {
  const [avisos, setAvisos] = useState([]);
  // dialogo: datos del modal de confirmación abierto (o null)
  const [dialogo, setDialogo] = useState(null);
  const siguienteId = useRef(1);

  // Muestra un aviso que desaparece solo a los 4 segundos
  const mostrarAviso = useCallback((tipo, texto) => {
    const id = siguienteId.current++;
    setAvisos((actuales) => [...actuales, { id, tipo, texto }]);
    setTimeout(() => {
      setAvisos((actuales) => actuales.filter((a) => a.id !== id));
    }, 4000);
  }, []);

  // Abre el modal y resuelve la promesa con true (aceptar) o false (cancelar)
  const confirmar = useCallback(({ titulo, texto, textoBoton = "Confirmar" }) => {
    return new Promise((resolver) => {
      setDialogo({ titulo, texto, textoBoton, resolver });
    });
  }, []);

  function cerrarDialogo(respuesta) {
    dialogo.resolver(respuesta);
    setDialogo(null);
  }

  return (
    <AvisosContext.Provider value={{ mostrarAviso, confirmar }}>
      {children}

      {/* Zona de avisos temporales (aria-live para lectores de pantalla) */}
      <div className="avisos" role="status" aria-live="polite">
        {avisos.map((aviso) => (
          <p key={aviso.id} className={`aviso aviso--${aviso.tipo}`}>
            {aviso.texto}
          </p>
        ))}
      </div>

      {/* Modal de confirmación con el estilo de la web */}
      {dialogo && (
        <div className="modal-fondo" onClick={() => cerrarDialogo(false)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-titulo"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="modal-titulo">{dialogo.titulo}</h2>
            <p>{dialogo.texto}</p>
            <div className="modal__acciones">
              <button className="boton boton--secundario" onClick={() => cerrarDialogo(false)}>
                Volver
              </button>
              <button className="boton boton--peligro" onClick={() => cerrarDialogo(true)}>
                {dialogo.textoBoton}
              </button>
            </div>
          </section>
        </div>
      )}
    </AvisosContext.Provider>
  );
}

export function useAvisos() {
  return useContext(AvisosContext);
}
