import { create } from "zustand";
import { AuthService } from "../api/services/authService";
import { STORAGE_KEYS } from "../config/storageKeys";

const persistSession = (token, user) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

const initialUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  token: localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
  user: initialUser(),

  login: async (email, password) => {
    const data = await AuthService.login(email, password);
    persistSession(data.token, data.user);
    set({ token: data.token, user: data.user });
    return data;
  },

  register: async (name, email, password) => {
    await AuthService.register(name, email, password);
    const data = await AuthService.login(email, password);
    persistSession(data.token, data.user);
    set({ token: data.token, user: data.user });
    return data;
  },

  loginWithGoogle: async (idToken) => {
    const data = await AuthService.google(idToken);
    persistSession(data.token, data.user);
    set({ token: data.token, user: data.user });
    return data;
  },

  updateProfile: async (data) => {
    const user = await AuthService.updateProfile(data);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    set({ user });
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    set({ token: null, user: null });
  },
}));
