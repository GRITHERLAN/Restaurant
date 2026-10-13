// Cliente único de Supabase compartido por toda la aplicación.
// La URL y la clave pública (publishable) vienen del fichero .env.
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const clave = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(url, clave);
