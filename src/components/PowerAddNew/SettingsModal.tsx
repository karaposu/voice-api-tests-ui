import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

type Props = {
  item: {
    id: number;
    text: string;
    schedule?: string;
  };
  onSave: (id: number, newText: string, newSchedule: string) => void;
  onClose: () => void;
};

export default function SettingsModal({ item, onSave, onClose }: Props) {
  const [text, setText] = useState(item.text);
  const [schedule, setSchedule] = useState(item.schedule || "");

  useEffect(() => {
    setText(item.text);
    setSchedule(item.schedule || "");
  }, [item]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] w-full">
        <DialogHeader>
          <DialogTitle>Edit Manifest</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium">Manifest Text</label>
            <textarea
              className="border outline-none p-3 rounded-md w-full bg-gray-100"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Schedule</label>
            <input
              type="text"
              placeholder="e.g., 7 AM, Every Tuesday"
              className="border outline-none p-3 rounded-md w-full bg-gray-100"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSave(item.id, text, schedule)}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
