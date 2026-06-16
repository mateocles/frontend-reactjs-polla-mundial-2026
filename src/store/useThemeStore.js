import { create } from "zustand";
import { STORAGE_KEYS } from "../config/storageKeys";

// Modos disponibles: "system" sigue la preferencia del dispositivo;
// "light"/"dark" la fuerzan manualmente.
const VALID = ["system", "light", "dark"];

const media = () =>
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

function systemIsDark() {
  const m = media();
  return m ? m.matches : true; // por defecto oscuro
}

// Resuelve el modo a la clase concreta y la aplica al <html>.
function applyTheme(mode) {
  const resolved = mode === "system" ? (systemIsDark() ? "dark" : "light") : mode;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  return resolved;
}

function initialMode() {
  const saved = localStorage.getItem(STORAGE_KEYS.THEME);
  return VALID.includes(saved) ? saved : "system";
}

export const useThemeStore = create((set, get) => ({
  mode: initialMode(),
  resolved: "dark",

  setMode: (mode) => {
    if (!VALID.includes(mode)) return;
    localStorage.setItem(STORAGE_KEYS.THEME, mode);
    const resolved = applyTheme(mode);
    set({ mode, resolved });
  },

  // Llamar una vez al arrancar la app: aplica el tema y escucha cambios del SO.
  init: () => {
    const resolved = applyTheme(get().mode);
    set({ resolved });
    const m = media();
    if (m) {
      const onChange = () => {
        if (get().mode === "system") set({ resolved: applyTheme("system") });
      };
      m.addEventListener ? m.addEventListener("change", onChange) : m.addListener(onChange);
    }
  },
}));
