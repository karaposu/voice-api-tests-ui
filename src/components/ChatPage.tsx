import { cn } from "@/lib/utils";

import { ResizablePanel, ResizablePanelGroup } from "./ui/resizable";

import { Leftside } from "./Leftside";

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 md:h-[calc(100%-56px)] h-[calc(100%-120px)] flex flex-col pb-4 pt-2">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-col md:flex-row gap-4 h-[calc(100vh-100px)]"
      >
        <ResizablePanel className={cn("flex flex-col")}>
          <Leftside />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
