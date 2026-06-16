import { useTranslation } from "react-i18next";
import { CloudOff, RotateCw } from "lucide-react";

// Estado de error de carga de un servicio: mensaje amigable + botón reintentar.
export default function ErrorState({ onRetry, message }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center text-center mt-12 px-6">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
        <CloudOff size={28} className="text-error" />
      </div>
      <p className="text-on-surface-variant mb-5">{message || t("common.serviceError")}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="h-11 px-5 rounded-xl bg-primary text-on-primary font-bold flex items-center gap-2 active:scale-[0.99]"
        >
          <RotateCw size={18} /> {t("common.retry")}
        </button>
      )}
    </div>
  );
}
