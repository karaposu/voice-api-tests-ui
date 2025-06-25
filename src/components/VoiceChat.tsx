import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import {
  PauseIcon,
  CircleIcon,
  PlayIcon,
  TrashIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { useReactMediaRecorder } from "react-media-recorder";
import axios from "axios";
import { useModelSelectionStore } from "@/hooks/ModelSelectionStore";
import { AiModelSelection } from "./AiModelSelection"; // Yolunu projenize göre ayarla

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

  const { default_model } = useModelSelectionStore();

  const api_url = import.meta.env.VITE_API_URL;

  // Kayıt başlat
  const handleStart = () => {
    startRecording();
    setElapsedTime(0);
    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 10);
    }, 10);
  };

  // Kayıt durdur
  const handleStop = () => {
    stopRecording();
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Ses dosyasını sil
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

  // Ses oynat/durdur toggle
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

  // Oynatma bitince durumu resetle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  // Component unmount olunca interval temizle
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Kaydedilen sesi backend'e gönder
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          resolve(result.split(",")[1]); // base64 içeriği al (data:... kısmı hariç)
        } else {
          reject("Invalid base64 result");
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  const handleSend = async () => {
    if (!audioBlob || !default_model) return;

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    // Ses dosyasını base64'e çevir
    const base64 = await blobToBase64(audioBlob);
    formData.append("message", base64);
    formData.append("message_format", "voice");
    formData.append("model", default_model.toString());

    try {
      const token = localStorage.getItem("access_token");
      await axios.post(api_url + "/voice-to-text", formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      handleDelete(); // Gönderim sonrası temizle
    } catch (error) {
      console.error("Voice send failed:", error);
    }
  };

  // Zamanı güzel formatla (sn.ms)
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, "0")} sec`;
  };

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

      {/* AiModelSelection componentini buraya koyuyoruz */}
      <AiModelSelection />

      <Button onClick={handleSend} disabled={!audioBlob}>
        <PaperPlaneIcon className="mr-2" /> Send
      </Button>

      {mediaBlobUrl && (
        <audio key={mediaBlobUrl} src={mediaBlobUrl} ref={audioRef} hidden />
      )}
    </div>
  );
}
