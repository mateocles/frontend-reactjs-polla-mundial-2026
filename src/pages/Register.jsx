import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function Field({ icon: Icon, label, secure, value, onChange, ...props }) {
  const [hidden, setHidden] = useState(secure);
  return (
    <div className="mb-4">
      <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5 px-1">
        {label}
      </label>
      <div className="flex items-center gap-3 h-14 px-4 rounded-xl bg-surface-container border border-outline-variant focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(0,242,255,0.15)] transition">
        <Icon size={20} className="text-outline" />
        <input
          className="flex-1 bg-transparent outline-none text-on-surface placeholder:text-outline-variant"
          type={secure && hidden ? "password" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
        {secure && (
          <button type="button" onClick={() => setHidden((h) => !h)} className="text-on-surface-variant">
            {hidden ? <EyeOff size={20} /> : <Eye size={20} className="text-primary" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Register() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirm } = form;
    if (!name || !email || !password || !confirm) return setError("Completa todos los campos.");
    if (password !== confirm) return setError("Las contraseñas no coinciden.");
    setLoading(true);
    setError("");
    try {
      await register(name.trim(), email.trim(), password);
      navigate("/matches");
    } catch (err) {
      setError(err?.response?.data?.error || "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="flex items-center mb-2">
        <Link to="/login" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-primary">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="flex-1 text-center text-xl font-bold text-primary mr-10">Polla Mundialista</h1>
      </div>

      <h2 className="text-2xl font-extrabold mt-3">Crea tu cuenta</h2>
      <p className="text-sm text-on-surface-variant mt-1 mb-6">
        Únete a la emoción del mundial y compite con tus amigos.
      </p>

      <form onSubmit={submit}>
        <Field icon={User} label="Nombre Completo" value={form.name} onChange={set("name")} placeholder="Ej. Juan Pérez" />
        <Field icon={Mail} label="Correo Electrónico" value={form.email} onChange={set("email")} placeholder="nombre@ejemplo.com" />
        <Field icon={Lock} label="Contraseña" secure value={form.password} onChange={set("password")} placeholder="••••••••" />
        <Field icon={Lock} label="Confirmar Contraseña" secure value={form.confirm} onChange={set("confirm")} placeholder="••••••••" />

        {error && <p className="text-error text-sm mb-3">{error}</p>}

        <button
          disabled={loading}
          className="w-full h-14 mt-2 rounded-xl bg-primary text-on-primary font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.3)] disabled:opacity-50 active:scale-[0.99] transition"
        >
          {loading ? "Creando..." : "Registrarse"} <UserPlus size={18} />
        </button>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-primary font-bold">Inicia Sesión</Link>
        </p>
      </form>
    </div>
  );
}
