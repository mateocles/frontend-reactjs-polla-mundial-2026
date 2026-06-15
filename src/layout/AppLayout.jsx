import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

// Contenedor estilo móvil centrado, con barra inferior fija.
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md relative pb-24">
        <Outlet />
        <BottomNav />
      </div>
    </div>
  );
}
