import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface PowerAddNewManifestProps {
  onAddManifest: (text: string) => void;
}

export default function PowerAddNewManifest({
  onAddManifest,
}: PowerAddNewManifestProps) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    onAddManifest(text);
    setText("");
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="w-16 h-16 rounded-full border cursor-pointer ml-auto mt-8 border-gray-300 flex flex-col items-center justify-center">
            <Plus className="w-10 h-10" />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[600px] w-full">
          <DialogHeader>
            <DialogTitle>Add New Manifest</DialogTitle>
          </DialogHeader>
          <div>
            <DialogTitle className="mb-2 text-sm">
              Enter your manifesto
            </DialogTitle>
            <textarea
              className="border outline-none p-4 rounded-lg bg-gray-100 w-full !max-h-28"
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>
          <DialogClose asChild>
            <Button className="w-20 ml-auto" onClick={handleAdd}>
              Add
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
