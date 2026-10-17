import { DialogActions, DialogContent, Typography } from "@mui/material";
import BooleanAction, { ActionButtonBaseProps } from "./BooleanAction";
import FastDialogTitle from "./FastDialogTitle";
import SimpleDialog, { SimpleDialogProps } from "./SimpleDialog";

interface ConfirmDialogProps
  extends Omit<SimpleDialogProps, "onClose">,
    ActionButtonBaseProps {
  confirmTitle: string;
  confirmSubtitle?: string;
  onClose: () => void;
  danger?: boolean;
}
function ConfirmDialog({
  open,
  sx,
  style,
  confirmTitle,
  confirmSubtitle,
  danger,
  onClose,
  ...actionProps
}: ConfirmDialogProps) {
  return (
    <SimpleDialog open={open} sx={sx} style={style} onClose={onClose}>
      <FastDialogTitle label="Confirmação" closeButton={onClose} />
      <DialogContent>
        <Typography
          fontSize={24}
          fontWeight={700}
          color={danger ? "error" : undefined}
        >
          {confirmTitle}
        </Typography>
        {confirmSubtitle && <Typography>{confirmSubtitle}</Typography>}
      </DialogContent>
      <DialogActions>
        <BooleanAction {...actionProps} />
      </DialogActions>
    </SimpleDialog>
  );
}

export default ConfirmDialog;
