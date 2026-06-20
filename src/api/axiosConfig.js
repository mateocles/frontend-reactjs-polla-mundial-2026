import axios from "axios";
import { ENV } from "../config/env";
import { STORAGE_KEYS } from "../config/storageKeys";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.REQUEST_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

// Inyecta el token JWT guardado en cada petición.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si el token expira o es inválido (401/403) cierra la sesión: el router
// redirige automáticamente al login al quedar el token en null.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const hadToken = !!useAuthStore.getState().token;
    if (hadToken && (status === 401 || status === 403)) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
