import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, Camera, BarChart3, ListChecks, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import Avatar from "../components/atoms/Avatar";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchesStore } from "../store/useMatchesStore";
import { compressFileToBase64 } from "../utils/image";

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

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const { matches, fetchMatches } = useMatchesStore();
  const navigate = useNavigate();
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);

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
      alert(err?.response?.data?.error || "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const doLogout = () => {
    if (confirm("¿Cerrar sesión?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div>
      <header className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-primary">Polla Mundialista</h1>
        <div className="flex items-center gap-4">
          <Bell size={22} />
          <Settings size={22} />
        </div>
      </header>

      <div className="px-4">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} />
        <div className="flex flex-col items-center mt-2 mb-6">
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="relative rounded-full p-1" style={{ border: "2px solid #00f2ff", opacity: uploading ? 0.6 : 1 }}>
            <Avatar name={user?.name} uri={user?.avatarUrl} size={88} />
            <span className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full p-1.5"><Camera size={16} /></span>
          </button>
          <h2 className="text-xl font-bold mt-3">{user?.name || "Usuario"}</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">{user?.email}</p>
        </div>

        <Stat label="Total Points" value={stats.totalPoints.toLocaleString()} highlight icon={BarChart3} />
        <div className="flex gap-3 my-3">
          <Stat label="Global Rank" value="—" />
          <Stat label="Correct Scores" value={String(stats.correctScores)} />
        </div>

        <div className="mt-3">
          <MenuRow icon={ListChecks} label="My Predictions" onClick={() => navigate("/matches")} />
          <MenuRow icon={Settings} label="Account Settings" onClick={() => alert("Próximamente")} />
          <MenuRow icon={HelpCircle} label="Help & Support" onClick={() => alert("Próximamente")} />
        </div>

        <button onClick={doLogout} className="w-full mt-4 h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-white" style={{ background: "#c62035" }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
