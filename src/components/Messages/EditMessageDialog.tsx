import { useEffect, useState } from "react";
import { DialogContent, Stack, TextField } from "@mui/material";
import ActionButton from "components/ActionButton";
import SimpleDialog from "components/Dialogs/SimpleDialog";
import FastDialogTitle from "components/Dialogs/FastDialogTitle";
import { MessageListItem } from "interfaces/messages";

interface EditMessageDialogProps {
  open: boolean;
  message: MessageListItem | null;
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
}

function EditMessageDialog({
  open,
  message,
  onClose,
  onSubmit,
}: EditMessageDialogProps) {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setContent(message?.content ?? "");
  }, [message]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await onSubmit(content.trim());
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SimpleDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <FastDialogTitle label="Editar mensagem" closeButton={onClose} />
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Texto da mensagem"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              multiline
              minRows={4}
              required
              fullWidth
            />
          </Stack>
        </DialogContent>
        <ActionButton
          rejectMsg="Cancelar"
          resolveMsg="Salvar"
          resolveType="submit"
          resolveLoading={isSaving}
          onReject={onClose}
        />
      </form>
    </SimpleDialog>
  );
}

export default EditMessageDialog;
