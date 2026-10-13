// Definición de todas las rutas de la aplicación.
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RutaProtegida from "./components/RutaProtegida";
import RutaAdmin from "./components/RutaAdmin";
import Inicio from "./pages/Inicio";
import Carta from "./pages/Carta";
import Historia from "./pages/Historia";
import Ubicacion from "./pages/Ubicacion";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Reservas from "./pages/Reservas";
import PanelAdmin from "./pages/admin/PanelAdmin";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Rutas públicas: no requieren login */}
        <Route path="/" element={<Inicio />} />
        <Route path="/carta" element={<Carta />} />
        <Route path="/historia" element={<Historia />} />
        <Route path="/ubicacion" element={<Ubicacion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Reservas: solo usuarios con sesión iniciada */}
        <Route
          path="/reservas"
          element={
            <RutaProtegida>
              <Reservas />
            </RutaProtegida>
          }
        />

        {/* Panel de administración: solo rol Admin */}
        <Route
          path="/admin"
          element={
            <RutaAdmin>
              <PanelAdmin />
            </RutaAdmin>
          }
        />

        {/* Cualquier otra URL vuelve al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
