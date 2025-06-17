import { cn } from "@/lib/utils";

import { ResizablePanel, ResizablePanelGroup } from "./ui/resizable";

import { Leftside } from "./Leftside";

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 h-screen flex flex-col pb-4 pt-2">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-col md:flex-row gap-4 h-[calc(100vh-100px)]"
      >
        <ResizablePanel className={cn("md:w-5/12 flex flex-col")}>
          <Leftside />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
