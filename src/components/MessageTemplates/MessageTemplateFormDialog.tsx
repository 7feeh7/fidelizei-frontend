import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver, useForm, useWatch } from "react-hook-form";
import ActionButton from "components/ActionButton";
import SimpleDialog from "components/Dialogs/SimpleDialog";
import FastDialogTitle from "components/Dialogs/FastDialogTitle";
import AutoCompleteField from "components/Forms/AutoCompleteField";
import TextField from "components/Forms/TextField";
import {
  MessageTemplateListItem,
  MessageTemplatePayload,
  MessageTemplateType,
  UpdateMessageTemplatePayload,
} from "interfaces/messageTemplates";
import { CustomerListItem } from "interfaces/customers";
import { messageTemplateServices } from "services/messageTemplates";
import {
  MESSAGE_TEMPLATE_TYPE_OPTIONS,
  MESSAGE_TEMPLATE_VARIABLES,
} from "utils/messageTemplatePresentation";
import { messageTemplateValidator } from "validators/messageTemplates";

type MessageTemplateFormValues = {
  name: string;
  type: MessageTemplateType | "";
  content: string;
  previewCustomerId?: string | null;
};

interface MessageTemplateFormDialogProps {
  open: boolean;
  template?: MessageTemplateListItem | null;
  customers: CustomerListItem[];
  onClose: () => void;
  onSubmit: (
    payload: MessageTemplatePayload | UpdateMessageTemplatePayload,
    isEditing: boolean
  ) => Promise<void>;
}

function toFormValues(
  template?: MessageTemplateListItem | null
): MessageTemplateFormValues {
  if (!template) {
    return {
      name: "",
      type: "",
      content: "",
      previewCustomerId: null,
    };
  }

  return {
    name: template.name,
    type: template.type,
    content: template.content,
    previewCustomerId: null,
  };
}

function MessageTemplateFormDialog({
  open,
  template,
  customers,
  onClose,
  onSubmit,
}: MessageTemplateFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [preview, setPreview] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const isEditing = Boolean(template);

  const { control, handleSubmit, reset, setValue, getValues } =
    useForm<MessageTemplateFormValues>({
      resolver: yupResolver(messageTemplateValidator) as Resolver<MessageTemplateFormValues>,
      mode: "onBlur",
      defaultValues: toFormValues(template),
    });

  useEffect(() => {
    if (open) {
      reset(toFormValues(template));
      setPreview("");
    }
  }, [open, template, reset]);

  const watched = useWatch({ control });

  const customerOptions = useMemo(
    () =>
      customers.map((customer) => ({
        label: customer.name,
        value: customer.id,
      })),
    [customers]
  );

  const loadPreview = useCallback(async () => {
    const content = watched.content?.trim();
    if (!content) {
      setPreview("");
      return;
    }

    setIsPreviewLoading(true);
    try {
      const result = await messageTemplateServices.preview({
        content,
        templateId: template?.id,
        customerId: watched.previewCustomerId ?? undefined,
      });
      setPreview(result.preview);
    } catch {
      setPreview("");
    } finally {
      setIsPreviewLoading(false);
    }
  }, [template?.id, watched.content, watched.previewCustomerId]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timeout = setTimeout(() => {
      void loadPreview();
    }, 400);

    return () => clearTimeout(timeout);
  }, [open, loadPreview]);

  function insertVariable(variableKey: string) {
    const token = `{${variableKey}}`;
    const current = getValues("content") ?? "";
    setValue("content", `${current}${current ? " " : ""}${token}`, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleClose() {
    reset(toFormValues(null));
    onClose();
  }

  async function submit(values: MessageTemplateFormValues) {
    setIsSaving(true);
    try {
      if (isEditing) {
        await onSubmit(
          {
            name: values.name,
            content: values.content,
          },
          true
        );
      } else {
        await onSubmit(
          {
            name: values.name,
            type: values.type as MessageTemplateType,
            content: values.content,
          },
          false
        );
      }
      reset(toFormValues(null));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SimpleDialog
      open={open}
      maxWidth="md"
      fullWidth
      onClose={(_, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
    >
      <FastDialogTitle
        label={isEditing ? "Editar modelo" : "Novo modelo"}
        closeButton={handleClose}
      />
      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <Stack spacing={2.5}>
            <TextField control={control} name="name" label="Nome" autoFocus />
            {!isEditing && (
              <AutoCompleteField
                control={control}
                name="type"
                label="Tipo"
                options={MESSAGE_TEMPLATE_TYPE_OPTIONS}
              />
            )}
            <TextField
              control={control}
              name="content"
              label="Mensagem"
              multiline
              minRows={5}
              rounded={false}
            />
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Inserir variável
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {MESSAGE_TEMPLATE_VARIABLES.map((variable) => (
                  <Chip
                    key={variable.key}
                    label={variable.label}
                    size="small"
                    onClick={() => insertVariable(variable.key)}
                    clickable
                  />
                ))}
              </Stack>
            </Box>
            <AutoCompleteField
              control={control}
              name="previewCustomerId"
              label="Pré-visualizar com cliente (opcional)"
              options={customerOptions}
            />
            <Typography variant="body2" color="text.secondary">
              {isPreviewLoading
                ? "Gerando pré-visualização..."
                : preview || "Digite a mensagem para ver a pré-visualização."}
            </Typography>
          </Stack>
        </DialogContent>
        <Box sx={{ px: 3, pb: 3 }}>
          <ActionButton
            rejectMsg="Cancelar"
            resolveMsg="Salvar"
            resolveType="submit"
            resolveLoading={isSaving}
            onReject={handleClose}
          />
        </Box>
      </form>
    </SimpleDialog>
  );
}

export default MessageTemplateFormDialog;
