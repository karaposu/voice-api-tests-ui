import { create } from "zustand";

interface VisualSettingsModalState {
  showSqlBox: boolean;
  setShowSqlBox: (value: boolean) => void;
  showRawData: boolean;
  setShowRawData: (value: boolean) => void;
  showTidyData: boolean;
  setShowTidyData: (value: boolean) => void;
  showTableData: boolean;
  setShowTableData: (value: boolean) => void;
}

export const useVisualSettingsModalStore = create<VisualSettingsModalState>(
  (set) => ({
    showSqlBox: true,
    setShowSqlBox: (value) => set({ showSqlBox: value }),

    showRawData: false,
    setShowRawData: () =>
      set({ showRawData: true, showTidyData: false, showTableData: false }),

    showTidyData: false,
    setShowTidyData: () =>
      set({ showRawData: false, showTidyData: true, showTableData: false }),

    showTableData: true,
    setShowTableData: () =>
      set({ showRawData: false, showTidyData: false, showTableData: true }),
  })
);
