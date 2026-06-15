import { useEffect } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useDialog } from "../store/useDialog";

const TONES = {
  default: { icon: Info, color: "text-primary", btn: "bg-primary text-on-primary" },
  danger: { icon: AlertTriangle, color: "text-error", btn: "bg-error text-on-error" },
  success: { icon: CheckCircle2, color: "text-primary", btn: "bg-primary text-on-primary" },
};

// Host global de diálogos. Montar una sola vez en la raíz.
export default function DialogHost() {
  const state = useDialog((s) => s.state);
  const close = useDialog((s) => s.close);

  useEffect(() => {
    if (!state) return;
    const onKey = (e) => {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") close(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, close]);

  if (!state) return null;

  const tone = TONES[state.tone] || TONES.default;
  const Icon = tone.icon;
  const isConfirm = state.type === "confirm";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{ background: "rgba(6,13,32,0.7)", backdropFilter: "blur(4px)" }}
      onClick={() => close(false)}
    >
      <div
        className="glass-card rounded-2xl p-6 w-full max-w-sm text-center animate-[pop_.18s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-4">
          <Icon className={tone.color} size={28} />
        </div>
        {state.title && <h3 className="text-lg font-bold mb-1">{state.title}</h3>}
        <p className="text-on-surface-variant text-sm mb-6">{state.message}</p>

        <div className="flex gap-3">
          {isConfirm && (
            <button
              onClick={() => close(false)}
              className="flex-1 h-11 rounded-xl bg-surface-container-highest text-on-surface font-bold active:scale-[0.98]"
            >
              {state.cancelText || "Cancelar"}
            </button>
          )}
          <button
            onClick={() => close(true)}
            className={`flex-1 h-11 rounded-xl font-bold active:scale-[0.98] ${tone.btn}`}
          >
            {state.confirmText || (isConfirm ? "Confirmar" : "Aceptar")}
          </button>
        </div>
      </div>

      <style>{`@keyframes pop{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}
