import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";

// Shell tipo app móvil: altura fija al viewport dinámico (100dvh, así no deja
// hueco con la barra de direcciones de Chrome móvil), contenido con scroll
// interno y barra inferior en flujo (no fixed, que dejaba un viewport vacío).
export default function AppLayout() {
  const { pathname } = useLocation();
  const scrollRef = useRef(null);

  // Al cambiar de ruta, vuelve arriba (si no, se hereda el scroll anterior).
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="h-[100dvh] bg-background flex justify-center overflow-hidden">
      <div className="w-full max-w-md flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
