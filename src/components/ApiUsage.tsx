import { UsageCost } from "@/api/myApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";

export const ApiUsage = () => {
  const api_url = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();

  const getApiUsage = async (): Promise<UsageCost> => {
    const response = axios.get(api_url + "/usage");
    return (await response).data;
  };

  const { data: apiUsageQuery } = useQuery({
    queryKey: ["usage"],
    queryFn: getApiUsage,
    refetchInterval: 10000,
  });

  const metaTime = queryClient.getQueryData<{ creation: string }>(["chatMeta"]);

  return (
    <div className="flex flex-col text-center text-muted-foreground text-lg">
      <span>
        $
        {apiUsageQuery?.total_cost?.toLocaleString("en-US", {
          minimumFractionDigits: 6,
          maximumFractionDigits: 6,
        }) ?? 0}{" "}
        Total Cost
      </span>
      <div className="text-xs flex justify-center gap-x-2">
        <span>
          ($
          {apiUsageQuery?.query_creation_cost?.toLocaleString("en-US", {
            minimumFractionDigits: 6,
            maximumFractionDigits: 6,
          }) ?? 0}{" "}
          Query +{" "}
        </span>
        <span>
          $
          {apiUsageQuery?.visualization_cost?.toLocaleString("en-US", {
            minimumFractionDigits: 6,
            maximumFractionDigits: 6,
          }) ?? 0}{" "}
          Visualization)
        </span>
        <span className="text-xs">
          {metaTime?.creation
            ? `Since: ${format(
                new Date(metaTime.creation),
                "yyyy-MM-dd HH:mm:ss"
              )}`
            : ""}{" "}
        </span>
      </div>
    </div>
  );
};
