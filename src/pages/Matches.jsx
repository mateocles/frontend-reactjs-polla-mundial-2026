import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import Avatar from "../components/atoms/Avatar";
import TeamBadge from "../components/atoms/TeamBadge";
import Loader from "../components/atoms/Loader";
import ErrorState from "../components/atoms/ErrorState";
import { useMatchesStore } from "../store/useMatchesStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  isMatchClosed,
  getTeamName,
  formatMatchShort,
  formatMatchDate,
  predictionOutcome,
  liveMinute,
} from "../utils/match";

const OUTCOME_CLASS = {
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-on-surface-variant",
};

// Texto del minuto en vivo (cliente, sin API externa).
function LiveClock({ matchDate, now }) {
  const { t } = useTranslation();
  const m = liveMinute(matchDate, now);
  return <>{t(m.key, { min: m.min })}</>;
}

function LiveCard({ match, now }) {
  const { t } = useTranslation();
  const home = getTeamName(match.homeTeamId, match.homeTeamNameEn);
  const away = getTeamName(match.awayTeamId, match.awayTeamNameEn);
  return (
    <div className="glass-card rounded-xl p-4 mb-3" style={{ borderLeft: "3px solid var(--tertiary)" }}>
      <div className="flex justify-between items-center mb-3">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: "rgba(255,180,162,0.15)", color: "var(--tertiary)" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--tertiary)" }} /> {t("matches.live")} · <LiveClock matchDate={match.matchDate} now={now} />
        </span>
        {match.prediction && (
          <span className="text-[10px] font-bold uppercase text-on-surface-variant">
            {t("matches.yourPrediction", { home: match.prediction.homeScore, away: match.prediction.awayScore })}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <TeamBadge name={home} size={40} />
          <span className="text-[11px] font-bold text-center">{home}</span>
        </div>
        <div className="flex items-center gap-3 text-3xl font-extrabold px-2">
          <span>{match.homeScore ?? 0}</span><span className="text-on-surface-variant text-lg">-</span><span>{match.awayScore ?? 0}</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <TeamBadge name={away} size={40} />
          <span className="text-[11px] font-bold text-center">{away}</span>
        </div>
      </div>
    </div>
  );
}

function OpenCard({ match }) {
  const { t } = useTranslation();
  const home = getTeamName(match.homeTeamId, match.homeTeamNameEn);
  const away = getTeamName(match.awayTeamId, match.awayTeamNameEn);
  return (
    <div className="glass-card rounded-xl p-4 mb-3">
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          <Calendar size={14} /> {formatMatchShort(match.matchDate)}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase text-primary">
          {t("matches.open")}
        </span>
      </div>
      <div className="flex items-center justify-between py-3">
        <div className="flex-1 flex flex-col items-center gap-2">
          <TeamBadge name={home} size={48} />
          <span className="text-xs font-bold text-center">{home}</span>
        </div>
        <span className="px-2 font-bold text-on-surface-variant">{t("common.vs")}</span>
        <div className="flex-1 flex flex-col items-center gap-2">
          <TeamBadge name={away} size={48} />
          <span className="text-xs font-bold text-center">{away}</span>
        </div>
      </div>
      {match.prediction && (
        <div className="bg-surface-container-lowest rounded-lg px-3 py-2 text-center text-sm text-on-surface-variant">
          {t("matches.yourPrediction", { home: match.prediction.homeScore, away: match.prediction.awayScore })}
        </div>
      )}
    </div>
  );
}

function ClosedCard({ match }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const home = getTeamName(match.homeTeamId, match.homeTeamNameEn);
  const away = getTeamName(match.awayTeamId, match.awayTeamNameEn);
  const outcome = predictionOutcome(match.prediction);
  const homeScorers = match.homeScorers || [];
  const awayScorers = match.awayScorers || [];

  return (
    <div className="rounded-xl p-4 mb-3 border border-white/5" style={{ background: "var(--surface-container-low)" }}>
      <button className="w-full" onClick={() => setOpen((v) => !v)}>
        <div className="flex justify-between items-center mb-4">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            <Calendar size={14} /> {formatMatchShort(match.matchDate)}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface-variant text-[10px] font-bold uppercase text-on-surface-variant">
            {t("matches.finished")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1 flex flex-col items-center gap-1">
            <TeamBadge name={home} size={32} />
            <span className="text-[11px] font-bold text-center">{home}</span>
          </div>
          <div className="flex flex-col items-center px-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold">{match.homeScore}</span>
              <span className="text-on-surface-variant">-</span>
              <span className="text-3xl font-extrabold">{match.awayScore}</span>
            </div>
            {match.prediction && (
              <span className="text-[10px] font-bold text-primary mt-1">+{match.prediction.points} {t("common.points")}</span>
            )}
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <TeamBadge name={away} size={32} />
            <span className="text-[11px] font-bold text-center">{away}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 mt-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          {open ? t("matches.hideDetail") : t("matches.showDetail")} {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {open && (
        <div className="mt-3 pt-3 border-t border-white/5 text-sm">
          {(homeScorers.length > 0 || awayScorers.length > 0) && (
            <div className="mb-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">{t("matches.scorers")}</p>
              <div className="flex">
                <div className="flex-1 pr-2">
                  {homeScorers.length ? homeScorers.map((s, i) => <p key={i} className="text-on-surface-variant">{s}</p>) : <p className="text-on-surface-variant">—</p>}
                </div>
                <div className="flex-1 pl-2 text-right">
                  {awayScorers.length ? awayScorers.map((s, i) => <p key={i} className="text-on-surface-variant">{s}</p>) : <p className="text-on-surface-variant">—</p>}
                </div>
              </div>
              <div className="h-px bg-white/5 my-2" />
            </div>
          )}
          <Row label={t("matches.dateTime")} value={formatMatchDate(match.matchDate)} />
          <Row label={t("matches.predictionLabel")} value={match.prediction ? `${match.prediction.homeScore} - ${match.prediction.awayScore}` : t("matches.noPrediction")} />
          <Row label={t("matches.pointsLabel")} value={match.prediction ? `+${match.prediction.points} ${t("common.points")}` : `0 ${t("common.points")}`} valueClass="text-primary" />
          {outcome && <Row label={t("matches.resultLabel")} value={t(outcome.key)} valueClass={OUTCOME_CLASS[outcome.tone]} />}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, valueClass = "text-on-surface" }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-on-surface-variant text-sm">{label}</span>
      <span className={`text-xs font-bold uppercase tracking-wide ${valueClass}`}>{value}</span>
    </div>
  );
}

export default function Matches() {
  const { t } = useTranslation();
  const { matches, fetchMatches, loading, error } = useMatchesStore();
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState("open");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    fetchMatches().catch(() => {});
  }, [fetchMatches]);

  const { live, open, closed, nextDate } = useMemo(() => {
    const lv = matches.filter((m) => m.status === "live");
    const o = matches.filter((m) => m.status === "notstarted" && !isMatchClosed(m));
    const c = matches.filter((m) => m.status === "finished").sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate));
    return { live: lv, open: o, closed: c, nextDate: o[0]?.matchDate };
  }, [matches]);

  // Auto-refresh cada 30s + tick del reloj de minuto en vivo cada 30s.
  useEffect(() => {
    if (live.length === 0) return;
    const id = setInterval(() => {
      fetchMatches().catch(() => {});
      setNow(Date.now());
    }, 30000);
    return () => clearInterval(id);
  }, [live.length, fetchMatches]);

  const list = tab === "open" ? open : closed;
  const showSkeleton = loading && matches.length === 0;
  const showError = error && matches.length === 0;

  return (
    <div>
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} uri={user?.avatarUrl} size={32} />
          <h1 className="text-xl font-bold text-primary">{t("matches.title")}</h1>
        </div>
        <Bell size={22} className="text-primary" />
      </header>

      <div className="px-4">
        {showError ? (
          <ErrorState onRetry={() => fetchMatches().catch(() => {})} />
        ) : showSkeleton ? (
          <Loader count={4} />
        ) : (
          <>
            <div className="relative h-28 rounded-xl overflow-hidden my-2 flex items-end" style={{ background: "linear-gradient(135deg, rgba(0,242,255,0.12), rgba(11,19,38,0.2), var(--surface))" }}>
              <div className="p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("matches.nextRound")}</p>
                <p className="text-2xl font-extrabold mt-0.5">{nextDate ? formatMatchShort(nextDate) : t("matches.noMatches")}</p>
              </div>
            </div>

            {live.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--tertiary)" }} />
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--tertiary)" }}>{t("matches.liveNow")}</span>
                </div>
                {live.map((m) => <LiveCard key={m.id} match={m} now={now} />)}
              </div>
            )}

            <div className="flex bg-surface-container-lowest rounded-full p-1 my-4">
              {[["open", t("matches.tabUpcoming")], ["closed", t("matches.tabFinished")]].map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${tab === k ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {list.length === 0 ? (
              <p className="text-center text-on-surface-variant mt-10">
                {tab === "open" ? t("matches.noUpcoming") : t("matches.noFinished")}
              </p>
            ) : tab === "open" ? (
              list.map((m) => <OpenCard key={m.id} match={m} />)
            ) : (
              list.map((m) => <ClosedCard key={m.id} match={m} />)
            )}
          </>
        )}
      </div>
    </div>
  );
}
