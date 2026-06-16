import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { STORAGE_KEYS } from "../config/storageKeys";
import es from "./locales/es.json";
import en from "./locales/en.json";

const SUPPORTED = ["es", "en"];

// Idioma inicial: preferencia guardada, sino la del dispositivo, sino español.
function initialLang() {
  const saved = localStorage.getItem(STORAGE_KEYS.LANG);
  if (SUPPORTED.includes(saved)) return saved;
  const nav = (navigator.language || "es").slice(0, 2).toLowerCase();
  return SUPPORTED.includes(nav) ? nav : "es";
}

i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en } },
  lng: initialLang(),
  fallbackLng: "es",
  supportedLngs: SUPPORTED,
  interpolation: { escapeValue: false },
});

export function setLanguage(lng) {
  if (!SUPPORTED.includes(lng)) return;
  localStorage.setItem(STORAGE_KEYS.LANG, lng);
  i18n.changeLanguage(lng);
}

export { SUPPORTED };
export default i18n;
