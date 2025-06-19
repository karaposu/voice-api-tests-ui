import {
  CircleDollarSign,
  MessageCircle,
  MessageSquareMore,
  MessageSquareQuote,
  Repeat,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { AdvancedSettings } from "./AdvancedSettings";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettingsModalStore } from "@/hooks/SettingsModalStore";
import { DefaultModelSettings } from "./DefaultModelSettings";

export default function SettingsModal() {
  const {
    repeat_if_fails,
    setRepeat_if_fails,
    freeChat,
    setFreeChat,
    showTotalCost,
    setShowTotalCost,
    showPerMessageCost,
    setShowPerMessageCost,
    saveInChatHistory,
    setSaveInChatHistory,
    enableRag,
    setEnableRag,
  } = useSettingsModalStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="md:w-full" size="icon" variant="ghost">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Settings of Execution</DialogTitle>
          <DialogDescription>
            Configure the settings of the execution
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="general" className="mt-4">
          <TabsList>
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
            <TabsTrigger value="defaults">Default Models</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-4">
            <div className="flex flex-col gap-y-8 ">
              <div className="flex items-center space-x-4">
                <Repeat className="h-5 w-5" />
                <div className="flex flex-col gap-y-1">
                  <h4 className="font-medium">Repeat if fails?</h4>
                  <p className="text-sm text-gray-500">
                    Select repetition when it fails to generate
                  </p>
                  <Slider
                    value={[repeat_if_fails]}
                    onValueChange={(value) => setRepeat_if_fails(value[0])}
                    max={5}
                    step={1}
                  />
                </div>
                <div className="text-right text-xl flex-1">
                  {repeat_if_fails}
                </div>
              </div>

              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <MessageSquareMore className="h-5 w-5" />
                  <div className="flex flex-col gap-y-1">
                    <h4 className="font-medium">Flexible chat?</h4>
                    <p className="text-sm text-gray-500">
                      Select to enable flexible chat
                    </p>
                  </div>
                </div>
                <Switch
                  id="free-chat"
                  checked={freeChat}
                  onCheckedChange={setFreeChat}
                />
              </div>

              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <CircleDollarSign className="h-5 w-5" />
                  <div className="flex flex-col gap-y-1">
                    <h4 className="font-medium">Show Total Cost?</h4>
                  </div>
                </div>
                <Checkbox
                  id="total-cost"
                  checked={showTotalCost}
                  onCheckedChange={setShowTotalCost}
                />
              </div>

              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <div className="flex flex-col gap-y-1 ">
                    <h4 className="font-medium">Show Per Message Cost?</h4>
                  </div>
                </div>
                <Checkbox
                  id="message-cost"
                  checked={showPerMessageCost}
                  onCheckedChange={setShowPerMessageCost}
                />
              </div>

              <div className="flex items-center justify-between space-x-4 pointer-events-none opacity-50">
                <div className="flex items-center space-x-2">
                  <MessageSquareQuote className="h-5 w-5" />
                  <div className="flex flex-col gap-y-1">
                    <h4 className="font-medium">Do Not Save in Chat History</h4>
                  </div>
                </div>
                <Checkbox
                  id="save-chat"
                  checked={saveInChatHistory}
                  onCheckedChange={setSaveInChatHistory}
                />
              </div>

              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <MessageSquareQuote className="h-5 w-5" />
                  <div className="flex flex-col gap-y-1">
                    <h4 className="font-medium">
                      Enable WAAG Based Optimization
                    </h4>
                  </div>
                </div>
                <Checkbox
                  id="rag-based"
                  checked={enableRag}
                  onCheckedChange={setEnableRag}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="advanced" className="mt-4">
            <AdvancedSettings />
          </TabsContent>
          <TabsContent value="defaults" className="mt-4">
            <DefaultModelSettings />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
