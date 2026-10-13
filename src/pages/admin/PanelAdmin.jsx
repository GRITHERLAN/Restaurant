// Panel de administración: dos secciones con pestañas (Reservas y Carta).
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminReservas from "./AdminReservas";
import AdminCarta from "./AdminCarta";

export default function PanelAdmin() {
  const { perfil } = useAuth();
  const [seccion, setSeccion] = useState("reservas");

  return (
    <main className="seccion contenedor">
      <h1>Panel de Control y Administración</h1>
      <p className="mensaje mensaje--info">Rol: Administrador · Sesión activa: {perfil?.email}</p>

      <div className="pestanas" role="tablist">
        <button role="tab" aria-selected={seccion === "reservas"} className="pestana" onClick={() => setSeccion("reservas")}>Gestión de Reservas</button>
        <button role="tab" aria-selected={seccion === "carta"} className="pestana" onClick={() => setSeccion("carta")}>Gestión de Carta</button>
      </div>

      {seccion === "reservas" ? <AdminReservas /> : <AdminCarta />}
    </main>
  );
}
