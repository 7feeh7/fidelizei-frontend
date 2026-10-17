import { useMemo, useState } from "react";
import {
  Autocomplete,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import ConfirmDialog from "components/Dialogs/ConfirmDialog";
import { DefaultRenderContainer } from "components/RenderList";
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
  ReferralListItem,
  ReferralStatus,
} from "interfaces/referrals";
import { customerServices } from "services/customers";
import { referralServices } from "services/referrals";
import { getApiErrorMessage } from "utils/apiError";
import { getNextPageParam } from "utils/query";

const STATUS_OPTIONS: { label: string; value: ReferralStatus | null }[] = [
  { label: "Todos", value: null },
  { label: "Pendente", value: "PENDING" },
  { label: "Convertida", value: "CONVERTED" },
  { label: "Cancelada", value: "CANCELED" },
];

const STATUS_LABELS: Record<ReferralStatus, string> = {
  PENDING: "Pendente",
  CONVERTED: "Convertida",
  CANCELED: "Cancelada",
};

function Referrals() {
  const [status, setStatus] = useState<ReferralStatus | null>(null);
  const [referrerId, setReferrerId] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<ReferralListItem | null>(
    null
  );
  const queryClient = useQueryClient();
  const { snackSuccess, snackError } = useSnackbarContext();

  const { data: customersData } = useQuery(["customers-options"], () =>
    customerServices.list({ page: 1 })
  );

  const referrerOptions = useMemo(
    () =>
      (customersData?.data ?? []).map((customer) => ({
        label: customer.name,
        value: customer.id,
      })),
    [customersData]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(
    ["referrals", status, referrerId],
    ({ pageParam = 1 }) =>
      referralServices.list({
        page: pageParam,
        status: status ?? undefined,
        referrerId: referrerId ?? undefined,
      }),
    {
      getNextPageParam,
      keepPreviousData: true,
    }
  );

  const referrals = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  async function refreshReferrals() {
    await queryClient.resetQueries(["referrals"]);
  }

  const cancelMutation = useMutation(referralServices.cancel, {
    onSuccess: async () => {
      await refreshReferrals();
      snackSuccess("Indicação cancelada.");
      setCancelTarget(null);
    },
  });

  async function handleCancelConfirm() {
    if (!cancelTarget) {
      return;
    }

    try {
      await cancelMutation.mutateAsync(cancelTarget.id);
    } catch (error) {
      snackError(
        getApiErrorMessage(error, "Não foi possível cancelar a indicação."),
        error
      );
    }
  }

  function formatDate(value: string | null) {
    if (!value) {
      return "—";
    }

    return format(parseISO(value), "dd/MM/yyyy", { locale: ptBR });
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        Indicações
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Autocomplete
          options={STATUS_OPTIONS}
          value={STATUS_OPTIONS.find((option) => option.value === status) ?? STATUS_OPTIONS[0]}
          onChange={(_, option) => setStatus(option?.value ?? null)}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField {...params} label="Status" size="small" />
          )}
          sx={{ minWidth: { md: 220 } }}
        />
        <Autocomplete
          options={referrerOptions}
          value={
            referrerOptions.find((option) => option.value === referrerId) ??
            null
          }
          onChange={(_, option) => setReferrerId(option?.value ?? null)}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Indicador"
              placeholder="Todos os indicadores"
              size="small"
            />
          )}
          sx={{ minWidth: { md: 280 } }}
        />
      </Stack>

      <Paper>
        <TableContainer
          contentHeight="min(60vh, 520px)"
          isLoading={isLoading}
          hasError={isError}
          errorFeedback={
            <DefaultRenderContainer>
              Não foi possível carregar as indicações.
            </DefaultRenderContainer>
          }
          isEmpty={!isLoading && referrals.length === 0}
          emptyFeedback={
            <DefaultRenderContainer>
              Nenhuma indicação encontrada.
            </DefaultRenderContainer>
          }
          onScrolledToEnd={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          isFetchingNextPage={isFetchingNextPage}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Indicador</TableCell>
                <TableCell>Indicado</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Criada em</TableCell>
                <TableCell>Convertida em</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.id} hover>
                  <TableCell>{referral.referrerName}</TableCell>
                  <TableCell>{referral.referredName}</TableCell>
                  <TableCell>{STATUS_LABELS[referral.status]}</TableCell>
                  <TableCell>{formatDate(referral.createdAt)}</TableCell>
                  <TableCell>{formatDate(referral.convertedAt)}</TableCell>
                  <TableCell align="right">
                    {referral.status === "PENDING" && (
                      <Tooltip title="Cancelar indicação">
                        <IconButton
                          aria-label="Cancelar indicação"
                          onClick={() => setCancelTarget(referral)}
                        >
                          <CancelOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        danger
        confirmTitle="Cancelar indicação?"
        confirmSubtitle={`A indicação de ${cancelTarget?.referredName} será cancelada.`}
        rejectMsg="Voltar"
        resolveMsg="Cancelar indicação"
        resolveLoading={cancelMutation.isLoading}
        onClose={() => setCancelTarget(null)}
        onReject={() => setCancelTarget(null)}
        onResolve={handleCancelConfirm}
      />
    </Stack>
  );
}

export default Referrals;
