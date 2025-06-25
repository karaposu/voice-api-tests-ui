import { FileDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ScrollArea } from "./ui/scroll-area";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { HistoryMessage } from "@/api/myApi";
import { useSettingsModalStore } from "@/hooks/SettingsModalStore";
import { cn } from "@/lib/utils";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export const ChatHistory = () => {
  const cleanHTML = (html: string) => {
    return html.replace(/```html|```/g, "");
  };
  const { setLastMessageId } = useSettingsModalStore();

  const [showMiniVisualCode, setShowMiniVisualCode] = useState(true);

  const api_url = "http://localhost:5173"; // Local backend URL

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // chat_id'yi localStorage'dan alıyoruz
  const chat_id = localStorage.getItem("chat_id");

  // access token varsa al
  const token = localStorage.getItem("access_token");

  const getChatHistory = async (): Promise<HistoryMessage[]> => {
    if (!chat_id) return [];

    const response = await axios.get(`${api_url}/chat/${chat_id}/messages`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data;
  };

  const { data: chatHistory } = useQuery({
    queryKey: ["chatHistory", chat_id],
    queryFn: getChatHistory,
    refetchInterval: 5000, // 5 saniyede bir yenile
    enabled: !!chat_id, // chat_id varsa sorguyu çalıştır
  });

  const scrollToBottom = (container: HTMLElement | null, smooth = false) => {
    if (container?.children.length) {
      const lastElement = container?.lastChild as HTMLElement;

      lastElement?.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    scrollToBottom(chatContainerRef.current, true);
    if (chatHistory && chatHistory.length > 0) {
      const lastMessage = chatHistory[chatHistory.length - 1];
      setLastMessageId(lastMessage.id ?? 0);
    }
  }, [chatHistory, setLastMessageId]);

  if (!chat_id) {
    return (
      <div className="p-4 text-center text-red-600">
        No chat session found. Please start a new chat or login.
      </div>
    );
  }

  return (
    <div className="border p-2 overflow-auto flex-1 rounded-xl bg-[#dcf8c6] relative">
      <div className="h-full bg-white p-4 rounded-xl flex flex-col ">
        <div className="flex items-center justify-between text-center ">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger>
                {chatHistory?.some((msg) => msg.visual_code) && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowMiniVisualCode((prev) => !prev)}
                  >
                    {showMiniVisualCode ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </Button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle visualization in chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span className="">Chat History</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <FileDown />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Download the chat history</DialogTitle>
                <DialogDescription>
                  You can download the chat history as a pdf file.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-8 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="user-message"
                    className="text-left col-span-3 text-gray-400 hover:cursor-not-allowed"
                  >
                    Include user messages
                  </Label>
                  <Checkbox disabled id="user-message" className="col-span-1" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4 justify-center">
                  <Label
                    htmlFor="llm-message"
                    className="text-left col-span-3 text-gray-400 hover:cursor-not-allowed"
                  >
                    Include llm messages
                  </Label>
                  <Checkbox disabled id="llm-message" className="col-span-1" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4 justify-center">
                  <Label
                    htmlFor="rephrase-all"
                    className="text-left col-span-3 text-gray-400 hover:cursor-not-allowed"
                  >
                    Rephrase all messages
                  </Label>
                  <Checkbox disabled id="rephrase-all" className="col-span-1" />
                </div>
              </div>
              <DialogFooter>
                <Button disabled type="submit">
                  Export as pdf
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="flex-1 p-4 ">
          <div ref={chatContainerRef} className="space-y-4">
            {chatHistory
              ?.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
              .map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col relative max-w-[70%]",
                    msg.user_type === "user"
                      ? "items-end ml-auto"
                      : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 ",
                      msg.user_type === "user"
                        ? "bg-green-500 text-white rounded-br-none"
                        : "bg-[#ece5dd] rounded-bl-none",
                      msg.visual_code && "rounded-bl-none"
                    )}
                  >
                    <p className="text-xs whitespace-pre-wrap">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.user_type === "user"
                          ? "text-green-100"
                          : "text-gray-500"
                      }`}
                    >
                      {msg.timestamp
                        ? format(new Date(msg.timestamp), "dd/MM/yyyy HH:mm:ss")
                        : "Invalid date"}
                    </p>
                  </div>
                  {msg.visual_code && showMiniVisualCode && (
                    <div
                      className="border border-gray-300 rounded-lg rounded-tl-none rounded-tr-none bg-white overflow-hidden shadow-lg"
                      style={{ height: "250px", width: "100%" }}
                    >
                      <iframe
                        srcDoc={
                          cleanHTML(msg.visual_code) +
                          `<style>
              html, body {
                margin: 0;
                padding: 0;
                height: 100%;
                width: 100%;
              }
              body {
                display: flex;
                justify-content: center;
                align-items: center;
              }
              #vendorChart {
                width: 100% !important;
                height: 100% !important;
              }
            </style>`
                        }
                        title={`Visualization for message ${msg.id}`}
                        style={{
                          border: "none",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
