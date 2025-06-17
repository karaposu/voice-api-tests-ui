import { create } from "zustand";

interface SettingsModalState {
  repeat_if_fails: number;
  setRepeat_if_fails: (value: number) => void;
  freeChat: boolean;
  setFreeChat: (value: boolean) => void;
  useContextForSql: boolean;
  setUseContextForSql: (value: boolean) => void;
  useContextForSummary: boolean;
  setUseContextForSummary: (value: boolean) => void;
  showTotalCost: boolean;
  setShowTotalCost: (value: boolean) => void;
  showPerMessageCost: boolean;
  setShowPerMessageCost: (value: boolean) => void;
  saveInChatHistory: boolean;
  setSaveInChatHistory: (value: boolean) => void;
  returnMockData: boolean;
  setReturnMockData: (value: boolean) => void;
  enableRag: boolean;
  setEnableRag: (value: boolean) => void;
  inclSqlInChatContext: boolean;
  setInclSqlInChatContext: (value: boolean) => void;
  InclDataInChatContext: boolean;
  setInclDataInChatContext: (value: boolean) => void;
  historyRangeForContext: number;
  setHistoryRangeForContext: (value: number) => void;
  howManyRowShouldBeSaved: number;
  setHowManyRowShouldBeSaved: (value: number) => void;
  passcode: string;
  setPasscode: (value: string) => void;
  lastMessageId: number;
  setLastMessageId: (value: number) => void;
  input: string;
  setInput: (value: string) => void;
  model: string;
  setModel: (value: string) => void;
  usage: {
    input_tokens: number;
    output_tokens: number;
    model: string;
    total_tokens: number;
    total_cost: number;
  };
  setUsage: (value: {
    input_tokens: number;
    output_tokens: number;
    model: string;
    total_tokens: number;
    total_cost: number;
  }) => void;
  sqlCode: string;
  setSqlCode: (value: string) => void;
  selectedChartType: string;
  setSelectedChartType: (value: string) => void;
  htmlOutput: string;
  setHtmlOutput: (value: string) => void;
  loadingHtml: boolean;
  setLoadingHtml: (value: boolean) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  error: string;
  setError: (value: string) => void;
  output: Record<string, unknown>[];
  setOutput: (value: Record<string, unknown>[]) => void;
}

export const useSettingsModalStore = create<SettingsModalState>()((set) => ({
  repeat_if_fails: 2,
  setRepeat_if_fails: (value) => set({ repeat_if_fails: value }),
  freeChat: false,
  setFreeChat: (value) => set({ freeChat: value }),
  useContextForSql: true,
  setUseContextForSql: (value) => set({ useContextForSql: value }),
  useContextForSummary: true,
  setUseContextForSummary: (value) => set({ useContextForSummary: value }),
  showTotalCost: true,
  setShowTotalCost: (value) => set({ showTotalCost: value }),
  showPerMessageCost: true,
  setShowPerMessageCost: (value) => set({ showPerMessageCost: value }),
  saveInChatHistory: false,
  setSaveInChatHistory: (value) => set({ saveInChatHistory: value }),
  returnMockData: false,
  setReturnMockData: (value) => set({ returnMockData: value }),
  enableRag: false,
  setEnableRag: (value) => set({ enableRag: value }),
  inclSqlInChatContext: true,
  setInclSqlInChatContext: (value) => set({ inclSqlInChatContext: value }),
  InclDataInChatContext: true,
  setInclDataInChatContext: (value) => set({ InclDataInChatContext: value }),
  passcode: "",
  setPasscode: (value) => set({ passcode: value }),
  lastMessageId: 0,
  setLastMessageId: (value) => set({ lastMessageId: value }),
  input: "En cok para harcadigimiz 3 tedarikci kim?",
  setInput: (value) => set({ input: value }),
  model: "gpt-4o-mini",
  setModel: (value) => set({ model: value }),
  usage: {
    input_tokens: 0,
    output_tokens: 0,
    model: "",
    total_tokens: 0,
    total_cost: 0,
  },
  setUsage: (value) => set({ usage: value }),
  sqlCode: "",
  setSqlCode: (value) => set({ sqlCode: value }),
  selectedChartType: "automatic",
  setSelectedChartType: (value) => set({ selectedChartType: value }),
  htmlOutput: "",
  setHtmlOutput: (value) => set({ htmlOutput: value }),
  loadingHtml: false,
  setLoadingHtml: (value) => set({ loadingHtml: value }),
  loading: false,
  setLoading: (value) => set({ loading: value }),
  error: "",
  setError: (value) => set({ error: value }),
  output: [],
  setOutput: (value) => set({ output: value }),

  historyRangeForContext: 5,
  setHistoryRangeForContext: (value) => set({ historyRangeForContext: value }),
  howManyRowShouldBeSaved: 200,
  setHowManyRowShouldBeSaved: (value) =>
    set({ howManyRowShouldBeSaved: value }),
}));
