import { ChatHistory } from "../ChatHistory";
import { useSettingsModalStore } from "@/hooks/SettingsModalStore";
import ChatTabs from "../ChatTabs";

export const Leftside = () => {
  const { usage, showPerMessageCost } = useSettingsModalStore();

  return (
    <>
      <ChatHistory />
      <ChatTabs />
      {usage && showPerMessageCost && (
        <div className="flex items-center justify-center gap-x-8 text-muted-foreground text-sm">
          <span>{`Input Token: ${usage.input_tokens}`}</span>
          <span>{`Output Token: ${usage.output_tokens}`}</span>
          <span>{`Cost: $${usage.total_cost.toLocaleString("en-US", {
            minimumFractionDigits: 6,
            maximumFractionDigits: 6,
          })}`}</span>
        </div>
      )}
    </>
  );
};
