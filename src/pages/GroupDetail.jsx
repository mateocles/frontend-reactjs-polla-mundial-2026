import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
const MEDAL = {
  1: { ring: "#facc15", h: 132, avatar: 84, badge: "#facc15", rankClass: "text-[#facc15]" },
  2: { ring: "#94a3b8", h: 96, avatar: 56, badge: "#94a3b8", rankClass: "text-on-surface-variant" },
  3: { ring: "#b45309", h: 80, avatar: 56, badge: "#b45309", rankClass: "text-tertiary" },
};

function PodiumPlace({ place, row, onSelect }) {
  if (!row) return <div className="flex-1" />;
  const c = MEDAL[place];
  const first = place === 1;
  return (
    <button
      onClick={() => onSelect?.(row)}
      className="flex-1 flex flex-col items-center active:scale-[0.98]"
      style={{ maxWidth: first ? 130 : 100 }}
    >
      {/* Avatar con anillo y la insignia de puesto superpuesta arriba */}
      <div className="relative" style={{ marginTop: first ? 14 : 6 }}>
        <div
          className="rounded-full"
          style={{
            border: `${first ? 4 : 2}px solid ${c.ring}`,
            boxShadow: first
              ? `0 0 22px 2px ${c.ring}80, 0 0 6px ${c.ring}`
              : "none",
          }}
        >
          <Avatar name={row.name} uri={row.avatarUrl} size={c.avatar} />
        </div>
        {/* Insignia circular con corona (#1) o número (#2/#3) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center"
          style={{
            top: first ? -16 : -10,
            width: first ? 32 : 22,
            height: first ? 32 : 22,
            backgroundColor: c.badge,
            boxShadow: first ? `0 0 12px ${c.ring}` : "none",
            border: "2px solid var(--background)",
          }}
        >
          {first ? (
            <Crown size={18} color="#1a1300" fill="#1a1300" />
          ) : (
            <span className="text-[11px] font-extrabold text-background">{place}</span>
          )}
        </div>
      </div>
      <span className={`text-xs font-bold text-center mt-2 ${first ? "text-secondary" : ""}`}>{row.name}</span>
      <span className="text-xs font-bold text-secondary">{row.totalPoints} pts</span>
      <div
        className={`w-full rounded-t-lg mt-2 flex items-end justify-center pb-2 ${first ? "bg-primary/20 border-x border-t border-[#facc15]/30" : "bg-surface-container-high"}`}
        style={{ height: c.h }}
      >
        <span className={`font-extrabold text-lg ${c.rankClass}`}>#{place}</span>
      </div>
    </button>
  );
}

// Skeleton del detalle de grupo mientras llega la información.
function GroupDetailSkeleton() {
  return (
    <div className="px-4 animate-pulse" aria-hidden="true">
      <div className="h-44 rounded-xl mt-2 mb-5 bg-surface-container-high" />
      <div className="flex border-b border-white/5">
        <div className="flex-1 py-3 flex justify-center"><div className="h-4 w-20 rounded bg-surface-container-high" /></div>
        <div className="flex-1 py-3 flex justify-center"><div className="h-4 w-20 rounded bg-surface-container-high" /></div>
      </div>
      <div className="mt-6">
        <div className="h-6 w-40 rounded bg-surface-container-high mb-4" />
        {/* Podio fantasma */}
        <div className="flex items-end justify-center gap-2 pt-4">
          {[{ a: 56, h: 96 }, { a: 84, h: 132 }, { a: 56, h: 80 }].map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center" style={{ maxWidth: i === 1 ? 130 : 100 }}>
              <div className="rounded-full bg-surface-container-high" style={{ width: s.a, height: s.a }} />
              <div className="h-3 w-14 rounded bg-surface-container-high mt-2" />
              <div className="h-3 w-10 rounded bg-surface-container-high mt-1.5" />
              <div className="w-full rounded-t-lg mt-2 bg-surface-container-high" style={{ height: s.h }} />
            </div>
          ))}
        </div>
        {/* Filas fantasma */}
        <div className="mt-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center p-4 rounded-xl mb-2 bg-surface-container-high">
              <div className="w-6 h-4 rounded bg-surface-container-highest" />
              <div className="mx-3 w-10 h-10 rounded-full bg-surface-container-highest" />
              <div className="flex-1 h-4 rounded bg-surface-container-highest" />
              <div className="w-12 h-4 rounded bg-surface-container-highest ml-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PredCard({ match, onSubmit }) {
  const { t } = useTranslation();
  const finished = match.status === "finished";
  const closed = isMatchClosed(match);
  const [h, setH] = useState(match.prediction ? String(match.prediction.homeScore) : "");
  const [a, setA] = useState(match.prediction ? String(match.prediction.awayScore) : "");
  const [saving, setSaving] = useState(false);
  const home = getTeamName(match.homeTeamId, match.homeTeamNameEn);
  const away = getTeamName(match.awayTeamId, match.awayTeamNameEn);
  const outcome = finished ? predictionOutcome(match.prediction) : null;

  const save = async () => {
    if (h === "" || a === "") return dialog.alert(t("groupDetail.missingScores"), { title: t("groupDetail.missingScoresTitle") });
    setSaving(true);
    try {
      await onSubmit(match.id, parseInt(h, 10), parseInt(a, 10));
      dialog.alert(t("groupDetail.predictionSaved"), { title: t("groupDetail.predictionSavedTitle"), tone: "success" });
    } catch (e) {
      dialog.alert(e?.response?.data?.error || t("groupDetail.saveFailed"), { title: t("common.error"), tone: "danger" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 mb-3">
      <div className="flex justify-between items-center mb-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
        <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatMatchShort(match.matchDate)}</span>
        {finished && match.prediction ? <span className="text-primary">+{match.prediction.points} {t("common.points")}</span> : finished ? <span>{t("groupDetail.final")}</span> : closed ? <span>{t("groupDetail.closed")}</span> : null}
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
            <span className="font-bold text-on-surface-variant">{t("common.vs")}</span>
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
            <span className="italic text-on-surface-variant">{t("matches.yourPrediction", { home: match.prediction.homeScore, away: match.prediction.awayScore })}</span>
            {outcome && <span className={`text-xs font-bold uppercase ${OUTCOME_CLASS[outcome.tone]}`}>+{match.prediction.points} {t("common.points")} · {t(outcome.key)}</span>}
          </div>
        )
      ) : closed ? (
        <div className="mt-3 pt-2 border-t border-white/5 flex justify-between text-sm">
          <span className="italic text-on-surface-variant">{match.prediction ? t("matches.yourPrediction", { home: match.prediction.homeScore, away: match.prediction.awayScore }) : t("matches.noPrediction")}</span>
          <span className="text-xs font-bold uppercase text-on-surface-variant">{t("groupDetail.predictionsClosed")}</span>
        </div>
      ) : (
        <button onClick={save} disabled={saving} className="w-full mt-3 h-10 rounded-lg bg-primary/10 border border-primary/30 text-primary font-bold text-sm">
          {saving ? t("common.saving") : t("groupDetail.savePrediction")}
        </button>
      )}
    </div>
  );
}

function EditModal({ group, onClose, onSave }) {
  const { t } = useTranslation();
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
    if (!name.trim()) return dialog.alert(t("groupDetail.emptyName"), { title: t("groupDetail.nameTitle") });
    setSaving(true);
    try {
      await onSave({ name: name.trim(), imageUrl: image });
      onClose();
    } catch (e) {
      dialog.alert(e?.response?.data?.error || t("groupDetail.saveFailed"), { title: t("common.error"), tone: "danger" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70" onClick={onClose}>
      <div className="w-full max-w-md glass-card rounded-2xl p-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold">{t("groupDetail.editGroup")}</h3>
          <button onClick={onClose}><X className="text-on-surface-variant" /></button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} />
        <button onClick={() => fileRef.current?.click()} className="w-full h-36 rounded-xl overflow-hidden mb-4 bg-surface-container-high border border-white/5 flex items-center justify-center">
          {image ? <img src={image} alt="" className="w-full h-full object-cover" /> : (
            <span className="flex flex-col items-center text-on-surface-variant"><ImagePlus className="text-primary mb-2" /> {t("groupDetail.addImage")}</span>
          )}
        </button>
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">{t("groupDetail.groupName")}</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant outline-none focus:border-primary" />
        <button onClick={save} disabled={saving} className="w-full h-12 mt-5 rounded-xl bg-primary text-on-primary font-bold">
          {saving ? t("common.saving") : t("groupDetail.saveChanges")}
        </button>
      </div>
    </div>
  );
}

export default function GroupDetail() {
  const { t } = useTranslation();
  const { groupId } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const { matches, fetchMatches, submitPrediction } = useMatchesStore();
  const { groups, fetchGroups, updateGroup } = useGroupsStore();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("ranking");
  const [predFilter, setPredFilter] = useState("upcoming");
  const [editing, setEditing] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  const group = useMemo(() => groups.find((g) => g.id === groupId) || { id: groupId, name: t("groupDetail.fallbackName") }, [groups, groupId, t]);
  const isAdmin = currentUser?.id === group.ownerId;

  useEffect(() => {
    if (!groups.length) fetchGroups().catch(() => {});
    fetchMatches().catch(() => {});
    setLoading(true);
    PredictionService.getLeaderboard(groupId)
      .then(setRows)
      .catch(() => {})
      .finally(() => setLoading(false));
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
    dialog.alert(t("groups.codeCopied", { code: group.inviteCode }), { title: t("groups.copied"), tone: "success" });
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

      {loading && rows.length === 0 ? <GroupDetailSkeleton /> : (
      <div className="px-4">
        {/* Banner con código de invitación inmerso */}
        <div className="relative h-44 rounded-xl overflow-hidden mt-2 mb-5">
          {group.imageUrl ? (
            <img src={group.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,242,255,0.25), rgba(11,19,38,0.3), rgba(6,13,32,0.95))" }} />
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,19,38,0.85), transparent)" }} />

          {/* Código de invitación (esquina superior) */}
          {group.inviteCode && (
            <div className="absolute top-3 right-3 glass-card rounded-lg px-3 py-2 flex items-center gap-2">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">{t("groups.inviteCode")}</p>
                <p className="text-sm font-bold text-primary tracking-widest">{group.inviteCode}</p>
              </div>
              <button onClick={copy} className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center"><Copy size={16} /></button>
            </div>
          )}

          {/* Nombre + editar (parte inferior) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
            <h2 className="text-2xl font-extrabold">{group.name}</h2>
            {isAdmin && (
              <button onClick={() => setEditing(true)} className="w-10 h-10 rounded-full bg-surface/80 border border-white/10 flex items-center justify-center text-primary shrink-0">
                <Pencil size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {[["ranking", t("groupDetail.tabRanking")], ["predictions", t("groupDetail.tabPredictions")]].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex-1 py-3 font-bold ${tab === k ? "text-primary border-b-2 border-primary" : "text-on-surface-variant"}`}>{label}</button>
          ))}
        </div>

        {tab === "ranking" ? (
          <div className="mt-6">
            <h2 className="text-2xl font-extrabold mb-2">{t("groupDetail.rankingTitle")}</h2>
            {ownerName && <p className="text-sm text-on-surface-variant mb-2">{t("groupDetail.createdBy")} <span className="text-secondary font-bold">{ownerName}</span></p>}
            {rows.length > 0 && (
              <div className="flex items-end justify-center gap-2 pt-4">
                <PodiumPlace place={2} row={top3[1]} onSelect={setViewUser} />
                <PodiumPlace place={1} row={top3[0]} onSelect={setViewUser} />
                <PodiumPlace place={3} row={top3[2]} onSelect={setViewUser} />
              </div>
            )}
            <div className="mt-6">
              {rankList.length === 0 ? (
                <p className="text-center text-on-surface-variant mt-6">{t("groupDetail.noMorePositions")}</p>
              ) : rankList.map((r) => {
                const me = r.userId === currentUser?.id;
                const admin = r.userId === group.ownerId;
                return (
                  <button
                    key={r.userId}
                    onClick={() => setViewUser(r)}
                    className={`w-full text-left flex items-center p-4 rounded-xl mb-2 active:scale-[0.99] ${me ? "bg-primary/10 border border-primary/30" : "glass-card"}`}
                  >
                    <span className={`w-6 text-center font-bold ${me ? "text-primary" : "text-on-surface-variant"}`}>{r.rank}</span>
                    <div className="mx-3"><Avatar name={r.name} uri={r.avatarUrl} size={40} /></div>
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <span className={`truncate ${me ? "text-primary font-bold" : ""}`}>{r.name}{me ? ` (${t("common.you")})` : ""}</span>
                      {admin && <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[10px] font-bold uppercase">{t("groupDetail.admin")}</span>}
                    </div>
                    <span className={`font-bold ${me ? "text-primary" : ""}`}>{r.totalPoints} pts</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <h2 className="text-2xl font-extrabold">{t("groupDetail.myPredictions")}</h2>
            <div className="flex gap-3 mt-4 mb-2">
              {[["upcoming", t("groupDetail.filterUpcoming")], ["finished", t("groupDetail.filterFinished")]].map(([k, label]) => (
                <button key={k} onClick={() => setPredFilter(k)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${predFilter === k ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"}`}>{label}</button>
              ))}
            </div>
            {predList.length === 0 ? (
              <p className="text-center text-on-surface-variant mt-6">{t("groupDetail.noMatchesFilter")}</p>
            ) : predList.map((m) => <PredCard key={m.id} match={m} onSubmit={submitPrediction} />)}
          </div>
        )}
      </div>
      )}

      {editing && <EditModal group={group} onClose={() => setEditing(false)} onSave={onSave} />}
      {viewUser && (
        <UserPredictionsModal
          user={viewUser}
          groupId={group.id}
          onClose={() => setViewUser(null)}
        />
      )}
    </div>
  );
}

// Modal: pronósticos de otro usuario (solo partidos ya iniciados/finalizados).
function UserPredictionsModal({ user, groupId, onClose }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    PredictionService.getUserPredictions(user.userId, groupId)
      .then(setData)
      .catch((e) => setError(e?.response?.data?.error || t("groupDetail.loadFailed")));
  }, [user.userId, groupId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70" onClick={onClose}>
      <div className="w-full max-w-md glass-card rounded-2xl p-5 max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={user.name} uri={user.avatarUrl} size={40} />
            <div className="min-w-0">
              <p className="font-bold truncate">{user.name}</p>
              <p className="text-xs text-on-surface-variant">{t("groupDetail.predictions")}</p>
            </div>
          </div>
          <button onClick={onClose} className="shrink-0 ml-2"><X className="text-on-surface-variant" /></button>
        </div>

        {error && <p className="text-error text-sm">{error}</p>}
        {!data && !error && <p className="text-on-surface-variant text-sm">{t("common.loading")}</p>}

        {data?.matches?.filter((m) => m.prediction).length === 0 && (
          <p className="text-on-surface-variant text-sm text-center py-6">
            {t("groupDetail.noClosedPredictions")}
          </p>
        )}

        {/* Lista con scroll interno (≈3 pronósticos visibles) */}
        <div className="overflow-y-auto pr-1" style={{ maxHeight: "340px" }}>
        {data?.matches
          ?.filter((m) => m.prediction)
          .sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate))
          .map((m) => {
          const outcome = m.status === "finished" ? predictionOutcome(m.prediction) : null;
          return (
            <div key={m.id} className="glass-card rounded-xl p-3 mb-2">
              <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
                <span>{formatMatchShort(m.matchDate)}</span>
                {m.prediction?.points != null && m.status === "finished" && (
                  <span className="text-primary font-bold">+{m.prediction.points} {t("common.points")}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="flex-1 text-sm font-bold truncate">{getTeamName(m.homeTeamId, m.homeTeamNameEn)}</span>
                <span className="px-3 font-bold">{m.prediction.homeScore} - {m.prediction.awayScore}</span>
                <span className="flex-1 text-sm font-bold truncate text-right">{getTeamName(m.awayTeamId, m.awayTeamNameEn)}</span>
              </div>
              {m.status === "finished" && (
                <div className="flex items-center justify-between text-[11px] mt-2 text-on-surface-variant">
                  <span>{t("groupDetail.real", { home: m.homeScore, away: m.awayScore })}</span>
                  {outcome && <span className="font-bold uppercase">{t(outcome.key)}</span>}
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
