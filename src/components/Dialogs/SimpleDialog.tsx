import * as React from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import { mainTransition } from "./transition";
import { SxProps, Theme } from "@mui/material";

export interface SimpleDialogProps
  extends Pick<DialogProps, "maxWidth" | "fullWidth"> {
  sx?: SxProps<Theme>;
  style?: React.CSSProperties;
  open: boolean;
  onClose?: DialogProps["onClose"];
}

function SimpleDialog(props: React.PropsWithChildren<SimpleDialogProps>) {
  return (
    <Dialog {...props} TransitionComponent={mainTransition}>
      {props.children}
    </Dialog>
  );
}

export default SimpleDialog;
