import { ChatHistory } from "../ChatHistory";
import SettingsModal from "../Settings/SettingsModal";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import { AiModelSelection } from "../AiModelSelection";
import { useSettingsModalStore } from "@/hooks/SettingsModalStore";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../ui/loadingSpinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatMetaData, ExecuteRequest } from "@/api/myApi";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

import { ModelRejection } from "../ModelRejection";
import { useModelSelectionStore } from "@/hooks/ModelSelectionStore";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTabSelectionStore } from "@/hooks/TabSelectionStore";

export const Leftside = () => {
  const {
    usage,
    input,
    setInput,
    repeat_if_fails,
    freeChat,
    useContextForSql,
    useContextForSummary,
    inclSqlInChatContext,
    InclDataInChatContext,
    historyRangeForContext,
    howManyRowShouldBeSaved,
    saveInChatHistory,
    returnMockData,
    enableRag,
    passcode,
    setUsage,
    setHtmlOutput,
    setSqlCode,
    setError,
    setOutput,
    showPerMessageCost,

    setEnableRag,
  } = useSettingsModalStore();

  const { defaultModels } = useModelSelectionStore();

  const { activeTab, setActiveTab } = useTabSelectionStore();

  const queryClient = useQueryClient();

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [modelRejectionMessage, setModelRejectionMessage] = useState("");

  const api_url = import.meta.env.VITE_API_URL;

  const postToExecute = async () => {
    const requestData: ExecuteRequest = {
      input_text: input,
      name_of_model: defaultModels.default_model_for_query_generation,
      repeat_if_fails: repeat_if_fails,
      free_chat: freeChat,
      use_chat_context_for_sql: useContextForSql,
      use_chat_context_for_summary: useContextForSummary,
      include_sql_in_chat_context: inclSqlInChatContext,
      include_data_in_chat_context: InclDataInChatContext,
      history_range_for_context: historyRangeForContext,
      how_many_rows_of_data_should_be_saved_to_message_objects:
        howManyRowShouldBeSaved,
      do_not_save_to_chat_history: saveInChatHistory,
      return_mock_data: returnMockData,
      enable_rag_optimization: enableRag,
      passcode: passcode,
      pick_model_for_message_type_checker:
        defaultModels.default_model_for_message_type_checker,
      pick_model_for_ai_chat: defaultModels.default_model_for_ai_chat,
      pick_model_for_visualisation:
        defaultModels.default_model_for_visualisation,
      pick_model_for_summary: defaultModels.default_model_for_summary,
    };
    const response = await axios.post(`${api_url}/execute`, requestData);
    if (response.data.llm_request_success === false) {
      toast.error("OpenAI Credit Is finished", {
        position: "top-center",
        richColors: true,
        duration: 2000,
      });
      return;
    }
    if (response.data.model_rejection_popup_message) {
      setShowAlertDialog(true);
      setModelRejectionMessage(response.data.model_rejection_popup_message);
      return;
    }
    setOutput(response.data.answer);
    setSqlCode(response.data.sql);
    setUsage(response.data.usage);
    setError("");
  };

  const executeMutation = useMutation({
    mutationFn: postToExecute,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["chatHistory"] });
    },
    onError: (error: any) => {
      console.error("Error sending data:", error.message);
      setError(error.message);
      setOutput([]);
      setSqlCode("");
      setHtmlOutput("");
    },
  });

  const chatMetaQuery = useQuery({
    queryKey: ["chatMeta"],
    queryFn: async (): Promise<ChatMetaData> => {
      const response = await axios.get(`${api_url}/chat/meta`);
      return response.data;
    },
    staleTime: Infinity,
  });

  return (
    <>
      <div className="text-xl font-bold mb-4">Voice API Tester</div>
      <ChatHistory />
      <div className="md:flex items-center gap-x-2 mt-2">
        <div className="md:flex md:flex-col grid grid-cols-2">
          <SettingsModal />
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger>
                <Toggle
                  onClick={() => setEnableRag(!enableRag)}
                  className={cn(
                    "data-[state=off]:text-gray-400 data-[state=on]:text-green-500 data-[state=on]:fill-green-500"
                  )}
                  data-state={enableRag ? "on" : "off"}
                >
                  <Leaf className={cn("h-5 w-5 ")} />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                {enableRag === false ? (
                  <p>Enable WAAG Based Optimization</p>
                ) : (
                  <p>Disable WAAG Based Optimization</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <AutosizeTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxHeight={200}
          className="mb:mb-0 mb-3"
        />
        <div className="flex flex-col gap-2">
          <AiModelSelection />
          <Button
            onClick={() => {
              executeMutation.mutate();
              setHtmlOutput("");
              if (activeTab === "html") {
                setActiveTab("output");
              }
            }}
            disabled={executeMutation.isPending}
          >
            Send
            {executeMutation.isPending && <LoadingSpinner />}
          </Button>
        </div>
      </div>
      <div className="flex items-center  justify-center gap-x-8 text-muted-foreground text-sm">
        {usage && showPerMessageCost && (
          <>
            <span>{`Input Token: ${usage.input_tokens}`}</span>
            <span>{`Output Token: ${usage.output_tokens}`}</span>
            <span>{`Cost: $${
              usage.total_cost.toLocaleString("en-US", {
                minimumFractionDigits: 6,
                maximumFractionDigits: 6,
              }) ?? 0
            }`}</span>
          </>
        )}
      </div>
      {showAlertDialog === true && (
        <ModelRejection
          showAlertDialog={showAlertDialog}
          setShowAlertDialog={setShowAlertDialog}
          modelRejectionMessage={modelRejectionMessage}
        />
      )}
    </>
  );
};
