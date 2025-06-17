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

  const api_url = import.meta.env.VITE_API_URL;
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const getChatHistory = async (): Promise<HistoryMessage[]> => {
    const response = axios.get(api_url + "/chat/history");
    return (await response).data;
  };

  const { data: ChatHistory } = useQuery({
    queryKey: ["chatHistory"],
    queryFn: getChatHistory,
    refetchInterval: 5000,
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
    if (ChatHistory && ChatHistory.length > 0) {
      const lastMessage = ChatHistory[ChatHistory.length - 2];
      setLastMessageId(lastMessage.id ?? 0);
    }
  }, [ChatHistory, setLastMessageId]);

  return (
    <div className="border p-2 overflow-auto flex-1 rounded-xl bg-[#dcf8c6] relative">
      <div className="h-full bg-white p-4 rounded-xl flex flex-col ">
        <div className="flex items-center justify-between text-center ">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger>
                {ChatHistory?.some((msg) => msg.visual_code) && (
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
            {ChatHistory?.sort((a, b) => (a.id ?? 0) - (b.id ?? 0)).map(
              (msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col items-${
                    msg.user_type === "human" ? "start" : "end"
                  } relative`}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg px-4 py-2 ",
                      msg.user_type === "human"
                        ? "bg-green-500 text-white "
                        : "bg-[#ece5dd]",
                      msg.visual_code && "rounded-bl-none"
                    )}
                  >
                    <p className="text-xs">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.user_type === "human"
                          ? "text-green-100"
                          : "text-gray-500"
                      }`}
                    >
                      {msg.timestamp
                        ? format(new Date(msg.timestamp), "dd/MM/yyyy HH:mm:ss")
                        : "Invalid date"}
                    </p>
                  </div>
                  {msg.visual_code && showMiniVisualCode ? (
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
                  ) : null}
                </div>
              )
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
