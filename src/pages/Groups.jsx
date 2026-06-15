import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Users, Copy, BarChart3, UserPlus, KeyRound, PlusCircle, ChevronRight } from "lucide-react";
import Avatar from "../components/atoms/Avatar";
import { useGroupsStore } from "../store/useGroupsStore";
import { useAuthStore } from "../store/useAuthStore";
import { dialog } from "../store/useDialog";

function GroupCard({ group, onOpen }) {
  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(group.inviteCode);
    dialog.alert(`Código ${group.inviteCode} copiado al portapapeles.`, {
      title: "Copiado",
      tone: "success",
    });
  };
  return (
    <div className="glass-card rounded-xl p-5 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-bold">{group.name}</h3>
          <div className="flex items-center gap-1.5 text-on-surface-variant mt-1">
            <Users size={16} />
            <span className="text-sm">{group.memberCount ?? 0} participantes</span>
          </div>
        </div>
        {group.myRank && (
          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase text-primary">
            Rank: #{group.myRank}
          </span>
        )}
      </div>
      <div className="bg-surface-container-low rounded-lg p-4 mt-4 flex justify-between items-center border border-white/5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Código de invitación</p>
          <p className="text-primary font-bold tracking-widest mt-1">{group.inviteCode}</p>
        </div>
        <button onClick={copy} className="text-on-surface-variant hover:text-primary">
          <Copy size={20} />
        </button>
      </div>
      <button
        onClick={onOpen}
        className="w-full mt-4 h-11 rounded-xl bg-primary text-on-primary font-bold flex items-center justify-center gap-2 active:scale-[0.99]"
      >
        <BarChart3 size={18} /> Ver Ranking
      </button>
    </div>
  );
}

function ActionRow({ icon: Icon, title, subtitle, tone, onClick }) {
  return (
    <button onClick={onClick} className="w-full glass-card rounded-xl p-5 flex items-center gap-4 text-left mb-4 active:scale-[0.99]">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tone === "secondary" ? "bg-secondary/20 text-secondary" : "bg-primary/20 text-primary"}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="font-bold">{title}</p>
        <p className="text-sm text-on-surface-variant">{subtitle}</p>
      </div>
    </button>
  );
}

export default function Groups() {
  const { groups, fetchGroups, createGroup, joinGroup } = useGroupsStore();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [tab, setTab] = useState("groups");
  const [activeForm, setActiveForm] = useState(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    fetchGroups().catch(() => {});
  }, [fetchGroups]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      await createGroup(name.trim());
      setName("");
      setActiveForm(null);
      setTab("groups");
    } catch (e) {
      dialog.alert(e?.response?.data?.error || "No se pudo crear.", { title: "Error", tone: "danger" });
    }
  };

  const handleJoin = async () => {
    if (!code.trim()) return;
    try {
      await joinGroup(code.trim());
      setCode("");
      setActiveForm(null);
      setTab("groups");
    } catch (e) {
      dialog.alert(e?.response?.data?.error || "Código inválido.", { title: "Error", tone: "danger" });
    }
  };

  return (
    <div>
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} uri={user?.avatarUrl} size={32} />
          <h1 className="text-xl font-bold text-primary">Polla Mundialista</h1>
        </div>
        <Bell size={22} className="text-primary" />
      </header>

      <div className="px-4">
        <div className="flex border-b border-outline-variant">
          {[["groups", "Mis Grupos"], ["actions", "Acciones"]].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-wide ${tab === k ? "text-primary border-b-2 border-primary" : "text-on-surface-variant"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="pt-4">
          {tab === "groups" ? (
            groups.length === 0 ? (
              <p className="text-center text-on-surface-variant mt-10">Aún no perteneces a ningún grupo. Ve a Acciones.</p>
            ) : (
              groups.map((g) => <GroupCard key={g.id} group={g} onOpen={() => navigate(`/groups/${g.id}`)} />)
            )
          ) : (
            <div>
              <div className="flex flex-col items-center py-4 mb-2">
                <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <PlusCircle size={36} className="text-primary" />
                </div>
                <h2 className="text-2xl font-extrabold mb-2">Gestionar Grupos</h2>
                <p className="text-sm text-on-surface-variant text-center px-8">
                  Crea tu propia liga privada o únete a la de tus amigos.
                </p>
              </div>

              <ActionRow icon={UserPlus} title="Crear Grupo" subtitle="Define reglas y premios." tone="primary" onClick={() => setActiveForm(activeForm === "create" ? null : "create")} />
              {activeForm === "create" && (
                <div className="glass-card rounded-xl p-4 mb-4 flex gap-2">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del grupo" className="flex-1 h-11 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant outline-none focus:border-primary" />
                  <button onClick={handleCreate} className="px-4 rounded-lg bg-primary text-on-primary font-bold">Crear</button>
                </div>
              )}

              <ActionRow icon={KeyRound} title="Unirse con Código" subtitle="Ingresa el token de tu liga." tone="secondary" onClick={() => setActiveForm(activeForm === "join" ? null : "join")} />
              {activeForm === "join" && (
                <div className="glass-card rounded-xl p-4 mb-4 flex gap-2">
                  <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código de invitación" className="flex-1 h-11 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant outline-none focus:border-primary" />
                  <button onClick={handleJoin} className="px-4 rounded-lg border border-primary text-primary font-bold">Unirme</button>
                </div>
              )}

              <div className="rounded-2xl h-40 flex items-end mt-4" style={{ background: "linear-gradient(135deg, rgba(0,242,255,0.25), rgba(11,19,38,0.2), rgba(6,13,32,0.95))" }}>
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Próxima Copa</p>
                  <h4 className="text-xl font-bold">¡Vive la emoción grupal!</h4>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
