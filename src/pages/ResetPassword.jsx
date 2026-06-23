import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { AuthService } from "../api/services/authService";

function PasswordField({ value, onChange, placeholder }) {
  const [hidden, setHidden] = useState(true);
  return (
    <div className="flex items-center gap-3 h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus-within:border-primary transition">
      <Lock size={18} className="text-on-surface-variant" />
      <input
        className="flex-1 bg-transparent outline-none text-on-surface placeholder:text-outline-variant"
        type={hidden ? "password" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button type="button" onClick={() => setHidden((h) => !h)} className="text-on-surface-variant">
        {hidden ? <EyeOff size={18} /> : <Eye size={18} className="text-primary" />}
      </button>
    </div>
  );
}

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!token) return setError(t("auth.resetNoToken"));
    if (password.length < 6) return setError(t("auth.passwordTooShort"));
    if (password !== confirm) return setError(t("auth.passwordsDontMatch"));
    setLoading(true);
    try {
      await AuthService.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err?.response?.data?.error || t("auth.genericError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-4xl shadow-[0_0_25px_rgba(0,242,255,0.3)]">
          🔒
        </div>
        <h1 className="text-2xl font-extrabold text-primary mt-4 tracking-tight">{t("auth.resetTitle")}</h1>
        <p className="text-on-surface-variant mt-1 text-center text-sm">{t("auth.resetSubtitle")}</p>
      </div>

      {done ? (
        <div className="w-full glass-card rounded-xl p-6 flex flex-col items-center text-center">
          <CheckCircle2 size={48} className="text-primary mb-3" />
          <p className="text-on-surface font-bold">{t("auth.resetDoneTitle")}</p>
          <p className="text-on-surface-variant text-sm mt-1">{t("auth.resetDoneBody")}</p>
          <Link to="/login" className="text-primary font-bold mt-6">{t("auth.backToLogin")}</Link>
        </div>
      ) : !token ? (
        <div className="w-full glass-card rounded-xl p-6 text-center">
          <p className="text-error font-bold">{t("auth.resetNoToken")}</p>
          <Link to="/forgot-password" className="text-primary font-bold mt-4 inline-block">{t("auth.forgotTitle")}</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="w-full glass-card rounded-xl p-6">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t("auth.newPassword")}</label>
          <div className="mt-1.5">
            <PasswordField value={password} onChange={setPassword} placeholder="••••••••" />
          </div>

          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mt-4 mb-1.5">{t("auth.confirmPassword")}</label>
          <PasswordField value={confirm} onChange={setConfirm} placeholder="••••••••" />

          {error && <p className="text-error text-sm mt-3">{error}</p>}

          <button
            disabled={loading}
            className="w-full h-12 mt-5 rounded-xl bg-primary text-on-primary font-bold shadow-[0_0_20px_rgba(0,242,255,0.3)] disabled:opacity-50 active:scale-[0.99] transition"
          >
            {loading ? t("auth.saving") : t("auth.resetButton")}
          </button>

          <Link to="/login" className="block text-center text-sm text-on-surface-variant mt-6">{t("auth.backToLogin")}</Link>
        </form>
      )}
    </div>
  );
}
