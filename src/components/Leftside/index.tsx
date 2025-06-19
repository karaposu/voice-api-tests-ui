import { ChatHistory } from "../ChatHistory";
import { useSettingsModalStore } from "@/hooks/SettingsModalStore";
import ChatTabs from "../ChatTabs";
import { ApiUsage } from "../ApiUsage";

export const Leftside = () => {
  const { usage, showPerMessageCost } = useSettingsModalStore();
  const { showTotalCost } = useSettingsModalStore();

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-bold">Voice API Tester</div>
        {showTotalCost && <ApiUsage />}
        <span className="md:inline-block hidden w-44"></span>
      </div>

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
