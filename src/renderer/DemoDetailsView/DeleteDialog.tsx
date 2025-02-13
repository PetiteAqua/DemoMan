import { Button, DialogContentText } from "@mui/material";

import SmallDialog from "../SmallDialog";

type DeleteDialogProps = {
  open: boolean;
  demoName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteDialog(props: DeleteDialogProps) {
  const { open, demoName, onClose, onConfirm } = props;

  return (
    <SmallDialog
      title="Confirm delete"
      open={open}
      onClose={onClose}
      actions={
        <>
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={onConfirm}>
            Delete
          </Button>
        </>
      }
    >
      <DialogContentText>
        Are you sure you want to permanently delete <b>{demoName}</b> and all
        associated events? This cannot be undone.
      </DialogContentText>
    </SmallDialog>
  );
}
