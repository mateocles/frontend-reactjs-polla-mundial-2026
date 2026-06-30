import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthService } from "../api/services/authService";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return setError(t("auth.missingEmail"));
    setLoading(true);
    setError("");
    try {
      await AuthService.forgotPassword(email.trim().toLowerCase());
      setSent(true);
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
          🔑
        </div>
        <h1 className="text-2xl font-extrabold text-primary mt-4 tracking-tight">{t("auth.forgotTitle")}</h1>
        <p className="text-on-surface-variant mt-1 text-center text-sm">{t("auth.forgotSubtitle")}</p>
      </div>

      {sent ? (
        <div className="w-full glass-card rounded-xl p-6 flex flex-col items-center text-center">
          <CheckCircle2 size={48} className="text-primary mb-3" />
          <p className="text-on-surface font-bold">{t("auth.forgotSentTitle")}</p>
          <p className="text-on-surface-variant text-sm mt-1">{t("auth.forgotSentBody")}</p>
          <Link to="/login" className="text-primary font-bold mt-6">{t("auth.backToLogin")}</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="w-full glass-card rounded-xl p-6">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t("auth.email")}</label>
          <div className="mt-1.5 flex items-center gap-3 h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus-within:border-primary transition">
            <Mail size={18} className="text-on-surface-variant" />
            <input
              className="flex-1 bg-transparent outline-none text-on-surface placeholder:text-outline-variant"
              type="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.emailPlaceholder")}
            />
          </div>

          {error && <p className="text-error text-sm mt-3">{error}</p>}

          <button
            disabled={loading}
            className="w-full h-12 mt-5 rounded-xl bg-primary text-on-primary font-bold shadow-[0_0_20px_rgba(0,242,255,0.3)] disabled:opacity-50 active:scale-[0.99] transition"
          >
            {loading ? t("auth.sending") : t("auth.sendResetLink")}
          </button>

          <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-on-surface-variant mt-6">
            <ArrowLeft size={16} /> {t("auth.backToLogin")}
          </Link>
        </form>
      )}
    </div>
  );
}
