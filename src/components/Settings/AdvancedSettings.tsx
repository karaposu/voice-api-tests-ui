import {
  BotMessageSquare,
  History,
  HistoryIcon,
  MessageSquareMore,
  MessageSquareQuote,
} from "lucide-react";

import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import { useSettingsModalStore } from "@/hooks/SettingsModalStore";

export const AdvancedSettings = () => {
  const {
    useContextForSql,
    setUseContextForSql,
    returnMockData,
    setReturnMockData,
    historyRangeForContext,
    setHistoryRangeForContext,
    howManyRowShouldBeSaved,
    setHowManyRowShouldBeSaved,
    inclSqlInChatContext,
    setInclSqlInChatContext,
    InclDataInChatContext,
    setInclDataInChatContext,
    useContextForSummary,
    setUseContextForSummary,
  } = useSettingsModalStore();

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex items-center space-x-4">
        <MessageSquareMore className="h-5 w-5" />
        <div className="flex flex-col justify-evenly h-full gap-y-1 flex-1">
          <h4 className="font-medium">Use Chat Context for SQL?</h4>
          <p className="text-sm text-gray-500">
            Select to enable context usage for SQL
          </p>
        </div>
        <div className="flex items-end justify-end">
          <Checkbox
            id="sql-context"
            checked={useContextForSql}
            onCheckedChange={setUseContextForSql}
          />
        </div>
      </div>

      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <BotMessageSquare className="h-5 w-5" />
          <div className="flex flex-col justify-evenly h-full gap-y-1 flex-1">
            <h4 className="font-medium">Use Chat Context for Summary?</h4>
            <p className="text-sm text-gray-500">
              Select to enable context usage for summary
            </p>
          </div>
        </div>
        <div className="flex items-end justify-end">
          <Checkbox
            id="summary-context"
            checked={useContextForSummary}
            onCheckedChange={setUseContextForSummary}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <MessageSquareQuote className="h-5 w-5" />
        <div className="flex flex-col justify-evenly h-full gap-y-1 flex-1">
          <h4 className="font-medium">Include SQL In Chat Context</h4>
        </div>
        <div className="flex items-end justify-end">
          <Checkbox
            id="sql-chat-context"
            checked={inclSqlInChatContext}
            onCheckedChange={setInclSqlInChatContext}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <MessageSquareQuote className="h-5 w-5" />
        <div className="flex flex-col justify-evenly h-full gap-y-1 flex-1">
          <h4 className="font-medium">Include Data in Chat Context</h4>
        </div>
        <div className="flex items-end justify-end">
          <Checkbox
            id="data-chat-context"
            checked={InclDataInChatContext}
            onCheckedChange={setInclDataInChatContext}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <MessageSquareQuote className="h-5 w-5" />
        <div className="flex flex-col justify-evenly h-full gap-y-1 flex-1">
          <h4 className="font-medium">Return Mock Data</h4>
        </div>
        <div className="flex items-end justify-end">
          <Checkbox
            id="mock-data"
            checked={returnMockData}
            onCheckedChange={setReturnMockData}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <HistoryIcon className="h-5 w-5" />
        <div className="flex flex-col justify-evenly h-full gap-y-1 flex-1">
          <h4 className="font-medium">
            How many rows should be saved in chat history?
          </h4>
          <Slider
            value={[howManyRowShouldBeSaved]}
            onValueChange={(value) => setHowManyRowShouldBeSaved(value[0])}
            max={500}
            step={1}
          />
        </div>
        <div className="text-right text-xl">{howManyRowShouldBeSaved}</div>
      </div>

      <div className="flex items-center space-x-4">
        <History className="h-5 w-5" />
        <div className="flex flex-col justify-evenly h-full gap-y-1 flex-1">
          <h4 className="font-medium">History Range for Chat Context</h4>
          <p className="text-sm text-gray-500">
            Select the history range for chat context
          </p>
          <Slider
            value={[historyRangeForContext]}
            onValueChange={(value) => setHistoryRangeForContext(value[0])}
            max={10}
            step={1}
          />
        </div>
        <div className="text-right text-xl">{historyRangeForContext}</div>
      </div>
    </div>
  );
};
