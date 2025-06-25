import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import { useModelSelectionStore } from "@/hooks/ModelSelectionStore";
import { useEffect } from "react";

export const AiModelSelection = () => {
  const api_url = import.meta.env.VITE_API_URL;
  const { default_model, setDefaultModel, initializeDefaultModel } =
    useModelSelectionStore();

  const getModelsFunction = async (): Promise<{
    models: string[];
    defaults: { default_model: string };
  }> => {
    const response = await axios.get(api_url + "/info/models");
    return response.data;
  };

  const modelQuery = useQuery({
    queryKey: ["models"],
    queryFn: getModelsFunction,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (modelQuery.data?.defaults?.default_model && !default_model) {
      initializeDefaultModel(modelQuery.data.defaults.default_model);
    }
  }, [
    modelQuery.data?.defaults?.default_model,
    default_model,
    initializeDefaultModel,
  ]);

  return (
    <Select
      value={default_model}
      onValueChange={(value) => setDefaultModel(value)}
    >
      <SelectTrigger className="md:w-[100px] w-full text-[10px]">
        <SelectValue placeholder="Model" />
      </SelectTrigger>
      <SelectContent>
        {modelQuery.data?.models?.map((model: string) => (
          <SelectItem key={model} value={model}>
            {model}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
