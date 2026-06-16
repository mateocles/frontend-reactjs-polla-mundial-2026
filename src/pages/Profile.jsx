import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell, Camera, BarChart3, ListChecks, HelpCircle, LogOut, ChevronRight, Pencil, Check, X, Monitor, Sun, Moon, Globe } from "lucide-react";
import Avatar from "../components/atoms/Avatar";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchesStore } from "../store/useMatchesStore";
import { useThemeStore } from "../store/useThemeStore";
import { compressFileToBase64 } from "../utils/image";
import { dialog } from "../store/useDialog";
import { setLanguage } from "../i18n";

function MenuRow({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="w-full glass-card rounded-xl px-4 py-4 flex items-center mb-2.5 active:scale-[0.99]">
      <Icon size={20} className="text-primary w-8" />
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight size={20} className="text-on-surface-variant" />
    </button>
  );
}

function Stat({ label, value, highlight, icon: Icon }) {
  return (
    <div className="glass-card rounded-xl p-4 flex items-center justify-between flex-1">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</p>
        <p className={`mt-1 font-extrabold ${highlight ? "text-primary text-3xl" : "text-xl"}`}>{value}</p>
      </div>
      {Icon && <Icon className="text-primary" size={highlight ? 28 : 20} />}
    </div>
  );
}

// Selector de segmentos (tema / idioma).
function Segmented({ value, options, onChange }) {
  return (
    <div className="flex glass-card rounded-xl p-1 mb-2.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold ${
            value === o.value ? "bg-primary text-on-primary" : "text-on-surface-variant"
          }`}
        >
          {o.icon && <o.icon size={15} />} {o.label}
        </button>
      ))}
    </div>
  );
}

export default function Profile() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const { matches, fetchMatches } = useMatchesStore();
  const { mode, setMode } = useThemeStore();
  const navigate = useNavigate();
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    fetchMatches().catch(() => {});
  }, [fetchMatches]);

  const stats = useMemo(() => {
    const preds = matches.map((m) => m.prediction).filter(Boolean);
    return {
      totalPoints: preds.reduce((s, p) => s + (p.points || 0), 0),
      correctScores: preds.filter((p) => p.points === 6).length,
    };
  }, [matches]);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { uri } = await compressFileToBase64(file, { maxWidth: 400, maxBytes: 120 * 1024 });
      await updateProfile({ avatarUrl: uri });
    } catch (err) {
      dialog.alert(err?.response?.data?.error || t("profile.uploadFailed"), {
        title: t("common.error"),
        tone: "danger",
      });
    } finally {
      setUploading(false);
    }
  };

  const saveName = async () => {
    const next = nameInput.trim();
    if (!next) return dialog.alert(t("profile.nameEmpty"), { title: t("common.error"), tone: "danger" });
    setSavingName(true);
    try {
      await updateProfile({ name: next });
      setEditingName(false);
      dialog.alert(t("profile.nameUpdated"), { title: t("common.appName"), tone: "success" });
    } catch (err) {
      dialog.alert(err?.response?.data?.error || t("profile.nameUpdateFailed"), { title: t("common.error"), tone: "danger" });
    } finally {
      setSavingName(false);
    }
  };

  const doLogout = async () => {
    const ok = await dialog.confirm(t("profile.logoutConfirm"), {
      title: t("profile.logoutTitle"),
      confirmText: t("profile.logoutBtn"),
      tone: "danger",
    });
    if (ok) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div>
      <header className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-primary">{t("common.appName")}</h1>
        <Bell size={22} />
      </header>

      <div className="px-4">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} />
        <div className="flex flex-col items-center mt-2 mb-6">
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="relative rounded-full p-1" style={{ border: "2px solid var(--primary)", opacity: uploading ? 0.6 : 1 }}>
            <Avatar name={user?.name} uri={user?.avatarUrl} size={88} />
            <span className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full p-1.5"><Camera size={16} /></span>
          </button>

          {editingName ? (
            <div className="flex items-center gap-2 mt-3">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={t("profile.namePlaceholder")}
                autoFocus
                className="h-10 px-3 rounded-lg bg-surface-container-lowest border border-primary outline-none text-center font-bold"
              />
              <button onClick={saveName} disabled={savingName} className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center"><Check size={18} /></button>
              <button onClick={() => { setEditingName(false); setNameInput(user?.name || ""); }} className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center"><X size={18} /></button>
            </div>
          ) : (
            <button onClick={() => { setNameInput(user?.name || ""); setEditingName(true); }} className="flex items-center gap-2 mt-3 active:scale-[0.99]">
              <h2 className="text-xl font-bold">{user?.name || t("profile.user")}</h2>
              <Pencil size={16} className="text-on-surface-variant" />
            </button>
          )}
          <p className="text-sm text-on-surface-variant mt-0.5">{user?.email}</p>
        </div>

        <Stat label={t("profile.totalPoints")} value={stats.totalPoints.toLocaleString()} highlight icon={BarChart3} />
        <div className="flex gap-3 my-3">
          <Stat label={t("profile.globalRank")} value="—" />
          <Stat label={t("profile.correctScores")} value={String(stats.correctScores)} />
        </div>

        <div className="mt-3">
          <MenuRow icon={ListChecks} label={t("profile.myPredictions")} onClick={() => navigate("/matches")} />
          <MenuRow icon={HelpCircle} label={t("profile.helpSupport")} onClick={() => dialog.alert(t("common.serviceError"), { title: t("common.comingSoon") })} />
        </div>

        {/* Apariencia (tema) */}
        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mt-5 mb-2">{t("profile.appearance")}</p>
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "system", label: t("theme.system"), icon: Monitor },
            { value: "light", label: t("theme.light"), icon: Sun },
            { value: "dark", label: t("theme.dark"), icon: Moon },
          ]}
        />

        {/* Idioma */}
        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mt-4 mb-2">{t("profile.language")}</p>
        <Segmented
          value={i18n.language?.slice(0, 2)}
          onChange={setLanguage}
          options={[
            { value: "es", label: "Español", icon: Globe },
            { value: "en", label: "English", icon: Globe },
          ]}
        />

        <button onClick={doLogout} className="w-full mt-5 h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-white" style={{ background: "#c62035" }}>
          <LogOut size={18} /> {t("profile.logout")}
        </button>
      </div>
    </div>
  );
}
