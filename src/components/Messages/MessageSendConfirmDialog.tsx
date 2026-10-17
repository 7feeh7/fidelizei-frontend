import { DialogActions, DialogContent, Typography } from "@mui/material";
import BooleanAction from "components/Dialogs/BooleanAction";
import FastDialogTitle from "components/Dialogs/FastDialogTitle";
import SimpleDialog from "components/Dialogs/SimpleDialog";
import { MessageListItem } from "interfaces/messages";

interface MessageSendConfirmDialogProps {
  open: boolean;
  message: MessageListItem | null;
  onClose: () => void;
  onConfirmSent: () => Promise<void>;
}

function MessageSendConfirmDialog({
  open,
  message,
  onClose,
  onConfirmSent,
}: MessageSendConfirmDialogProps) {
  return (
    <SimpleDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <FastDialogTitle label="Confirmação de envio" closeButton={onClose} />
      <DialogContent>
        <Typography fontWeight={700} gutterBottom>
          Você enviou a mensagem para {message?.customerName}?
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Se ainda não enviou, escolha &quot;Não enviada&quot; para manter a
          mensagem na fila.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <BooleanAction
          rejectMsg="Não enviada"
          resolveMsg="Enviada"
          onReject={onClose}
          onResolve={onConfirmSent}
        />
      </DialogActions>
    </SimpleDialog>
  );
}

export default MessageSendConfirmDialog;
