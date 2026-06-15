import api from "../axiosConfig";

export const PredictionService = {
  getMatches: () => api.get("/predictions/matches").then((r) => r.data),
  submit: (matchId, homeScore, awayScore) =>
    api.post("/predictions", { matchId, homeScore, awayScore }).then((r) => r.data),
  getLeaderboard: (groupId) =>
    api.get(`/predictions/leaderboard/${groupId}`).then((r) => r.data),
};
