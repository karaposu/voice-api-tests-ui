"use client";

import * as Tabs from "@radix-ui/react-tabs";
import SettingsModal from "./Settings/SettingsModal";
import { AutosizeTextarea } from "./ui/autosize-textarea";
import { AiModelSelection } from "./AiModelSelection";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./ui/loadingSpinner";
import { useTabSelectionStore } from "@/hooks/TabSelectionStore";
import { useSettingsModalStore } from "@/hooks/SettingsModalStore";
import { ExecuteRequest } from "@/api/myApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModelSelectionStore } from "@/hooks/ModelSelectionStore";
import axios from "axios";
import { toast } from "sonner";
import VoiceChat from "./VoiceChat";
import { useEffect, useState } from "react";

export default function ChatTabs() {
  const {
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
  } = useSettingsModalStore();

  const { defaultModels } = useModelSelectionStore();
  const queryClient = useQueryClient();

  const api_url = "http://localhost:5173";

  const token = localStorage.getItem("access_token");

  const [chatId, setChatId] = useState<number | null>(null);

  // Login sonrası chat id al veya yeni chat oluştur
  useEffect(() => {
    if (!token) return;

    const storedChatId = localStorage.getItem("chat_id");
    if (storedChatId) {
      setChatId(parseInt(storedChatId, 10));
    } else {
      (async () => {
        try {
          const res = await axios.post(
            `${api_url}/chat`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setChatId(res.data.chat_id);
          localStorage.setItem("chat_id", res.data.chat_id.toString());
        } catch (e) {
          console.error("Failed to create chat:", e);
          toast.error("Failed to create chat. Please try again.");
        }
      })();
    }
  }, [token]);

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

  const postMessage = async () => {
    if (!chatId) {
      toast.error("No chat session available. Please try again.");
      return;
    }
    await axios.post(
      `${api_url}/chat/${chatId}/messages`,
      {
        message: input,
        message_format: "text",
        config: {},
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const sendMessageMutation = useMutation({
    mutationFn: postMessage,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["chatHistory"] });
      setInput(""); // input temizle
    },
    onError: (error: any) => {
      console.error("Error sending message:", error.message);
      toast.error("Message failed", { position: "top-center" });
    },
  });

  return (
    <Tabs.Root
      className="flex md:flex-row flex-col w-full gap-2 py-4"
      defaultValue="chat"
    >
      <div className="flex md:flex-col flex-row md:justify-start justify-between  gap-2">
        <Tabs.List
          className="flex md:flex-col flex-row items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
          aria-label="Tab Menu"
        >
          <Tabs.Trigger
            value="chat"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md md:px-3 px-2 md:py-3 py-1 md:text-sm text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
          >
            Chat
          </Tabs.Trigger>
          <Tabs.Trigger
            value="voice"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md md:px-3 px-2 md:py-3 py-1 md:text-sm text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
          >
            Voice
          </Tabs.Trigger>
        </Tabs.List>

        <SettingsModal />
      </div>

      <Tabs.Content value="chat" className="w-full">
        <div className="md:flex items-start gap-x-2 h-full">
          <AutosizeTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="md:mb-0 mb-3 "
          />
          <div className="flex flex-col gap-2">
            <AiModelSelection />
            <Button
              onClick={() => sendMessageMutation.mutate()}
              disabled={sendMessageMutation.isPending}
            >
              Send
              {sendMessageMutation.isPending && <LoadingSpinner />}
            </Button>
          </div>
        </div>
      </Tabs.Content>
      <Tabs.Content value="voice" className="w-full">
        <VoiceChat />
      </Tabs.Content>
    </Tabs.Root>
  );
}
