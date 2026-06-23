import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";

// Contenedor estilo móvil centrado, con barra inferior fija.
export default function AppLayout() {
  const { pathname } = useLocation();

  // Al cambiar de ruta, vuelve arriba: si no, el scroll de la pantalla
  // anterior se conserva y la nueva (p. ej. el ranking) aparece desplazada.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md relative pb-24">
        <Outlet />
        <BottomNav />
      </div>
    </div>
  );
}
