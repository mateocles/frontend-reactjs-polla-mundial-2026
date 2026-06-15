import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { dialog } from "../store/useDialog";

function Field({ icon: Icon, secure, value, onChange, ...props }) {
  const [hidden, setHidden] = useState(secure);
  return (
    <div className="flex items-center gap-3 h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(0,242,255,0.15)] transition">
      <Icon size={18} className="text-on-surface-variant" />
      <input
        className="flex-1 bg-transparent outline-none text-on-surface placeholder:text-outline-variant"
        type={secure && hidden ? "password" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      {secure && (
        <button type="button" onClick={() => setHidden((h) => !h)} className="text-on-surface-variant">
          {hidden ? <EyeOff size={18} /> : <Eye size={18} className="text-primary" />}
        </button>
      )}
    </div>
  );
}

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Ingresa tu correo y contraseña.");
    setLoading(true);
    setError("");
    try {
      await login(email.trim(), password);
      navigate("/matches");
    } catch (err) {
      setError(err?.response?.data?.error || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-4xl shadow-[0_0_25px_rgba(0,242,255,0.3)]">
          ⚽
        </div>
        <h1 className="text-3xl font-extrabold text-primary mt-4 tracking-tight">Polla Mundialista</h1>
        <p className="text-on-surface-variant mt-1">¡Bienvenido de nuevo!</p>
      </div>

      <form onSubmit={submit} className="w-full glass-card rounded-xl p-6">
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email</label>
        <div className="mt-1.5">
          <Field icon={Mail} value={email} onChange={setEmail} placeholder="nombre@ejemplo.com" />
        </div>

        <div className="flex justify-between items-center mt-4 mb-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Contraseña</label>
        </div>
        <Field icon={Lock} secure value={password} onChange={setPassword} placeholder="••••••••" />

        {error && <p className="text-error text-sm mt-3">{error}</p>}

        <button
          disabled={loading}
          className="w-full h-12 mt-5 rounded-xl bg-primary text-on-primary font-bold shadow-[0_0_20px_rgba(0,242,255,0.3)] disabled:opacity-50 active:scale-[0.99] transition"
        >
          {loading ? "Entrando..." : "Iniciar Sesión"}
        </button>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-outline-variant" />
          <span className="px-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">o continuar con</span>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>

        <button
          type="button"
          onClick={() => dialog.alert("El inicio con Google estará disponible pronto.", { title: "Próximamente" })}
          className="w-full h-12 rounded-xl bg-surface-container-highest border border-outline-variant text-on-surface font-semibold flex items-center justify-center gap-3"
        >
          <span className="font-bold">G</span> Google
        </button>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-primary font-bold">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
