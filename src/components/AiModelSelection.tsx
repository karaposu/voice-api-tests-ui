import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import { ModelsDataResponse } from "@/api/myApi";
import { useModelSelectionStore } from "@/hooks/ModelSelectionStore";
import { useEffect } from "react";

export const AiModelSelection = () => {
  const api_url = import.meta.env.VITE_API_URL;

  const { setDefaultModel, defaultModels, initializeDefaults } =
    useModelSelectionStore();

  const getModelsFunction = async (): Promise<ModelsDataResponse> => {
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
    if (modelQuery.data?.defaults) {
      const areDefaultsSet = Object.values(defaultModels).every(
        (value) => value !== ""
      );
      if (!areDefaultsSet) {
        initializeDefaults(modelQuery.data.defaults);
      }
    }
  }, [modelQuery.data?.defaults, defaultModels, initializeDefaults]);

  return (
    <Select
      defaultValue={
        modelQuery.data?.defaults?.default_model_for_query_generation
      }
      value={defaultModels.default_model_for_query_generation}
      onValueChange={(value) => {
        setDefaultModel("default_model_for_query_generation", value);
      }}
    >
      <SelectTrigger className="md:w-[100px] w-full text-[10px]">
        <SelectValue placeholder="Model" />
      </SelectTrigger>
      <SelectContent className="">
        {modelQuery.data?.models?.map((model) => (
          <SelectItem className="" key={model} value={model}>
            {model}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
