import { create } from "zustand";

interface ModelSelectionStore {
  defaultModels: {
    default_model_for_query_generation: string;
    default_model_for_ai_chat: string;
    default_model_for_summary: string;
    default_model_for_visualisation: string;
    default_model_for_message_type_checker: string;
  };
  setDefaultModel: (
    key: keyof ModelSelectionStore["defaultModels"],
    model: string
  ) => void;
  initializeDefaults: (
    defaults: Partial<ModelSelectionStore["defaultModels"]>
  ) => void;
}

export const useModelSelectionStore = create<ModelSelectionStore>((set) => ({
  defaultModels: {
    default_model_for_query_generation: "",
    default_model_for_ai_chat: "",
    default_model_for_summary: "",
    default_model_for_visualisation: "",
    default_model_for_message_type_checker: "",
  },

  setDefaultModel: (key, model) =>
    set((state) => ({
      defaultModels: {
        ...state.defaultModels,
        [key]: model,
      },
    })),

  initializeDefaults: (defaults) =>
    set((state) => ({
      defaultModels: {
        ...state.defaultModels,
        ...defaults,
      },
    })),
}));
