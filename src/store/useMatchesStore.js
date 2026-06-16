import { create } from "zustand";
import { PredictionService } from "../api/services/predictionService";

export const useMatchesStore = create((set) => ({
  matches: [],
  loading: false,
  error: false,

  fetchMatches: async () => {
    set({ loading: true, error: false });
    try {
      const matches = await PredictionService.getMatches();
      set({ matches, error: false });
    } catch (e) {
      set({ error: true });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  submitPrediction: async (matchId, homeScore, awayScore) => {
    await PredictionService.submit(matchId, homeScore, awayScore);
    set({ matches: await PredictionService.getMatches() });
  },
}));
