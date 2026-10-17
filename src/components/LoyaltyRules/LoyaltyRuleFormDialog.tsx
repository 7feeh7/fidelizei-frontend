import { useEffect, useMemo, useState } from "react";
import { Box, DialogContent, Stack, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver, useForm, useWatch } from "react-hook-form";
import ActionButton from "components/ActionButton";
import SimpleDialog from "components/Dialogs/SimpleDialog";
import FastDialogTitle from "components/Dialogs/FastDialogTitle";
import AutoCompleteField from "components/Forms/AutoCompleteField";
import TextField from "components/Forms/TextField";
import {
  LoyaltyRewardType,
  LoyaltyRuleListItem,
  LoyaltyRulePayload,
  LoyaltyTriggerType,
} from "interfaces/loyaltyRules";
import { ServiceListItem } from "interfaces/services";
import {
  buildLoyaltyRulePreview,
  LOYALTY_REWARD_OPTIONS,
  LOYALTY_TRIGGER_OPTIONS,
} from "utils/loyaltyRulePresentation";
import { loyaltyRuleValidator } from "validators/loyaltyRules";

type LoyaltyRuleFormValues = {
  name: string;
  description?: string | null;
  triggerType: LoyaltyTriggerType | "";
  visitCount?: number | "" | null;
  rewardType: LoyaltyRewardType | "";
  rewardValue?: number | "" | null;
  freeServiceId?: string | null;
  validDays?: number | "" | null;
};

interface LoyaltyRuleFormDialogProps {
  open: boolean;
  rule?: LoyaltyRuleListItem | null;
  services: ServiceListItem[];
  onClose: () => void;
  onSubmit: (payload: LoyaltyRulePayload) => Promise<void>;
}

function parseOptionalNumber(value: number | "" | null | undefined) {
  if (value === "" || value == null) {
    return null;
  }

  return value;
}

function toFormValues(rule?: LoyaltyRuleListItem | null): LoyaltyRuleFormValues {
  if (!rule) {
    return {
      name: "",
      description: "",
      triggerType: "",
      visitCount: "",
      rewardType: "",
      rewardValue: "",
      freeServiceId: null,
      validDays: "",
    };
  }

  return {
    name: rule.name,
    description: rule.description ?? "",
    triggerType: rule.triggerType,
    visitCount: rule.visitCount ?? "",
    rewardType: rule.rewardType,
    rewardValue: rule.rewardValue ?? "",
    freeServiceId: rule.freeServiceId,
    validDays: rule.validDays ?? "",
  };
}

function LoyaltyRuleFormDialog({
  open,
  rule,
  services,
  onClose,
  onSubmit,
}: LoyaltyRuleFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = Boolean(rule);
  const { control, handleSubmit, reset } = useForm<LoyaltyRuleFormValues>({
    resolver: yupResolver(
      loyaltyRuleValidator
    ) as Resolver<LoyaltyRuleFormValues>,
    mode: "onBlur",
    defaultValues: toFormValues(rule),
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(rule));
    }
  }, [open, rule, reset]);

  const watched = useWatch({ control });

  const activeServices = useMemo(
    () => services.filter((service) => service.active),
    [services]
  );

  const serviceOptions = useMemo(
    () =>
      activeServices.map((service) => ({
        label: service.name,
        value: service.id,
      })),
    [activeServices]
  );

  const selectedServiceName = useMemo(() => {
    if (!watched.freeServiceId) {
      return null;
    }

    return (
      activeServices.find((service) => service.id === watched.freeServiceId)
        ?.name ?? rule?.freeServiceName ?? null
    );
  }, [activeServices, watched.freeServiceId, rule?.freeServiceName]);

  const preview = buildLoyaltyRulePreview({
    triggerType: watched.triggerType ?? "",
    visitCount: parseOptionalNumber(watched.visitCount),
    rewardType: watched.rewardType ?? "",
    rewardValue: parseOptionalNumber(watched.rewardValue),
    freeServiceName: selectedServiceName,
    validDays: parseOptionalNumber(watched.validDays),
  });

  function handleClose() {
    reset(toFormValues(null));
    onClose();
  }

  async function submit(data: LoyaltyRuleFormValues) {
    setIsSaving(true);
    try {
      await onSubmit({
        name: data.name,
        description: data.description?.trim() ? data.description.trim() : null,
        triggerType: data.triggerType as LoyaltyTriggerType,
        visitCount: parseOptionalNumber(data.visitCount),
        rewardType: data.rewardType as LoyaltyRewardType,
        rewardValue: parseOptionalNumber(data.rewardValue),
        freeServiceId: data.freeServiceId ?? null,
        validDays: parseOptionalNumber(data.validDays),
      });
      reset(toFormValues(null));
    } finally {
      setIsSaving(false);
    }
  }

  const showVisitCount = watched.triggerType === "VISIT_COUNT";
  const showRewardValue =
    watched.rewardType === "PERCENT_DISCOUNT" ||
    watched.rewardType === "FIXED_DISCOUNT";
  const showFreeService = watched.rewardType === "FREE_SERVICE";

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
        label={isEditing ? "Editar regra" : "Nova regra"}
        closeButton={handleClose}
      />
      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <Stack spacing={2.5}>
            <TextField control={control} name="name" label="Nome" autoFocus />
            <TextField
              control={control}
              name="description"
              label="Descrição (opcional)"
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <AutoCompleteField
                  control={control}
                  name="triggerType"
                  label="Gatilho"
                  options={LOYALTY_TRIGGER_OPTIONS}
                />
              </Box>
              {showVisitCount ? (
                <TextField
                  control={control}
                  name="visitCount"
                  label="Conceder na visita nº"
                  type="number"
                  inputProps={{ min: 2, step: 1 }}
                  sx={{ flex: 1 }}
                />
              ) : null}
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <AutoCompleteField
                  control={control}
                  name="rewardType"
                  label="Recompensa"
                  options={LOYALTY_REWARD_OPTIONS}
                />
              </Box>
              {showRewardValue ? (
                <TextField
                  control={control}
                  name="rewardValue"
                  label={
                    watched.rewardType === "PERCENT_DISCOUNT"
                      ? "Percentual"
                      : "Valor (R$)"
                  }
                  type="number"
                  inputProps={{
                    min: watched.rewardType === "PERCENT_DISCOUNT" ? 0 : 0.01,
                    max:
                      watched.rewardType === "PERCENT_DISCOUNT" ? 100 : undefined,
                    step: watched.rewardType === "PERCENT_DISCOUNT" ? 1 : "0.01",
                  }}
                  sx={{ flex: 1 }}
                />
              ) : null}
              {showFreeService ? (
                <Box sx={{ flex: 1 }}>
                  <AutoCompleteField
                    control={control}
                    name="freeServiceId"
                    label="Serviço grátis"
                    options={serviceOptions}
                  />
                </Box>
              ) : null}
            </Stack>
            <TextField
              control={control}
              name="validDays"
              label="Validade em dias (opcional)"
              type="number"
              inputProps={{ min: 1, step: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {preview}
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

export default LoyaltyRuleFormDialog;
