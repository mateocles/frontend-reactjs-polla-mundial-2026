// Configuración central. Los valores vienen de variables de entorno de Vite
// (archivo .env, prefijo VITE_). Hay valores por defecto por si no existen.
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  REQUEST_TIMEOUT: Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 15000,
};
