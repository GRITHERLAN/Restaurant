// Acceso a datos de la carta (categorías y platos) en Supabase.
import { supabase } from "../lib/supabaseClient";

// Lanza un Error con el mensaje de Supabase si la consulta falló
function comprobar({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

export const listarCategorias = async () =>
  comprobar(await supabase.from("categorias").select("*").order("orden"));

export const listarPlatos = async () =>
  comprobar(await supabase.from("platos").select("*").order("nombre"));

export const guardarCategoria = async (categoria) =>
  categoria.id
    ? comprobar(await supabase.from("categorias").update({ nombre: categoria.nombre, orden: categoria.orden }).eq("id", categoria.id))
    : comprobar(await supabase.from("categorias").insert({ nombre: categoria.nombre, orden: categoria.orden }));

export const borrarCategoria = async (id) =>
  comprobar(await supabase.from("categorias").delete().eq("id", id));

export const guardarPlato = async (plato) => {
  // Solo enviamos las columnas editables
  const datos = {
    categoria_id: plato.categoria_id,
    nombre: plato.nombre,
    descripcion: plato.descripcion,
    precio: plato.precio,
    imagen_url: plato.imagen_url || null,
    disponible: plato.disponible,
  };
  return plato.id
    ? comprobar(await supabase.from("platos").update(datos).eq("id", plato.id))
    : comprobar(await supabase.from("platos").insert(datos));
};

export const borrarPlato = async (id) =>
  comprobar(await supabase.from("platos").delete().eq("id", id));
