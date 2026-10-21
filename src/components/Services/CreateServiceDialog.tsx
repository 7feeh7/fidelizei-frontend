import { useEffect, useState } from "react";
import { Alert, Box, DialogContent, Stack } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver, useForm } from "react-hook-form";
import ActionButton from "components/ActionButton";
import SimpleDialog from "components/Dialogs/SimpleDialog";
import FastDialogTitle from "components/Dialogs/FastDialogTitle";
import TextField from "components/Forms/TextField";
import {
  CreateServicePayload,
  ServiceListItem,
} from "interfaces/services";
import { createServiceValidator } from "validators/services";

type CreateServiceFormValues = {
  name: string;
  description?: string | null;
  price: number | "";
  durationMinutes?: number | "" | null;
  suggestedReturnDays?: number | "" | null;
};

interface CreateServiceDialogProps {
  open: boolean;
  service?: ServiceListItem | null;
  onClose: () => void;
  onSubmit: (payload: CreateServicePayload) => Promise<void>;
}

function parseOptionalNumber(value: number | "" | null | undefined) {
  if (value === "" || value == null) {
    return null;
  }

  return value;
}

function toFormValues(service?: ServiceListItem | null): CreateServiceFormValues {
  if (!service) {
    return {
      name: "",
      description: "",
      price: "",
      durationMinutes: "",
      suggestedReturnDays: "",
    };
  }

  return {
    name: service.name,
    description: service.description ?? "",
    price: service.price,
    durationMinutes: service.durationMinutes ?? "",
    suggestedReturnDays: service.suggestedReturnDays ?? "",
  };
}

function CreateServiceDialog({
  open,
  service,
  onClose,
  onSubmit,
}: CreateServiceDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = Boolean(service);
  const { control, handleSubmit, reset } = useForm<CreateServiceFormValues>({
    resolver: yupResolver(
      createServiceValidator
    ) as Resolver<CreateServiceFormValues>,
    mode: "onBlur",
    defaultValues: toFormValues(service),
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(service));
    }
  }, [open, service, reset]);

  function handleClose() {
    reset();
    onClose();
  }

  async function submit(data: CreateServiceFormValues) {
    setIsSaving(true);
    try {
      await onSubmit({
        name: data.name,
        description: data.description?.trim() ? data.description.trim() : null,
        price: Number(data.price),
        durationMinutes: parseOptionalNumber(data.durationMinutes),
        suggestedReturnDays: parseOptionalNumber(data.suggestedReturnDays),
      });
      reset();
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
        label={isEditing ? "Editar serviço" : "Novo serviço"}
        closeButton={handleClose}
      />
      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <Stack spacing={2.5}>
            {isEditing ? (
              <Alert severity="info">
                Alterar o nome atualiza também o histórico de atendimentos.
              </Alert>
            ) : null}
            <TextField control={control} name="name" label="Nome" autoFocus />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                control={control}
                name="price"
                label="Preço"
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
                sx={{ flex: 1 }}
              />
              <TextField
                control={control}
                name="suggestedReturnDays"
                label="Dias sugeridos para retorno (opcional)"
                type="number"
                inputProps={{ min: 1, step: 1 }}
                sx={{ flex: 1 }}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                control={control}
                name="durationMinutes"
                label="Duração em minutos (opcional)"
                type="number"
                inputProps={{ min: 1, step: 1 }}
                sx={{ flex: 1 }}
              />
              <TextField
                control={control}
                name="description"
                label="Descrição (opcional)"
                sx={{ flex: 1 }}
              />
            </Stack>
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

export default CreateServiceDialog;
