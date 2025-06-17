import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const ModelRejection = ({
  modelRejectionMessage,
  showAlertDialog,
  setShowAlertDialog,
}: {
  modelRejectionMessage: string;
  showAlertDialog: boolean;
  setShowAlertDialog: (value: boolean) => void;
}) => {
  return (
    <AlertDialog open={showAlertDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {modelRejectionMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setShowAlertDialog(false);
            }}
          >
            No
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
