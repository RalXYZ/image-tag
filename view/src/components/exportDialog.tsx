import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function ExportDialog(props: {
  open: boolean;
  dataSet;
  setClose: () => any;
  setDataSet: (name: any) => any;
  exportDataSet: () => any;
}) {
  return (
    <Dialog
      open={props.open}
      onClose={() => props.setClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Choose a Data Set"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Please choose a data set to export.
        </DialogContentText>
      </DialogContent>
      <FormControl sx={{ mt: 2, width: 120, margin: "0 auto" }}>
        <InputLabel htmlFor="data-set">Data Set</InputLabel>
        <Select
          autoFocus
          value={props.dataSet}
          onChange={(e) => props.setDataSet(e.target.value as "coco" | "voc")}
          label="dataSet"
          inputProps={{
            name: "data-set",
            id: "data-set",
          }}
        >
          <MenuItem value="coco">COCO</MenuItem>
          <MenuItem value="voc">VOC</MenuItem>
        </Select>
      </FormControl>
      <DialogActions>
        <Button onClick={() => props.setClose()}>Cancel</Button>
        <Button
          onClick={() => {
            props.setClose();
            props.exportDataSet();
          }}
          autoFocus
        >
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
}
