import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { RoundedButton } from "components/Button/RoundedButton";
import ConfirmDialog from "components/Dialogs/ConfirmDialog";
import SimpleDialog from "components/Dialogs/SimpleDialog";
import FastDialogTitle from "components/Dialogs/FastDialogTitle";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "components/Tables";
import { useSnackbarContext } from "contexts/SnackbarContext";
import {
  CustomerRewardListItem,
  CustomerRewardStatus,
} from "interfaces/customerRewards";
import { customerRewardServices } from "services/customerRewards";
import { getNextPageParam } from "utils/query";
import { loyaltyRuleServices } from "services/loyaltyRules";
import { getApiErrorMessage } from "utils/apiError";
import { formatGrantedRewardsMessage } from "utils/grantedRewardsMessage";

const STATUS_TABS: Array<{
  value: CustomerRewardStatus | "ALL";
  label: string;
}> = [
  { value: "ALL", label: "Todos" },
  { value: "AVAILABLE", label: "Disponíveis" },
  { value: "USED", label: "Usados" },
  { value: "EXPIRED", label: "Expirados" },
  { value: "CANCELED", label: "Cancelados" },
];

const STATUS_LABELS: Record<CustomerRewardStatus, string> = {
  AVAILABLE: "Disponível",
  USED: "Usado",
  EXPIRED: "Expirado",
  CANCELED: "Cancelado",
};

function formatValidity(reward: CustomerRewardListItem) {
  if (reward.status === "USED" && reward.usedAt) {
    return `Usado em ${new Date(reward.usedAt).toLocaleDateString("pt-BR")}`;
  }

  if (reward.expiresAt) {
    return `Válido até ${new Date(reward.expiresAt).toLocaleDateString("pt-BR")}`;
  }

  return "Sem validade";
}

interface CustomerRewardsPanelProps {
  customerId: string;
  grantDialogOpen?: boolean;
  onGrantDialogClose?: () => void;
  showGrantButton?: boolean;
}

function CustomerRewardsPanel({
  customerId,
  grantDialogOpen = false,
  onGrantDialogClose,
  showGrantButton = true,
}: CustomerRewardsPanelProps) {
  const [statusFilter, setStatusFilter] = useState<
    CustomerRewardStatus | "ALL"
  >("ALL");
  const [grantOpen, setGrantOpen] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState("");
  const [rewardToCancel, setRewardToCancel] =
    useState<CustomerRewardListItem | null>(null);
  const queryClient = useQueryClient();
  const { snackSuccess, snackError } = useSnackbarContext();

  useEffect(() => {
    if (grantDialogOpen) {
      setGrantOpen(true);
    }
  }, [grantDialogOpen]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["customer-rewards", customerId, statusFilter],
    ({ pageParam = 1 }) =>
      customerRewardServices.list(customerId, {
        page: pageParam,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      }),
    {
      enabled: Boolean(customerId),
      getNextPageParam,
    }
  );

  const { data: loyaltyRulesData } = useQuery(
    ["loyalty-rules-grant"],
    () => loyaltyRuleServices.list(),
    { enabled: grantOpen }
  );

  const rewards = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const activeRuleOptions = useMemo(
    () =>
      (loyaltyRulesData?.data ?? [])
        .filter((rule) => rule.active)
        .map((rule) => ({
          id: rule.id,
          label: rule.name,
        })),
    [loyaltyRulesData]
  );

  const grantMutation = useMutation(
    (loyaltyRuleId: string) =>
      customerRewardServices.grantManual(customerId, loyaltyRuleId),
    {
      onSuccess: async (response) => {
        await queryClient.invalidateQueries(["customer-rewards", customerId]);
        await queryClient.invalidateQueries(["customer-summary", customerId]);
        snackSuccess(
          formatGrantedRewardsMessage([
            {
              id: response.reward.id,
              ruleName: response.reward.ruleName,
              rewardSummary: response.reward.rewardSummary,
              preview: response.reward.preview,
            },
          ]) || "Benefício concedido."
        );
        setGrantOpen(false);
        setSelectedRuleId("");
      },
    }
  );

  const cancelMutation = useMutation(
    (rewardId: string) => customerRewardServices.cancel(customerId, rewardId),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["customer-rewards", customerId]);
        await queryClient.invalidateQueries(["customer-summary", customerId]);
        snackSuccess("Benefício cancelado.");
        setRewardToCancel(null);
      },
    }
  );

  async function handleGrant() {
    if (!selectedRuleId) {
      snackError("Selecione a regra de fidelidade.");
      return;
    }

    try {
      await grantMutation.mutateAsync(selectedRuleId);
    } catch (error) {
      snackError(
        getApiErrorMessage(error, "Não foi possível conceder o benefício."),
        error
      );
    }
  }

  async function handleCancelConfirm() {
    if (!rewardToCancel) {
      return;
    }

    try {
      await cancelMutation.mutateAsync(rewardToCancel.id);
    } catch (error) {
      snackError(
        getApiErrorMessage(error, "Não foi possível cancelar o benefício."),
        error
      );
    }
  }

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={1.5}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <CardGiftcardIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" fontWeight={600}>
            Benefícios
          </Typography>
        </Stack>
        {showGrantButton && (
          <RoundedButton size="small" onClick={() => setGrantOpen(true)}>
            Conceder cortesia
          </RoundedButton>
        )}
      </Stack>

      <Tabs
        value={statusFilter}
        onChange={(_, value) => setStatusFilter(value)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {STATUS_TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>

      <TableContainer
        isLoading={isLoading}
        isEmpty={!isLoading && rewards.length === 0}
        emptyFeedback={
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            Nenhum benefício neste filtro.
          </Typography>
        }
        onScrolledToEnd={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        isFetchingNextPage={isFetchingNextPage}
        contentHeight="min(36vh, 320px)"
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Regra</TableCell>
              <TableCell>Benefício</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Validade</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rewards.map((reward) => (
              <TableRow key={reward.id}>
                <TableCell>{reward.ruleName}</TableCell>
                <TableCell>{reward.rewardSummary}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={STATUS_LABELS[reward.status]}
                    color={reward.status === "AVAILABLE" ? "success" : "default"}
                  />
                </TableCell>
                <TableCell>{formatValidity(reward)}</TableCell>
                <TableCell align="right">
                  {reward.status === "AVAILABLE" ? (
                    <RoundedButton
                      size="small"
                      color="inherit"
                      onClick={() => setRewardToCancel(reward)}
                    >
                      Cancelar
                    </RoundedButton>
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <SimpleDialog
        open={grantOpen}
        onClose={() => {
          setGrantOpen(false);
          onGrantDialogClose?.();
        }}
        maxWidth="sm"
        fullWidth
      >
        <FastDialogTitle
          label="Conceder benefício (cortesia)"
          closeButton={() => {
            setGrantOpen(false);
            onGrantDialogClose?.();
            setSelectedRuleId("");
          }}
        />
        <Box sx={{ px: 3, pb: 3 }}>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Escolha a regra de fidelidade que será concedida manualmente ao
              cliente.
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="grant-rule-label">Regra de fidelidade</InputLabel>
              <Select
                labelId="grant-rule-label"
                label="Regra de fidelidade"
                value={selectedRuleId}
                onChange={(event) => setSelectedRuleId(event.target.value)}
              >
                {activeRuleOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <RoundedButton
                color="inherit"
                onClick={() => {
                  setGrantOpen(false);
                  onGrantDialogClose?.();
                  setSelectedRuleId("");
                }}
              >
                Voltar
              </RoundedButton>
              <RoundedButton
                onClick={handleGrant}
                disabled={grantMutation.isLoading}
              >
                Conceder
              </RoundedButton>
            </Stack>
          </Stack>
        </Box>
      </SimpleDialog>

      <ConfirmDialog
        open={Boolean(rewardToCancel)}
        danger
        confirmTitle="Cancelar benefício?"
        confirmSubtitle="O benefício deixará de estar disponível para o cliente."
        rejectMsg="Voltar"
        resolveMsg="Cancelar benefício"
        resolveLoading={cancelMutation.isLoading}
        onClose={() => setRewardToCancel(null)}
        onReject={() => setRewardToCancel(null)}
        onResolve={handleCancelConfirm}
      />
    </Stack>
  );
}

export default CustomerRewardsPanel;
