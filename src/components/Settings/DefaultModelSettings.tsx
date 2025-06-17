import { ModelsDataResponse } from "@/api/myApi";
import { useModelSelectionStore } from "@/hooks/ModelSelectionStore";
import { useQueryClient } from "@tanstack/react-query";
import { Brain } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect } from "react";

export const DefaultModelSettings = () => {
  const { setDefaultModel, defaultModels, initializeDefaults } =
    useModelSelectionStore();

  const queryClient = useQueryClient();

  const modelQuery = queryClient.getQueryData(["models"]) as ModelsDataResponse;

  const models = modelQuery?.models || [];

  useEffect(() => {
    if (modelQuery?.defaults) {
      const areDefaultsSet = Object.values(defaultModels).every(
        (value) => value !== ""
      );
      if (!areDefaultsSet) {
        initializeDefaults(modelQuery.defaults);
      }
    }
  }, [modelQuery?.defaults, defaultModels, initializeDefaults]);

  return (
    <div className="flex flex-col gap-y-8">
      {Object.entries(defaultModels).map(([key, value]) => (
        <div className="flex items-center space-x-4" key={key}>
          <Brain className="h-5 w-5" />
          <div className="flex flex-col justify-evenly h-full gap-y-1 flex-1">
            <h4 className="font-medium">Select {key.replace(/_/g, " ")}</h4>
            <Select
              value={value}
              onValueChange={(value) => {
                setDefaultModel(
                  key as
                    | "default_model_for_query_generation"
                    | "default_model_for_ai_chat"
                    | "default_model_for_summary"
                    | "default_model_for_visualisation"
                    | "default_model_for_message_type_checker",
                  value
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
};
