import { useEffect, useMemo, useState } from "react";
import {
  DialogContent,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ActionButton from "components/ActionButton";
import SimpleDialog from "components/Dialogs/SimpleDialog";
import FastDialogTitle from "components/Dialogs/FastDialogTitle";
import { CustomerListItem } from "interfaces/customers";
import { MessageTemplateListItem } from "interfaces/messageTemplates";
import { messageTemplateServices } from "services/messageTemplates";
import { useQuery } from "react-query";

type MessageSource = "template" | "freeText";

interface SendCustomerMessageDialogProps {
  open: boolean;
  customer: Pick<CustomerListItem, "id" | "name"> | null;
  templates: MessageTemplateListItem[];
  onClose: () => void;
  onSubmit: (payload: {
    templateId?: string;
    content?: string;
  }) => Promise<void>;
}

function SendCustomerMessageDialog({
  open,
  customer,
  templates,
  onClose,
  onSubmit,
}: SendCustomerMessageDialogProps) {
  const [source, setSource] = useState<MessageSource>("template");
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const activeTemplates = useMemo(
    () => templates.filter((item) => item.active),
    [templates]
  );

  const { data: previewData, isFetching: isPreviewLoading } = useQuery(
    ["message-preview", customer?.id, templateId],
    () =>
      messageTemplateServices.preview({
        templateId: templateId ?? undefined,
        customerId: customer?.id,
      }),
    {
      enabled: open && source === "template" && Boolean(templateId && customer),
    }
  );

  useEffect(() => {
    setPreview(previewData?.preview ?? "");
  }, [previewData]);

  useEffect(() => {
    if (!open) {
      return;
    }
    setSource("template");
    setTemplateId(activeTemplates[0]?.id ?? null);
    setContent("");
    setPreview("");
  }, [open, activeTemplates]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!customer) {
      return;
    }

    setIsSaving(true);
    try {
      if (source === "template") {
        if (!templateId) {
          return;
        }
        await onSubmit({ templateId });
      } else {
        await onSubmit({ content: content.trim() });
      }
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SimpleDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <FastDialogTitle
          label={`Enviar mensagem — ${customer?.name ?? ""}`}
          closeButton={onClose}
        />
        <DialogContent>
          <Stack spacing={2}>
            <RadioGroup
              value={source}
              onChange={(_, value) => setSource(value as MessageSource)}
            >
              <FormControlLabel
                value="template"
                control={<Radio />}
                label="Usar modelo"
              />
              <FormControlLabel
                value="freeText"
                control={<Radio />}
                label="Texto livre"
              />
            </RadioGroup>

            {source === "template" ? (
              <>
                <FormControl fullWidth size="small">
                  <InputLabel id="message-template-label">Modelo</InputLabel>
                  <Select
                    labelId="message-template-label"
                    label="Modelo"
                    value={templateId ?? ""}
                    onChange={(event) =>
                      setTemplateId(String(event.target.value))
                    }
                  >
                    {activeTemplates.map((template) => (
                      <MenuItem key={template.id} value={template.id}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="body2" color="text.secondary">
                  Prévia
                </Typography>
                <Typography variant="body2" whiteSpace="pre-wrap">
                  {isPreviewLoading ? "Carregando..." : preview || "—"}
                </Typography>
              </>
            ) : (
              <TextField
                label="Texto da mensagem"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                multiline
                minRows={4}
                required
                fullWidth
              />
            )}
          </Stack>
        </DialogContent>
        <ActionButton
          rejectMsg="Cancelar"
          resolveMsg="Adicionar à fila"
          resolveType="submit"
          resolveLoading={isSaving}
          onReject={onClose}
        />
      </form>
    </SimpleDialog>
  );
}

export default SendCustomerMessageDialog;
