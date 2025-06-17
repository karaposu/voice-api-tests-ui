import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useVisualSettingsModalStore } from "@/hooks/VisualSettingsModalStore";
import { Label } from "../ui/label";

export const VisualSettings = () => {
  const {
    showSqlBox,
    setShowSqlBox,
    showRawData,
    setShowRawData,
    showTidyData,
    setShowTidyData,
    showTableData,
    setShowTableData,
  } = useVisualSettingsModalStore();

  return (
    <Dialog>
      <DialogTrigger className="bg-muted text-muted-foreground p-1 rounded-lg h-9 border hover:bg-muted/30">
        <Settings size={24} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Visual Settings</DialogTitle>
          <DialogDescription>
            Change the visual settings of the app.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4">
          <div className="flex gap-x-4">
            <label
              htmlFor="sqlBox"
              className="col-span-8 text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show SQL Box:
            </label>
            <Checkbox
              id="sqlBox"
              className="col-span-4"
              checked={showSqlBox}
              onCheckedChange={(checked: boolean) => setShowSqlBox(checked)}
            />
          </div>

          <div className="flex  justify-start">
            <label className="col-span-8 text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Show Data as:
            </label>
            <br />
            <div className="flex flex-col  ">
              <div className="invisible">
                <Checkbox />
              </div>
              <div className="flex gap-x-2 pb-2">
                <Checkbox
                  id="raw"
                  checked={showRawData}
                  onCheckedChange={(checked: boolean) =>
                    setShowRawData(checked)
                  }
                />
                <Label
                  htmlFor="raw"
                  className="col-span-8 text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Raw
                </Label>
              </div>
              <div className="flex gap-x-2 py-2">
                <Checkbox
                  id="tidy"
                  checked={showTidyData}
                  onCheckedChange={(checked: boolean) =>
                    setShowTidyData(checked)
                  }
                />
                <Label
                  htmlFor="tidy"
                  className="col-span-8 text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Tidy
                </Label>
              </div>
              <div className="flex gap-x-2 py-2">
                <Checkbox
                  id="table"
                  checked={showTableData}
                  onCheckedChange={(checked: boolean) =>
                    setShowTableData(checked)
                  }
                />
                <Label
                  htmlFor="table"
                  className="col-span-8 text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Table
                </Label>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
