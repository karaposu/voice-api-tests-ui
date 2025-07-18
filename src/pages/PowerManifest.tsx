"use client";
import { useEffect, useRef, useState } from "react";
import PowerAddNewManifest from "@/components/PowerAddNew/PowerAddNewManifest";
import SettingsModal from "@/components/PowerAddNew/SettingsModal";
import * as Tabs from "@radix-ui/react-tabs";
import { Pause, Play, RefreshCcw, Settings, StopCircle } from "lucide-react";

type ManifestItem = {
  id: number;
  text: string;
  schedule?: string;
};

export default function PowerManifest() {
  const [manifests, setManifests] = useState<ManifestItem[]>([
    { id: 1, text: "I will never back down" },
    { id: 2, text: "I am the master of my fate" },
  ]);

  const [editingManifest, setEditingManifest] = useState<ManifestItem | null>(
    null
  );

  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(
    null
  );
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isLoopingId, setIsLoopingId] = useState<number | null>(null);
  const [isGlobalLooping, setIsGlobalLooping] = useState(false);
  const [isGlobalPlaying, setIsGlobalPlaying] = useState(false);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoice =
        voices.find((v) => v.lang === "en-US") ||
        voices.find((v) => v.lang.startsWith("en"));
      setCurrentVoice(englishVoice || null);
    };

    loadVoices();
    if (typeof speechSynthesis !== "undefined") {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = (text: string, onEnd?: () => void) => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (currentVoice) {
      utterance.voice = currentVoice;
    }
    utterance.onend = onEnd || null;
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
  };

  const handlePlay = (item: ManifestItem) => {
    if (playingId === item.id) {
      stopSpeaking();
      setPlayingId(null);
      return;
    }
    setPlayingId(item.id);
    speak(item.text, () => {
      if (isLoopingId === item.id) {
        handlePlay(item); // Loop
      } else {
        setPlayingId(null);
      }
    });
  };

  const handleGlobalPlay = () => {
    if (isGlobalPlaying) {
      stopSpeaking();
      setIsGlobalPlaying(false);
      return;
    }

    currentIndexRef.current = 0;
    setIsGlobalPlaying(true);
    speakAllSequentially();
  };

  const speakAllSequentially = () => {
    if (currentIndexRef.current >= manifests.length) {
      if (isGlobalLooping) {
        currentIndexRef.current = 0;
        speakAllSequentially();
      } else {
        setIsGlobalPlaying(false);
      }
      return;
    }

    const currentItem = manifests[currentIndexRef.current];
    speak(currentItem.text, () => {
      currentIndexRef.current += 1;
      speakAllSequentially();
    });
  };

  const addManifest = (text: string) => {
    setManifests((prev) => [...prev, { id: Date.now(), text }]);
  };

  const updateManifest = (id: number, newText: string, newSchedule: string) => {
    setManifests((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, text: newText, schedule: newSchedule }
          : item
      )
    );
    setEditingManifest(null);
  };

  return (
    <div className="max-w-[900px] mx-auto p-4 border rounded-lg shadow-md bg-white mt-7">
      <h1 className="text-center text-2xl font-bold">PowerManifest</h1>
      <Tabs.Root defaultValue="account">
        <Tabs.List className="flex items-center justify-center gap-4 my-4">
          <Tabs.Trigger value="account">Affirmation Nb</Tabs.Trigger>
          <Tabs.Trigger value="documents">All Affirmation</Tabs.Trigger>
          <Tabs.Trigger value="settings">Stats</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="account">
          <div className="flex items-center justify-center gap-4">
            <button onClick={handleGlobalPlay}>
              <Play className="w-8 h-8" />
            </button>
            <button onClick={() => stopSpeaking()}>
              <Pause className="w-8 h-8" />
            </button>
            <button onClick={() => setIsGlobalLooping((prev) => !prev)}>
              <RefreshCcw
                className={`w-8 h-8 ${isGlobalLooping ? "text-blue-600" : ""}`}
              />
            </button>
          </div>

          <div className="mt-10 flex flex-col gap-5">
            {manifests.map((item) => (
              <div className="flex items-center gap-3" key={item.id}>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handlePlay(item)}>
                    {playingId === item.id ? (
                      <StopCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      setIsLoopingId(isLoopingId === item.id ? null : item.id)
                    }
                  >
                    <RefreshCcw
                      className={`w-5 h-5 ${
                        isLoopingId === item.id ? "text-blue-600" : ""
                      }`}
                    />
                  </button>
                </div>
                <div className="border p-4 rounded-lg bg-gray-100 w-full">
                  <p>{item.text}</p>
                  {item.schedule && (
                    <p className="text-xs text-gray-500 mt-1 text-end">
                      {item.schedule}
                    </p>
                  )}
                </div>
                <div>
                  <button onClick={() => setEditingManifest(item)}>
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <PowerAddNewManifest onAddManifest={addManifest} />

          {editingManifest && (
            <SettingsModal
              item={editingManifest}
              onClose={() => setEditingManifest(null)}
              onSave={updateManifest}
            />
          )}
        </Tabs.Content>

        <Tabs.Content value="documents">
          Access and update your documents.
        </Tabs.Content>
        <Tabs.Content value="settings">
          Edit your profile or update contact information.
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
