import { create } from "zustand";

interface ModelSelectionStore {
  default_model: string; // seçili model (tek string)
  setDefaultModel: (model: string) => void;
  initializeDefaultModel: (model: string) => void;
}

export const useModelSelectionStore = create<ModelSelectionStore>((set) => ({
  default_model: "",
  setDefaultModel: (model) => set({ default_model: model }),
  initializeDefaultModel: (model) => set({ default_model: model }),
}));
