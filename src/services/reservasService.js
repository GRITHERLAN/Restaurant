// Acceso a datos de reservas. La validación de aforo/solapamiento se hace en la
// base de datos (trigger "validar_reserva"), así que aquí solo mostramos su mensaje.
import { supabase } from "../lib/supabaseClient";

function comprobar({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

// Plazas ocupadas/libres de cada franja en una fecha (formato AAAA-MM-DD)
export const consultarDisponibilidad = async (fecha) =>
  comprobar(await supabase.rpc("disponibilidad", { p_fecha: fecha }));

// Reservas del usuario conectado (RLS filtra solo las suyas)
export const listarMisReservas = async () =>
  comprobar(
    await supabase.from("reservas").select("*").order("fecha").order("franja")
  );

// Todas las reservas con datos del cliente (solo Admin las ve todas)
export const listarTodasLasReservas = async () =>
  comprobar(
    await supabase
      .from("reservas")
      .select("*, profiles(nombre, email)")
      .order("fecha", { ascending: false })
      .order("franja")
  );

export const crearReserva = async ({ userId, fecha, franja, comensales, notas }) =>
  comprobar(
    await supabase
      .from("reservas")
      .insert({ user_id: userId, fecha, franja, comensales, notas: notas || "" })
  );

export const modificarReserva = async (id, { fecha, franja, comensales }) =>
  comprobar(
    await supabase.from("reservas").update({ fecha, franja, comensales }).eq("id", id)
  );

export const cancelarReserva = async (id) =>
  comprobar(await supabase.from("reservas").update({ estado: "cancelada" }).eq("id", id));

// Utilidades de formato compartidas por las páginas
export const quitarSegundos = (hora) => hora.slice(0, 5); // "21:00:00" -> "21:00"

export const formatearFecha = (fecha) =>
  new Date(fecha + "T12:00:00").toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// Fecha de hoy en formato AAAA-MM-DD (hora local, no UTC)
export const hoyISO = () => {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
};
