import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SendIcon from "@mui/icons-material/Send";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { RoundedButton } from "components/Button/RoundedButton";
import CreateCustomerDialog from "components/Customers/CreateCustomerDialog";
import CustomerAppointmentsPanel from "components/Customers/CustomerAppointmentsPanel";
import CustomerMessagesPanel from "components/Customers/CustomerMessagesPanel";
import CustomerReferralsPanel from "components/Customers/CustomerReferralsPanel";
import CustomerRewardsPanel from "components/Customers/CustomerRewardsPanel";
import SendCustomerMessageDialog from "components/Messages/SendCustomerMessageDialog";
import { DefaultRenderContainer } from "components/RenderList";
import { useSnackbarContext } from "contexts/SnackbarContext";
import {
  CreateCustomerPayload,
  CustomerListItem,
  CustomerSummaryResponse,
} from "interfaces/customers";
import siteMap from "routes/siteMap";
import { customerServices } from "services/customers";
import { messageServices } from "services/messages";
import { messageTemplateServices } from "services/messageTemplates";
import { getApiErrorMessage } from "utils/apiError";
import { formatDateOfBirthDisplay } from "utils/birthday";
import { formatCurrency } from "utils/currency";
import { LEAD_SOURCE_OPTIONS } from "validators/customers";
import { buildWhatsAppLinkFromPhone } from "utils/whatsapp";

function formatLeadSource(value: CustomerSummaryResponse["leadSource"]) {
  return (
    LEAD_SOURCE_OPTIONS.find((option) => option.value === value)?.label ?? value
  );
}

function summaryToListItem(summary: CustomerSummaryResponse): CustomerListItem {
  return {
    id: summary.id,
    name: summary.name,
    phone: summary.phone,
    dateOfBirth: summary.dateOfBirth,
    leadSource: summary.leadSource,
    referrerId: summary.referrerId,
    referrerName: summary.referrerName,
    referralsMadeCount: summary.referralsMadeCount,
  };
}

function CustomerProfile() {
  const { customerId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { snackSuccess, snackError } = useSnackbarContext();
  const [editOpen, setEditOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [grantOpen, setGrantOpen] = useState(false);

  const {
    data: summary,
    isLoading,
    isError,
  } = useQuery(
    ["customer-summary", customerId],
    () => customerServices.getSummary(customerId),
    { enabled: Boolean(customerId) }
  );

  const { data: messageTemplatesData } = useQuery(
    ["message-templates", "send-message"],
    () => messageTemplateServices.list(),
    { enabled: messageOpen }
  );

  const updateMutation = useMutation(
    ({ id, payload }: { id: string; payload: CreateCustomerPayload }) =>
      customerServices.update(id, payload),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["customer-summary", customerId]);
        await queryClient.invalidateQueries(["customers"]);
        snackSuccess("Dados atualizados com sucesso");
        setEditOpen(false);
      },
    }
  );

  const createMessageMutation = useMutation(
    (payload: { templateId?: string; content?: string }) =>
      messageServices.createForCustomer(customerId, payload),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["customer-messages", customerId]);
        await queryClient.invalidateQueries(["messages"]);
        await queryClient.invalidateQueries(["messages-pending-count"]);
      },
    }
  );

  const customer = useMemo(
    () => (summary ? summaryToListItem(summary) : null),
    [summary]
  );

  const whatsappUrl = useMemo(() => {
    if (!summary?.phone) {
      return null;
    }

    return buildWhatsAppLinkFromPhone(summary.phone, "");
  }, [summary?.phone]);

  async function handleUpdate(payload: CreateCustomerPayload) {
    if (!customer) {
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: customer.id, payload });
    } catch (error) {
      snackError(
        getApiErrorMessage(error, "Não foi possível atualizar o cliente."),
        error
      );
      throw error;
    }
  }

  async function handleCreateMessage(payload: {
    templateId?: string;
    content?: string;
  }) {
    try {
      await createMessageMutation.mutateAsync(payload);
      snackSuccess("Mensagem adicionada à fila.");
      setMessageOpen(false);
    } catch (error) {
      snackError(
        getApiErrorMessage(error, "Não foi possível criar a mensagem."),
        error
      );
      throw error;
    }
  }

  function handleOpenWhatsApp() {
    if (!whatsappUrl) {
      snackError("Telefone do cliente inválido para WhatsApp.");
      return;
    }

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  if (isLoading) {
    return (
      <DefaultRenderContainer>Carregando ficha do cliente…</DefaultRenderContainer>
    );
  }

  if (isError || !summary || !customer) {
    return (
      <Stack spacing={2}>
        <RoundedButton
          startIcon={<ArrowBackIcon />}
          color="inherit"
          onClick={() => navigate(siteMap.protected.customers)}
          sx={{ alignSelf: "flex-start" }}
        >
          Voltar
        </RoundedButton>
        <DefaultRenderContainer>
          Não foi possível carregar a ficha do cliente.
        </DefaultRenderContainer>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton
          aria-label="Voltar para clientes"
          onClick={() => navigate(siteMap.protected.customers)}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>
          Ficha do cliente
        </Typography>
        <IconButton aria-label="Editar cliente" onClick={() => setEditOpen(true)}>
          <EditOutlinedIcon />
        </IconButton>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {summary.name}
              </Typography>
              <Typography color="text.secondary">{summary.phone}</Typography>
              <Typography variant="body2" color="text.secondary">
                Aniversário: {formatDateOfBirthDisplay(summary.dateOfBirth)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Origem: {formatLeadSource(summary.leadSource)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Indicado por: {summary.referrerName ?? "—"}
              </Typography>
            </Box>

            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
              <RoundedButton
                size="small"
                startIcon={<EventAvailableIcon />}
                onClick={() =>
                  navigate({
                    pathname: siteMap.protected.newAppointment,
                    search: `?customerId=${customer.id}`,
                  })
                }
              >
                Novo atendimento
              </RoundedButton>
              <RoundedButton
                size="small"
                startIcon={<SendIcon />}
                onClick={() => setMessageOpen(true)}
              >
                Enviar mensagem
              </RoundedButton>
              <RoundedButton
                size="small"
                startIcon={<CardGiftcardIcon />}
                onClick={() => setGrantOpen(true)}
              >
                Conceder benefício
              </RoundedButton>
              <RoundedButton
                size="small"
                startIcon={<WhatsAppIcon />}
                onClick={handleOpenWhatsApp}
              >
                WhatsApp
              </RoundedButton>
            </Stack>
          </Stack>

          {summary.nextSuggestedReturnDate && (
            <Alert severity="info">
              Próximo retorno sugerido:{" "}
              {new Date(
                `${summary.nextSuggestedReturnDate}T12:00:00`
              ).toLocaleDateString("pt-BR")}
            </Alert>
          )}

          {summary.expiringSoonRewards.length > 0 && (
            <Alert severity="warning">
              Benefícios prestes a vencer:{" "}
              {summary.expiringSoonRewards
                .map((reward) => reward.rewardSummary)
                .join(" · ")}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={2.4}>
              <Typography variant="caption" color="text.secondary">
                Visitas
              </Typography>
              <Typography fontWeight={700}>
                {summary.indicators.totalVisits}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <Typography variant="caption" color="text.secondary">
                Total gasto
              </Typography>
              <Typography fontWeight={700}>
                {formatCurrency(summary.indicators.totalSpent)}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <Typography variant="caption" color="text.secondary">
                Ticket médio
              </Typography>
              <Typography fontWeight={700}>
                {summary.indicators.averageTicket != null
                  ? formatCurrency(summary.indicators.averageTicket)
                  : "—"}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <Typography variant="caption" color="text.secondary">
                Última visita
              </Typography>
              <Typography fontWeight={700}>
                {summary.indicators.lastVisitDate
                  ? new Date(
                      `${summary.indicators.lastVisitDate}T12:00:00`
                    ).toLocaleDateString("pt-BR")
                  : "—"}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <Typography variant="caption" color="text.secondary">
                Dias desde a última visita
              </Typography>
              <Typography fontWeight={700}>
                {summary.indicators.daysSinceLastVisit ?? "—"}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <CustomerAppointmentsPanel customerId={customer.id} />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <CustomerRewardsPanel
          customerId={customer.id}
          grantDialogOpen={grantOpen}
          onGrantDialogClose={() => setGrantOpen(false)}
          showGrantButton={false}
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <CustomerReferralsPanel customerId={customer.id} />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <CustomerMessagesPanel customerId={customer.id} />
      </Paper>

      <CreateCustomerDialog
        open={editOpen}
        customer={customer}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
      />

      <SendCustomerMessageDialog
        open={messageOpen}
        customer={customer}
        templates={messageTemplatesData?.data ?? []}
        onClose={() => setMessageOpen(false)}
        onSubmit={handleCreateMessage}
      />
    </Stack>
  );
}

export default CustomerProfile;
