import { create } from "zustand";
import { PredictionService } from "../api/services/predictionService";

export const useMatchesStore = create((set) => ({
  matches: [],
  loading: false,

  fetchMatches: async () => {
    set({ loading: true });
    try {
      const matches = await PredictionService.getMatches();
      set({ matches });
    } finally {
      set({ loading: false });
    }
  },

  submitPrediction: async (matchId, homeScore, awayScore) => {
    await PredictionService.submit(matchId, homeScore, awayScore);
    set({ matches: await PredictionService.getMatches() });
  },
}));
