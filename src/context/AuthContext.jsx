// Contexto de autenticación: guarda la sesión de Supabase y el perfil (con su rol).
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // sesion: objeto de sesión de Supabase (o null si no hay login)
  const [sesion, setSesion] = useState(null);
  // perfil: fila de la tabla "profiles" (nombre, email, rol)
  const [perfil, setPerfil] = useState(null);
  // cargando: true mientras se comprueba si ya había una sesión guardada
  const [cargando, setCargando] = useState(true);

  // Descarga el perfil del usuario para conocer su rol
  async function cargarPerfil(usuario) {
    if (!usuario) {
      setPerfil(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", usuario.id)
      .maybeSingle();
    setPerfil(data);
  }

  useEffect(() => {
    // 1) Recuperar la sesión existente al abrir la web
    supabase.auth.getSession().then(async ({ data }) => {
      setSesion(data.session);
      await cargarPerfil(data.session?.user);
      setCargando(false);
    });

    // 2) Escuchar cambios (login, logout, caducidad del token)
    const { data: suscripcion } = supabase.auth.onAuthStateChange(
      (_evento, nuevaSesion) => {
        setSesion(nuevaSesion);
        // setTimeout evita llamar a Supabase dentro del propio callback (puede bloquearse)
        setTimeout(() => cargarPerfil(nuevaSesion?.user), 0);
      }
    );
    return () => suscripcion.subscription.unsubscribe();
  }, []);

  // Funciones que usan las páginas de login/registro
  const iniciarSesion = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const registrar = (nombre, email, password) =>
    supabase.auth.signUp({ email, password, options: { data: { nombre } } });

  const cerrarSesion = () => supabase.auth.signOut();

  const valor = {
    sesion,
    usuario: sesion?.user ?? null,
    perfil,
    esAdmin: perfil?.rol === "Admin",
    cargando,
    iniciarSesion,
    registrar,
    cerrarSesion,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// Hook cómodo para usar el contexto en cualquier componente
export function useAuth() {
  return useContext(AuthContext);
}
