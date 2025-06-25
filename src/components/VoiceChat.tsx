import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  PauseIcon,
  CircleIcon,
  PlayIcon,
  TrashIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { useReactMediaRecorder } from "react-media-recorder";
import { ModelsDataResponse } from "@/api/myApi";
import { useModelSelectionStore } from "@/hooks/ModelSelectionStore";
import axios from "axios";

export default function VoiceChat() {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      blobPropertyBag: { type: "audio/wav" },
      onStop: (_blobUrl, blob) => {
        setAudioBlob(blob);
      },
    });

  const handleStart = () => {
    startRecording();
    setElapsedTime(0);
    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 10);
    }, 10);
  };

  const handleStop = () => {
    stopRecording();
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleDelete = () => {
    clearBlobUrl();
    setElapsedTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setAudioBlob(null);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  useEffect(() => {
    return () => {
      // unmount sırasında interval'ı temizle
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSend = () => {
    if (!audioBlob || !defaultModels.default_model_for_query_generation) return;

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    formData.append("model", defaultModels.default_model_for_query_generation);

    console.log("[SEND]", formData);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, "0")} sec`;
  };

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
    <div className="flex flex-col items-center md:p-4 p-2 border rounded-xl shadow-md w-full space-y-4">
      <Button
        className="rounded-full h-16 w-16 flex items-center justify-center text-white bg-red-500 hover:bg-red-600"
        onClick={status === "recording" ? handleStop : handleStart}
      >
        {status === "recording" ? (
          <PauseIcon width={24} height={24} />
        ) : (
          <CircleIcon width={24} height={24} />
        )}
      </Button>

      <div className="flex items-center md:gap-4 gap-2">
        <Button onClick={handleDelete} disabled={!mediaBlobUrl}>
          <TrashIcon />
        </Button>

        <span className="text-sm w-20 text-center">
          {elapsedTime > 0 ? formatTime(elapsedTime) : "0.000 sec"}
        </span>

        <Button onClick={togglePlayback} disabled={!mediaBlobUrl}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
      </div>

      <div className="flex items-center md:gap-4 gap-2">
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
          <SelectContent>
            {modelQuery.data?.models?.map((model) => (
              <SelectItem
                key={model}
                value={model}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleSend} disabled={!audioBlob}>
          <PaperPlaneIcon className="mr-2" /> Send
        </Button>
      </div>

      {mediaBlobUrl && (
        <audio key={mediaBlobUrl} src={mediaBlobUrl} ref={audioRef} hidden />
      )}
    </div>
  );
}
