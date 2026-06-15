import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Copy, Pencil, Crown, Medal, Calendar, X, ImagePlus } from "lucide-react";
import Avatar from "../components/atoms/Avatar";
import TeamBadge from "../components/atoms/TeamBadge";
import { PredictionService } from "../api/services/predictionService";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchesStore } from "../store/useMatchesStore";
import { useGroupsStore } from "../store/useGroupsStore";
import {
  isMatchClosed,
  getTeamName,
  formatMatchShort,
  predictionOutcome,
} from "../utils/match";
import { compressFileToBase64 } from "../utils/image";
import { dialog } from "../store/useDialog";

const OUTCOME_CLASS = { primary: "text-primary", secondary: "text-secondary", muted: "text-on-surface-variant" };
const MEDAL = { 1: { ring: "#facc15", h: 128 }, 2: { ring: "#94a3b8", h: 96 }, 3: { ring: "#b45309", h: 80 } };

function PodiumPlace({ place, row }) {
  if (!row) return <div className="flex-1" />;
  const c = MEDAL[place];
  return (
    <div className="flex-1 flex flex-col items-center" style={{ maxWidth: place === 1 ? 120 : 100 }}>
      {place === 1 ? <Crown size={26} color="#facc15" fill="#facc15" /> : <Medal size={18} color={c.ring} />}
      <div className="rounded-full mt-1" style={{ border: `${place === 1 ? 3 : 2}px solid ${c.ring}` }}>
        <Avatar name={row.name} size={place === 1 ? 72 : 56} />
      </div>
      <span className={`text-xs font-bold text-center mt-1 ${place === 1 ? "text-primary" : ""}`}>{row.name}</span>
      <span className="text-xs font-bold text-primary">{row.totalPoints} pts</span>
      <div className={`w-full rounded-t-lg mt-2 flex items-end justify-center pb-2 ${place === 1 ? "bg-primary/20" : "bg-surface-container-high"}`} style={{ height: c.h }}>
        <span className={`font-bold text-lg ${place === 1 ? "text-primary" : "text-on-surface-variant"}`}>#{place}</span>
      </div>
    </div>
  );
}

function PredCard({ match, onSubmit }) {
  const finished = match.status === "finished";
  const closed = isMatchClosed(match);
  const [h, setH] = useState(match.prediction ? String(match.prediction.homeScore) : "");
  const [a, setA] = useState(match.prediction ? String(match.prediction.awayScore) : "");
  const [saving, setSaving] = useState(false);
  const home = getTeamName(match.homeTeamId, match.homeTeamNameEn);
  const away = getTeamName(match.awayTeamId, match.awayTeamNameEn);
  const outcome = finished ? predictionOutcome(match.prediction) : null;

  const save = async () => {
    if (h === "" || a === "") return dialog.alert("Ingresa ambos marcadores.", { title: "Faltan datos" });
    setSaving(true);
    try {
      await onSubmit(match.id, parseInt(h, 10), parseInt(a, 10));
      dialog.alert("Tu pronóstico fue registrado.", { title: "¡Predicción guardada!", tone: "success" });
    } catch (e) {
      dialog.alert(e?.response?.data?.error || "No se pudo guardar.", { title: "Error", tone: "danger" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 mb-3">
      <div className="flex justify-between items-center mb-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
        <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatMatchShort(match.matchDate)}</span>
        {finished && match.prediction ? <span className="text-primary">+{match.prediction.points} pts</span> : finished ? <span>Final</span> : closed ? <span>Cerrado</span> : null}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <TeamBadge name={home} size={40} />
          <span className="text-[11px] font-bold text-center">{home}</span>
        </div>
        <div className="px-2">
          {finished ? (
            <div className="flex items-center gap-2 text-3xl font-extrabold">
              <span>{match.homeScore}</span><span className="text-on-surface-variant text-lg">-</span><span>{match.awayScore}</span>
            </div>
          ) : closed ? (
            <span className="font-bold text-on-surface-variant">VS</span>
          ) : (
            <div className="flex items-center gap-1">
              <input value={h} onChange={(e) => setH(e.target.value)} inputMode="numeric" maxLength={2} className="w-12 h-12 text-center font-extrabold text-primary bg-surface-container-high border border-primary/30 rounded-lg outline-none" />
              <span className="text-on-surface-variant text-xs">vs</span>
              <input value={a} onChange={(e) => setA(e.target.value)} inputMode="numeric" maxLength={2} className="w-12 h-12 text-center font-extrabold text-primary bg-surface-container-high border border-primary/30 rounded-lg outline-none" />
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <TeamBadge name={away} size={40} />
          <span className="text-[11px] font-bold text-center">{away}</span>
        </div>
      </div>
      {finished ? (
        match.prediction && (
          <div className="mt-3 pt-2 border-t border-white/5 flex justify-between text-sm">
            <span className="italic text-on-surface-variant">Tu predicción: {match.prediction.homeScore} - {match.prediction.awayScore}</span>
            {outcome && <span className={`text-xs font-bold uppercase ${OUTCOME_CLASS[outcome.tone]}`}>+{match.prediction.points} pts · {outcome.label}</span>}
          </div>
        )
      ) : closed ? (
        <div className="mt-3 pt-2 border-t border-white/5 flex justify-between text-sm">
          <span className="italic text-on-surface-variant">{match.prediction ? `Tu predicción: ${match.prediction.homeScore} - ${match.prediction.awayScore}` : "Sin predicción"}</span>
          <span className="text-xs font-bold uppercase text-on-surface-variant">Pronósticos cerrados</span>
        </div>
      ) : (
        <button onClick={save} disabled={saving} className="w-full mt-3 h-10 rounded-lg bg-primary/10 border border-primary/30 text-primary font-bold text-sm">
          {saving ? "Guardando..." : "Guardar Pronóstico"}
        </button>
      )}
    </div>
  );
}

function EditModal({ group, onClose, onSave }) {
  const [name, setName] = useState(group.name || "");
  const [image, setImage] = useState(group.imageUrl || null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { uri } = await compressFileToBase64(file, { maxWidth: 1000, maxBytes: 250 * 1024 });
    setImage(uri);
  };
  const save = async () => {
    if (!name.trim()) return dialog.alert("El nombre no puede estar vacío.", { title: "Nombre" });
    setSaving(true);
    try {
      await onSave({ name: name.trim(), imageUrl: image });
      onClose();
    } catch (e) {
      dialog.alert(e?.response?.data?.error || "No se pudo guardar.", { title: "Error", tone: "danger" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70" onClick={onClose}>
      <div className="w-full max-w-md glass-card rounded-t-2xl p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold">Editar grupo</h3>
          <button onClick={onClose}><X className="text-on-surface-variant" /></button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} />
        <button onClick={() => fileRef.current?.click()} className="w-full h-36 rounded-xl overflow-hidden mb-4 bg-surface-container-high border border-white/5 flex items-center justify-center">
          {image ? <img src={image} alt="" className="w-full h-full object-cover" /> : (
            <span className="flex flex-col items-center text-on-surface-variant"><ImagePlus className="text-primary mb-2" /> Agregar imagen</span>
          )}
        </button>
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">Nombre del grupo</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant outline-none focus:border-primary" />
        <button onClick={save} disabled={saving} className="w-full h-12 mt-5 rounded-xl bg-primary text-on-primary font-bold">
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

export default function GroupDetail() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const { matches, fetchMatches, submitPrediction } = useMatchesStore();
  const { groups, fetchGroups, updateGroup } = useGroupsStore();

  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState("ranking");
  const [predFilter, setPredFilter] = useState("upcoming");
  const [editing, setEditing] = useState(false);

  const group = useMemo(() => groups.find((g) => g.id === groupId) || { id: groupId, name: "Grupo" }, [groups, groupId]);
  const isAdmin = currentUser?.id === group.ownerId;

  useEffect(() => {
    if (!groups.length) fetchGroups().catch(() => {});
    fetchMatches().catch(() => {});
    PredictionService.getLeaderboard(groupId).then(setRows).catch(() => {});
  }, [groupId]);

  const ownerName = rows.find((r) => r.userId === group.ownerId)?.name;
  const top3 = rows.slice(0, 3);
  const meIdx = rows.findIndex((r) => r.userId === currentUser?.id);
  const rest = rows.slice(3).map((r, i) => ({ ...r, rank: i + 4 }));
  const rankList = meIdx > 2 ? [{ ...rows[meIdx], rank: meIdx + 1 }, ...rest.filter((r) => r.userId !== currentUser?.id)] : rest;

  const predList = predFilter === "upcoming"
    ? matches.filter((m) => !isMatchClosed(m))
    : matches.filter((m) => isMatchClosed(m)).sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate));

  const copy = () => {
    navigator.clipboard?.writeText(group.inviteCode);
    dialog.alert(`Código ${group.inviteCode} copiado al portapapeles.`, { title: "Copiado", tone: "success" });
  };
  const onSave = async (data) => { await updateGroup(group.id, data); };

  return (
    <div>
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button onClick={() => navigate(-1)} className="text-primary"><ArrowLeft size={22} /></button>
          <h1 className="text-xl font-bold text-primary truncate">{group.name}</h1>
        </div>
        <Bell size={22} className="text-primary" />
      </header>

      <div className="px-4">
        {/* Banner */}
        <div className="relative h-44 rounded-xl overflow-hidden mt-2 mb-5 flex items-end">
          {group.imageUrl ? (
            <img src={group.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,242,255,0.25), rgba(11,19,38,0.3), rgba(6,13,32,0.95))" }} />
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,19,38,0.85), transparent)" }} />
          <div className="relative p-4 flex items-end justify-between w-full">
            <h2 className="text-2xl font-extrabold">{group.name}</h2>
            {isAdmin && (
              <button onClick={() => setEditing(true)} className="w-10 h-10 rounded-full bg-surface/80 border border-white/10 flex items-center justify-center text-primary">
                <Pencil size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Invite code */}
        {group.inviteCode && (
          <div className="glass-card rounded-xl p-4 mb-6 flex justify-between items-center" style={{ borderColor: "rgba(0,242,255,0.2)" }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Invite Code</p>
              <p className="text-xl font-bold text-primary tracking-widest mt-0.5">{group.inviteCode}</p>
            </div>
            <button onClick={copy} className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Copy size={22} /></button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {[["ranking", "Ranking"], ["predictions", "Mis Pronósticos"]].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex-1 py-3 font-bold ${tab === k ? "text-primary border-b-2 border-primary" : "text-on-surface-variant"}`}>{label}</button>
          ))}
        </div>

        {tab === "ranking" ? (
          <div className="mt-6">
            <h2 className="text-2xl font-extrabold mb-2">Ranking de Jugadores</h2>
            {ownerName && <p className="text-sm text-on-surface-variant mb-2">Creado por <span className="text-secondary font-bold">{ownerName}</span></p>}
            {rows.length > 0 && (
              <div className="flex items-end justify-center gap-2 pt-4">
                <PodiumPlace place={2} row={top3[1]} />
                <PodiumPlace place={1} row={top3[0]} />
                <PodiumPlace place={3} row={top3[2]} />
              </div>
            )}
            <div className="mt-6">
              {rankList.length === 0 ? (
                <p className="text-center text-on-surface-variant mt-6">Aún no hay más posiciones.</p>
              ) : rankList.map((r) => {
                const me = r.userId === currentUser?.id;
                const admin = r.userId === group.ownerId;
                return (
                  <div key={r.userId} className={`flex items-center p-4 rounded-xl mb-2 ${me ? "bg-primary/10 border border-primary/30" : "glass-card"}`}>
                    <span className={`w-6 text-center font-bold ${me ? "text-primary" : "text-on-surface-variant"}`}>{r.rank}</span>
                    <div className="mx-3"><Avatar name={r.name} size={40} /></div>
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <span className={`truncate ${me ? "text-primary font-bold" : ""}`}>{r.name}{me ? " (Tú)" : ""}</span>
                      {admin && <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[10px] font-bold uppercase">Admin</span>}
                    </div>
                    <span className={`font-bold ${me ? "text-primary" : ""}`}>{r.totalPoints} pts</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <h2 className="text-2xl font-extrabold">Mis Pronósticos</h2>
            <div className="flex gap-3 mt-4 mb-2">
              {[["upcoming", "Próximos"], ["finished", "Finalizados"]].map(([k, label]) => (
                <button key={k} onClick={() => setPredFilter(k)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${predFilter === k ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"}`}>{label}</button>
              ))}
            </div>
            {predList.length === 0 ? (
              <p className="text-center text-on-surface-variant mt-6">No hay partidos.</p>
            ) : predList.map((m) => <PredCard key={m.id} match={m} onSubmit={submitPrediction} />)}
          </div>
        )}
      </div>

      {editing && <EditModal group={group} onClose={() => setEditing(false)} onSave={onSave} />}
    </div>
  );
}
