"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import { AutosizeTextarea } from "./ui/autosize-textarea";
import { AiModelSelection } from "./AiModelSelection";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./ui/loadingSpinner";
import { useSettingsModalStore } from "@/hooks/SettingsModalStore";
import { useModelSelectionStore } from "@/hooks/ModelSelectionStore";
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SettingsModal from "./Settings/SettingsModal";
import VoiceChat from "./VoiceChat";

export default function ChatTabs() {
  const { input, setInput } = useSettingsModalStore();
  const { default_model } = useModelSelectionStore();

  const [chatId, setChatId] = useState<number | null>(null);
  const api_url = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("access_token");
  const queryClient = useQueryClient();

  // Chat ID başlatma
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
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setChatId(res.data.chat_id);
          localStorage.setItem("chat_id", res.data.chat_id.toString());
        } catch (e) {
          console.error("Chat oluşturulamadı:", e);
          toast.error("Sohbet başlatılamadı. Lütfen tekrar deneyin.");
        }
      })();
    }
  }, [token]);

  // Mesaj gönderme
  const postMessage = async () => {
    if (!chatId) {
      toast.error("Sohbet oturumu bulunamadı.");
      return;
    }

    await axios.post(
      `${api_url}/chat/${chatId}/messages`,
      {
        message: input,
        message_format: "text",
        config: {
          model_name: default_model, // seçilen model backend’e gönderiliyor
        },
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
      console.error("Mesaj gönderimi başarısız:", error.message);
      toast.error("Mesaj gönderilemedi");
    },
  });

  return (
    <Tabs.Root
      className="flex md:flex-row flex-col w-full gap-2 py-4"
      defaultValue="chat"
    >
      <div className="flex md:flex-col flex-row md:justify-start justify-between gap-2">
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
            className="md:mb-0 mb-3"
            placeholder="Mesajınızı yazın..."
          />
          <div className="flex flex-col gap-2">
            <AiModelSelection />
            <Button
              onClick={() => sendMessageMutation.mutate()}
              disabled={sendMessageMutation.isPending}
            >
              Gönder
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
