import { useEffect, useState, useContext } from "react";
import fs from "fs";
import path from "path";

import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  DialogContentText,
  Paper,
  Divider,
} from "@mui/material";

import { formatFileSize } from "../util";
import SmallDialog from "../SmallDialog";
import useStore from "../hooks/useStore";
import DemosContext from "../DemosContext";

type AutoDeleteDialogProps = {
  open: boolean;
  onClose: () => void;
};

type AutoDeleteDialogFileListEntry = {
  fileName: string;
  selected: boolean;
  filesize: number;
};

export default function AutoDeleteDialog(props: AutoDeleteDialogProps) {
  const { open, onClose } = props;
  const [demosPath] = useStore("demo_path");

  const { demos } = useContext(DemosContext);

  const [files, setFiles] = useState<AutoDeleteDialogFileListEntry[]>([]);
  const [numberSelected, setNumberSelected] = useState(0);

  useEffect(() => {
    const findDemosWithoutEventsOrTags = (): string[] =>
      Object.values(demos)
        .filter((demo) => demo.events.length === 0 && demo.tags.length === 0)
        .map((demo) => demo.name);

    if (demosPath === undefined) {
      return;
    }
    const newDemosToDelete = findDemosWithoutEventsOrTags();
    const fileListEntries = newDemosToDelete.map<AutoDeleteDialogFileListEntry>(
      (demoName) => {
        const fileName = `${demoName}.dem`;
        const filesize = fs.statSync(path.join(demosPath, fileName)).size;
        return { fileName, selected: true, filesize };
      }
    );
    setFiles(fileListEntries);
    setNumberSelected(files.length);
  }, [open, demosPath, files.length, demos]);

  const confirm = () => {
    if (demosPath === undefined) {
      onClose();
      return;
    }
    files
      .filter((listEntry: AutoDeleteDialogFileListEntry) => listEntry.selected)
      .map((listEntry: AutoDeleteDialogFileListEntry) =>
        fs.rmSync(path.join(demosPath, listEntry.fileName))
      );
    onClose();
  };

  const handleSelect = (index: number) => {
    files[index].selected = true;
    setFiles(files);
    setNumberSelected(numberSelected + 1);
  };

  const handleDeselect = (index: number) => {
    files[index].selected = false;
    setFiles(files);
    setNumberSelected(numberSelected - 1);
  };

  const selectAll = () => {
    for (let i = 0; i < files.length; i += 1) {
      files[i].selected = true;
    }
    setFiles(files);
    setNumberSelected(files.length);
  };

  const deselectAll = () => {
    for (let i = 0; i < files.length; i += 1) {
      files[i].selected = false;
    }
    setFiles(files);
    setNumberSelected(0);
  };

  const selectedFilesize = () => {
    return files.reduce<number>(
      (sum, f) => (f.selected ? sum + f.filesize : sum),
      0
    );
  };

  if (files.length === 0) {
    return (
      <SmallDialog
        title="Auto-delete demos"
        open={open}
        onClose={onClose}
        actions={
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        }
      >
        <DialogContentText>
          There are no files to auto-delete.
        </DialogContentText>
      </SmallDialog>
    );
  }
  return (
    <SmallDialog
      title="Auto-delete demos"
      open={open}
      onClose={onClose}
      actions={
        <>
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={confirm}
            disabled={numberSelected === 0}
          >
            Delete selected
          </Button>
        </>
      }
    >
      <DialogContentText>
        These are demo files with no events and no tags.
        <br />
        Deselect the ones you want to keep.
      </DialogContentText>
      <Paper variant="outlined">
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Checkbox
                checked={numberSelected === files.length}
                indeterminate={
                  numberSelected !== 0 && numberSelected !== files.length
                }
                disableRipple
                onChange={
                  numberSelected === files.length ? deselectAll : selectAll
                }
              />
            </ListItemIcon>
            <ListItemText
              primary={`${numberSelected} file${
                numberSelected === 1 ? "" : "s"
              } selected (${formatFileSize(selectedFilesize())})`}
            />
          </ListItem>
        </List>
        <Divider />
        <List style={{ maxHeight: "200px", overflow: "overlay" }} dense>
          {files.map((file, index) => (
            <ListItem
              button
              onClick={() => {
                (file.selected ? handleDeselect : handleSelect)(index);
              }}
              key={file.fileName}
            >
              <ListItemIcon>
                <Checkbox checked={file.selected} disableRipple />
              </ListItemIcon>
              <ListItemText primary={file.fileName} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </SmallDialog>
  );
}
