import { create } from "zustand";

interface TabSelectionStore {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const useTabSelectionStore = create<TabSelectionStore>((set) => ({
  activeTab: "output",
  setActiveTab: (value) => set({ activeTab: value }),
}));
