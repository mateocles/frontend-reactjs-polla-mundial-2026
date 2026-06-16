import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell, Users, Copy, BarChart3, UserPlus, KeyRound, PlusCircle } from "lucide-react";
import Avatar from "../components/atoms/Avatar";
import Loader from "../components/atoms/Loader";
import ErrorState from "../components/atoms/ErrorState";
import { useGroupsStore } from "../store/useGroupsStore";
import { useAuthStore } from "../store/useAuthStore";
import { dialog } from "../store/useDialog";

function GroupCard({ group, onOpen }) {
  const { t } = useTranslation();
  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(group.inviteCode);
    dialog.alert(t("groups.codeCopied", { code: group.inviteCode }), {
      title: t("groups.copied"),
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
            <span className="text-sm">{t("groups.participants", { count: group.memberCount ?? 0 })}</span>
          </div>
        </div>
        {group.myRank && (
          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase text-primary">
            {t("groups.rank", { rank: group.myRank })}
          </span>
        )}
      </div>
      <div className="bg-surface-container-low rounded-lg p-4 mt-4 flex justify-between items-center border border-white/5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{t("groups.inviteCode")}</p>
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
        <BarChart3 size={18} /> {t("groups.viewRanking")}
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
  const { t } = useTranslation();
  const { groups, publicGroups, loading, error, fetchGroups, fetchPublicGroups, createGroup, joinGroup, joinPublicGroup } =
    useGroupsStore();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [tab, setTab] = useState("groups");
  const [activeForm, setActiveForm] = useState(null);
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [code, setCode] = useState("");

  const load = () => {
    fetchGroups().catch(() => {});
    fetchPublicGroups().catch(() => {});
  };

  useEffect(() => {
    load();
  }, [fetchGroups, fetchPublicGroups]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      await createGroup(name.trim(), isPublic);
      setName("");
      setIsPublic(false);
      setActiveForm(null);
      setTab("groups");
    } catch (e) {
      dialog.alert(e?.response?.data?.error || t("groups.createFailed"), { title: t("common.error"), tone: "danger" });
    }
  };

  const handleJoinPublic = async (g) => {
    try {
      await joinPublicGroup(g.id);
      setTab("groups");
    } catch (e) {
      dialog.alert(e?.response?.data?.error || t("groups.joinFailed"), { title: t("common.error"), tone: "danger" });
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
      dialog.alert(e?.response?.data?.error || t("groups.invalidCode"), { title: t("common.error"), tone: "danger" });
    }
  };

  const showSkeleton = loading && groups.length === 0;
  const showError = error && groups.length === 0;

  return (
    <div>
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} uri={user?.avatarUrl} size={32} />
          <h1 className="text-xl font-bold text-primary">{t("common.appName")}</h1>
        </div>
        <Bell size={22} className="text-primary" />
      </header>

      <div className="px-4">
        <div className="flex border-b border-outline-variant">
          {[["groups", t("groups.tabMine")], ["actions", t("groups.tabActions")]].map(([k, label]) => (
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
            showError ? (
              <ErrorState onRetry={load} />
            ) : showSkeleton ? (
              <Loader count={3} />
            ) : groups.length === 0 ? (
              <p className="text-center text-on-surface-variant mt-10">{t("groups.noGroups")}</p>
            ) : (
              groups.map((g) => <GroupCard key={g.id} group={g} onOpen={() => navigate(`/groups/${g.id}`)} />)
            )
          ) : (
            <div>
              <div className="flex flex-col items-center py-4 mb-2">
                <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <PlusCircle size={36} className="text-primary" />
                </div>
                <h2 className="text-2xl font-extrabold mb-2">{t("groups.manage")}</h2>
                <p className="text-sm text-on-surface-variant text-center px-8">
                  {t("groups.manageSubtitle")}
                </p>
              </div>

              <ActionRow icon={UserPlus} title={t("groups.create")} subtitle={t("groups.createSubtitle")} tone="primary" onClick={() => setActiveForm(activeForm === "create" ? null : "create")} />
              {activeForm === "create" && (
                <div className="glass-card rounded-xl p-4 mb-4">
                  <div className="flex gap-2">
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("groups.groupNamePlaceholder")} className="flex-1 h-11 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant outline-none focus:border-primary" />
                    <button onClick={handleCreate} className="px-4 rounded-lg bg-primary text-on-primary font-bold">{t("groups.createBtn")}</button>
                  </div>
                  <label className="flex items-center gap-2 mt-3 text-sm text-on-surface-variant cursor-pointer">
                    <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="accent-[#00f2ff] w-4 h-4" />
                    {t("groups.publicCheckbox")}
                  </label>
                </div>
              )}

              <ActionRow icon={KeyRound} title={t("groups.joinByCode")} subtitle={t("groups.joinByCodeSubtitle")} tone="secondary" onClick={() => setActiveForm(activeForm === "join" ? null : "join")} />
              {activeForm === "join" && (
                <div className="glass-card rounded-xl p-4 mb-4 flex gap-2">
                  <input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("groups.codePlaceholder")} className="flex-1 h-11 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant outline-none focus:border-primary" />
                  <button onClick={handleJoin} className="px-4 rounded-lg border border-primary text-primary font-bold">{t("groups.joinBtn")}</button>
                </div>
              )}

              {/* Explorar grupos públicos */}
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mt-6 mb-3">
                {t("groups.publicGroups")}
              </h3>
              {publicGroups.length === 0 ? (
                <p className="text-sm text-on-surface-variant">{t("groups.noPublicGroups")}</p>
              ) : (
                publicGroups.map((g) => (
                  <div key={g.id} className="glass-card rounded-xl p-4 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={g.name} uri={g.imageUrl} size={40} />
                      <div className="min-w-0">
                        <p className="font-bold truncate">{g.name}</p>
                        <p className="text-xs text-on-surface-variant">{t("groups.participants", { count: g.memberCount })}</p>
                      </div>
                    </div>
                    <button onClick={() => handleJoinPublic(g)} className="px-4 h-9 rounded-lg bg-primary text-on-primary font-bold text-sm shrink-0">
                      {t("groups.joinBtn")}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
