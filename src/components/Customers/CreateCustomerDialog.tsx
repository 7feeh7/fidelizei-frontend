import { useState } from "react";
import { Box, DialogContent, Stack } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver, useForm } from "react-hook-form";
import ActionButton from "components/ActionButton";
import SimpleDialog from "components/Dialogs/SimpleDialog";
import FastDialogTitle from "components/Dialogs/FastDialogTitle";
import AutoCompleteField from "components/Forms/AutoCompleteField";
import TextField from "components/Forms/TextField";
import { CreateCustomerPayload } from "interfaces/customers";
import {
  LEAD_SOURCE_OPTIONS,
  LeadSource,
  createCustomerValidator,
} from "validators/customers";

type CreateCustomerFormValues = {
  name: string;
  phone: string;
  leadSource?: LeadSource;
  dateOfBirth?: string | null;
};

interface CreateCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCustomerPayload) => Promise<void>;
}

function CreateCustomerDialog({
  open,
  onClose,
  onSubmit,
}: CreateCustomerDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<CreateCustomerFormValues>({
    resolver: yupResolver(
      createCustomerValidator
    ) as Resolver<CreateCustomerFormValues>,
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
      leadSource: undefined,
      dateOfBirth: null,
    },
  });

  function handleClose() {
    reset();
    onClose();
  }

  async function submit(data: CreateCustomerFormValues) {
    setIsSaving(true);
    try {
      await onSubmit({
        name: data.name,
        phone: data.phone.replace(/\D/g, ""),
        leadSource: data.leadSource as LeadSource,
        dateOfBirth: data.dateOfBirth || null,
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
      <FastDialogTitle label="Novo cliente" closeButton={handleClose} />
      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <Stack spacing={2.5}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                control={control}
                name="name"
                label="Nome"
                autoFocus
                sx={{ flex: 1 }}
              />
              <TextField
                control={control}
                name="phone"
                label="WhatsApp"
                placeholder="11999998888"
                sx={{ flex: 1 }}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <AutoCompleteField
                  control={control}
                  name="leadSource"
                  label="Como conheceu o salão"
                  options={LEAD_SOURCE_OPTIONS}
                />
              </Box>
              <TextField
                control={control}
                name="dateOfBirth"
                label="Aniversário (opcional)"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1 }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <ActionButton
          rejectMsg="Cancelar"
          resolveMsg="Salvar"
          resolveType="submit"
          resolveLoading={isSaving}
          onReject={handleClose}
        />
      </form>
    </SimpleDialog>
  );
}

export default CreateCustomerDialog;
