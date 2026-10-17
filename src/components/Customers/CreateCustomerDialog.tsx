import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Checkbox,
  DialogContent,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, Resolver, useForm, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import ActionButton from "components/ActionButton";
import CustomerMessagesPanel from "components/Customers/CustomerMessagesPanel";
import CustomerRewardsPanel from "components/Customers/CustomerRewardsPanel";
import { RoundedButton } from "components/Button/RoundedButton";
import SimpleDialog from "components/Dialogs/SimpleDialog";
import FastDialogTitle from "components/Dialogs/FastDialogTitle";
import AutoCompleteField from "components/Forms/AutoCompleteField";
import TextField from "components/Forms/TextField";
import { CreateCustomerPayload, CustomerListItem } from "interfaces/customers";
import { customerServices } from "services/customers";
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
  referrerId?: string | null;
  isExistingCustomer?: boolean;
};

interface CreateCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCustomerPayload) => Promise<void>;
  customer?: CustomerListItem | null;
  onSendMessage?: () => void;
}

function formatDateOfBirth(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return value.slice(0, 10);
}

function CreateCustomerDialog({
  open,
  onClose,
  onSubmit,
  customer = null,
  onSendMessage,
}: CreateCustomerDialogProps) {
  const isEditing = Boolean(customer);
  const hasExistingReferrer = Boolean(customer?.referrerId);
  const [isSaving, setIsSaving] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<CreateCustomerFormValues>({
    resolver: yupResolver(
      createCustomerValidator
    ) as Resolver<CreateCustomerFormValues>,
    context: { hasExistingReferrer },
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
      leadSource: undefined,
      dateOfBirth: null,
      referrerId: null,
      isExistingCustomer: false,
    },
  });

  const leadSource = useWatch({ control, name: "leadSource" });

  const { data: customersData, isLoading: isLoadingCustomers } = useQuery(
    ["customers-options"],
    () => customerServices.list({ page: 1 }),
    { enabled: open }
  );

  const referrerOptions = useMemo(
    () =>
      (customersData?.data ?? [])
        .filter((entry) => entry.id !== customer?.id)
        .map((entry) => ({
          label: entry.name,
          value: entry.id,
        })),
    [customersData, customer?.id]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    if (customer) {
      reset({
        name: customer.name,
        phone: customer.phone,
        leadSource: customer.leadSource,
        dateOfBirth: formatDateOfBirth(customer.dateOfBirth),
        referrerId: customer.referrerId,
      });
      return;
    }

    reset({
      name: "",
      phone: "",
      leadSource: undefined,
      dateOfBirth: null,
      referrerId: null,
      isExistingCustomer: false,
    });
  }, [open, customer, reset]);

  function handleClose() {
    reset();
    onClose();
  }

  async function submit(data: CreateCustomerFormValues) {
    setIsSaving(true);
    try {
      const payload: CreateCustomerPayload = {
        name: data.name,
        phone: data.phone.replace(/\D/g, ""),
        leadSource: data.leadSource as LeadSource,
        dateOfBirth: data.dateOfBirth || null,
      };

      if (
        data.leadSource === "INDICACAO" &&
        data.referrerId &&
        !hasExistingReferrer
      ) {
        payload.referrerId = data.referrerId;
      }

      if (!isEditing && data.isExistingCustomer) {
        payload.isExistingCustomer = true;
      }

      await onSubmit(payload);
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
        label={isEditing ? "Editar cliente" : "Novo cliente"}
        closeButton={handleClose}
      />
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
            {leadSource === "INDICACAO" && (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <AutoCompleteField
                  control={control}
                  name="referrerId"
                  label="Indicado por"
                  placeholder="Busque o cliente que indicou"
                  options={referrerOptions}
                  loading={isLoadingCustomers}
                  disabled={hasExistingReferrer}
                />
              </Box>
            )}
            {!isEditing && (
              <Controller
                control={control}
                name="isExistingCustomer"
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(field.value)}
                        onChange={(_, checked) => field.onChange(checked)}
                      />
                    }
                    label="Já é cliente (cadastro retroativo — não concede benefício de primeira visita)"
                  />
                )}
              />
            )}
            {isEditing && (
              <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">
                  Indicado por: {customer?.referrerName ?? "—"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Indicações feitas: {customer?.referralsMadeCount ?? 0}
                </Typography>
              </Stack>
            )}
            {isEditing && customer && onSendMessage && (
              <RoundedButton onClick={onSendMessage} sx={{ alignSelf: "flex-start" }}>
                Enviar mensagem
              </RoundedButton>
            )}
            {isEditing && customer && (
              <CustomerRewardsPanel customerId={customer.id} />
            )}
            {isEditing && customer && (
              <CustomerMessagesPanel customerId={customer.id} />
            )}
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

export default CreateCustomerDialog;
