import axios from "axios";
import { ENV } from "../config/env";
import { STORAGE_KEYS } from "../config/storageKeys";

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

export default api;
