import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { dialog } from "../store/useDialog";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Botón de Google. Si hay client ID, muestra el botón oficial (ID token).
// Si falta, muestra un botón estilizado que avisa que hay que configurarlo,
// para que la opción siempre sea visible.
export default function GoogleAuthButton() {
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const navigate = useNavigate();

  if (!CLIENT_ID) {
    return (
      <button
        type="button"
        onClick={() =>
          dialog.alert(
            "Configura VITE_GOOGLE_CLIENT_ID en el archivo .env (el mismo GOOGLE_CLIENT_ID del backend) y reinicia el servidor.",
            { title: "Google no configurado" }
          )
        }
        className="w-full h-12 rounded-xl bg-surface-container-highest border border-outline-variant text-on-surface font-semibold flex items-center justify-center gap-3 active:scale-[0.99]"
      >
        <span className="font-bold text-base">G</span> Continuar con Google
      </button>
    );
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        theme="filled_black"
        shape="pill"
        text="continue_with"
        locale="es"
        onSuccess={async (resp) => {
          try {
            await loginWithGoogle(resp.credential);
            navigate("/matches");
          } catch (e) {
            dialog.alert(e?.response?.data?.error || "No se pudo iniciar con Google.", {
              title: "Error",
              tone: "danger",
            });
          }
        }}
        onError={() =>
          dialog.alert("No se pudo iniciar con Google.", { title: "Error", tone: "danger" })
        }
      />
    </div>
  );
}
