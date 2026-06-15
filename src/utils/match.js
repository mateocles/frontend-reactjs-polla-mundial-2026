export const isMatchClosed = (match) =>
  match.status !== "notstarted" || new Date() >= new Date(match.matchDate);

export const getTeamName = (id, nameEn) => nameEn || id;

export const formatMatchShort = (matchDate) => {
  const d = new Date(matchDate);
  const day = d.getDate();
  const month = d.toLocaleString("es", { month: "short" }).replace(".", "").toUpperCase();
  const time = d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${day} ${month} · ${time}`;
};

export const formatMatchDate = (matchDate) => new Date(matchDate).toLocaleString();

export const predictionOutcome = (prediction) => {
  if (!prediction) return null;
  if (prediction.points === 6) return { label: "Acierto total", tone: "primary" };
  if (prediction.points === 3) return { label: "Acertaste resultado", tone: "secondary" };
  return { label: "Fallaste", tone: "muted" };
};
