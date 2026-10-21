import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { RoundedButton } from "components/Button/RoundedButton";
import SendCustomerMessageDialog from "components/Messages/SendCustomerMessageDialog";
import { useSnackbarContext } from "contexts/SnackbarContext";
import { CustomerListItem } from "interfaces/customers";
import { OverdueReturnItem } from "interfaces/overdueReturns";
import { messageServices } from "services/messages";
import { messageTemplateServices } from "services/messageTemplates";
import { overdueReturnsServices } from "services/overdueReturns";
import { getApiErrorMessage } from "utils/apiError";

function formatShortDate(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  const dateOnly = value.slice(0, 10);
  const parsed = new Date(`${dateOnly}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function buildServiceSummary(item: OverdueReturnItem): string {
  const base = `${item.serviceName} em ${formatShortDate(item.appointmentDate)} · retorno sugerido ${formatShortDate(item.returnDueDate)}`;

  if (item.additionalServicesCount <= 0) {
    return base;
  }

  const suffix =
    item.additionalServicesCount === 1
      ? "+1 serviço"
      : `+${item.additionalServicesCount} serviços`;

  return `${base} · ${suffix}`;
}

function toMessageCustomer(item: OverdueReturnItem): CustomerListItem {
  return {
    id: item.customerId,
    name: item.customerName,
    phone: item.customerPhone,
    dateOfBirth: null,
    leadSource: "OUTRO",
    referrerId: null,
    referrerName: null,
    referralsMadeCount: 0,
  };
}

function CallTodaySection() {
  const queryClient = useQueryClient();
  const { snackSuccess, snackError } = useSnackbarContext();
  const [messageCustomer, setMessageCustomer] =
    useState<CustomerListItem | null>(null);

  const { data, isLoading, isError } = useQuery(["overdue-returns"], () =>
    overdueReturnsServices.list({ page: 1, perPage: 5 })
  );

  const items = data?.data ?? [];

  const { data: messageTemplatesData } = useQuery(
    ["message-templates", "send-message"],
    () => messageTemplateServices.list(),
    { enabled: Boolean(messageCustomer) }
  );

  const createMessageMutation = useMutation(
    ({
      customerId,
      payload,
    }: {
      customerId: string;
      payload: { templateId?: string; content?: string };
    }) => messageServices.createForCustomer(customerId, payload),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["messages"]);
        await queryClient.invalidateQueries(["messages-pending-count"]);
      },
    }
  );

  async function handleCreateMessage(payload: {
    templateId?: string;
    content?: string;
  }) {
    if (!messageCustomer) {
      return;
    }

    try {
      await createMessageMutation.mutateAsync({
        customerId: messageCustomer.id,
        payload,
      });
      snackSuccess("Mensagem adicionada à fila.");
      setMessageCustomer(null);
    } catch (error) {
      snackError(
        getApiErrorMessage(error, "Não foi possível criar a mensagem."),
        error
      );
      throw error;
    }
  }

  return (
    <>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={1}
        >
          <Typography variant="h6" fontWeight={700}>
            Chamar hoje
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Retorno vencido e sem contato depois do último atendimento
          </Typography>
        </Stack>

        {isError ? (
          <Alert severity="error">
            Não foi possível carregar os acionamentos em atraso.
          </Alert>
        ) : null}

        {isLoading ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
          </Stack>
        ) : null}

        {!isLoading && !isError ? (
          <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            {items.length === 0 ? (
              <Box px={3} py={4}>
                <Typography color="text.secondary" textAlign="center">
                  Nenhum contato atrasado para exibir no momento.
                </Typography>
              </Box>
            ) : (
              items.map((item, index) => (
                <Box key={`${item.customerId}-${item.appointmentDate}-${item.serviceName}`}>
                  {index > 0 ? <Divider /> : null}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                    px={3}
                    py={2.5}
                  >
                    <Box minWidth={0}>
                      <Typography fontWeight={700}>{item.customerName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {buildServiceSummary(item)}
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      flexShrink={0}
                    >
                      <Chip
                        size="small"
                        label={`${Math.max(0, item.overdueDays ?? 0)} dias de atraso`}
                        sx={{
                          bgcolor: "rgba(155, 102, 120, 0.15)",
                          color: "primary.main",
                          fontWeight: 600,
                        }}
                      />
                      <RoundedButton
                        size="small"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => setMessageCustomer(toMessageCustomer(item))}
                      >
                        WhatsApp
                      </RoundedButton>
                    </Stack>
                  </Stack>
                </Box>
              ))
            )}
          </Paper>
        ) : null}
      </Stack>

      <SendCustomerMessageDialog
        open={Boolean(messageCustomer)}
        customer={messageCustomer}
        templates={messageTemplatesData?.data ?? []}
        onClose={() => setMessageCustomer(null)}
        onSubmit={handleCreateMessage}
      />
    </>
  );
}

export default CallTodaySection;
