import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SendIcon from "@mui/icons-material/Send";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { RoundedButton } from "components/Button/RoundedButton";
import ConfirmDialog from "components/Dialogs/ConfirmDialog";
import EditMessageDialog from "components/Messages/EditMessageDialog";
import MessageSendConfirmDialog from "components/Messages/MessageSendConfirmDialog";
import { DefaultRenderContainer } from "components/RenderList";
import { useAuth } from "contexts/AuthContext";
import { useSnackbarContext } from "contexts/SnackbarContext";
import {
  MessageListItem,
  MessageStatus,
} from "interfaces/messages";
import { MessageTemplateType } from "interfaces/messageTemplates";
import { messageServices } from "services/messages";
import { getApiErrorMessage } from "utils/apiError";
import {
  formatMessageTemplateType,
  MESSAGE_TEMPLATE_TYPE_OPTIONS,
} from "utils/messageTemplatePresentation";
import { computeAge, formatDateOfBirthDisplay } from "utils/birthday";

type ViewTab = "pending" | "sent" | "canceled";

function DailyMessages() {
  const [tab, setTab] = useState<ViewTab>("pending");
  const [editingMessage, setEditingMessage] = useState<MessageListItem | null>(
    null
  );
  const [confirmSendMessage, setConfirmSendMessage] =
    useState<MessageListItem | null>(null);
  const [messageToCancel, setMessageToCancel] = useState<MessageListItem | null>(
    null
  );
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { snackSuccess, snackError } = useSnackbarContext();

  const status: MessageStatus =
    tab === "pending" ? "PENDING" : tab === "sent" ? "SENT" : "CANCELED";

  const { data, isLoading, isError } = useQuery(
    ["messages", status],
    () => messageServices.list({ status }),
    { keepPreviousData: true }
  );

  const messages = data?.data ?? [];

  const groupedMessages = useMemo(() => {
    const groups = new Map<MessageTemplateType, MessageListItem[]>();

    for (const message of messages) {
      const current = groups.get(message.type) ?? [];
      current.push(message);
      groups.set(message.type, current);
    }

    const order = MESSAGE_TEMPLATE_TYPE_OPTIONS.map((item) => item.value);

    return order
      .filter((type) => groups.has(type))
      .map((type) => ({
        type,
        items: groups.get(type) ?? [],
      }));
  }, [messages]);

  async function refreshMessages() {
    await Promise.all([
      queryClient.invalidateQueries(["messages"]),
      queryClient.invalidateQueries(["messages-pending-count"]),
    ]);
  }

  const updateMutation = useMutation(
    ({ id, content }: { id: string; content: string }) =>
      messageServices.updateContent(id, { content }),
    { onSuccess: refreshMessages }
  );

  const markSentMutation = useMutation(
    ({ id, loggedUserId }: { id: string; loggedUserId: string }) =>
      messageServices.markSent(id, { loggedUserId }),
    { onSuccess: refreshMessages }
  );

  const cancelMutation = useMutation(messageServices.cancel, {
    onSuccess: refreshMessages,
  });

  function handleOpenWhatsApp(message: MessageListItem) {
    if (!message.whatsappUrl) {
      snackError("Telefone do cliente inválido para WhatsApp.");
      return;
    }

    window.open(message.whatsappUrl, "_blank", "noopener,noreferrer");
    setConfirmSendMessage(message);
  }

  async function handleConfirmSent() {
    if (!confirmSendMessage || !user?.id) {
      return;
    }

    try {
      await markSentMutation.mutateAsync({
        id: confirmSendMessage.id,
        loggedUserId: String(user.id),
      });
      snackSuccess("Mensagem registrada como enviada.");
      setConfirmSendMessage(null);
    } catch (error) {
      snackError(
        getApiErrorMessage(error, "Não foi possível registrar o envio."),
        error
      );
    }
  }

  async function handleEdit(content: string) {
    if (!editingMessage) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: editingMessage.id,
        content,
      });
      snackSuccess("Mensagem atualizada.");
    } catch (error) {
      snackError(
        getApiErrorMessage(error, "Não foi possível editar a mensagem."),
        error
      );
      throw error;
    }
  }

  async function handleCancel() {
    if (!messageToCancel) {
      return;
    }

    try {
      await cancelMutation.mutateAsync(messageToCancel.id);
      snackSuccess("Mensagem descartada.");
      setMessageToCancel(null);
    } catch (error) {
      snackError(
        getApiErrorMessage(error, "Não foi possível descartar a mensagem."),
        error
      );
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        Mensagens do dia
      </Typography>

      <Tabs value={tab} onChange={(_, value) => setTab(value as ViewTab)}>
        <Tab value="pending" label="Pendentes" />
        <Tab value="sent" label="Enviadas" />
        <Tab value="canceled" label="Descartadas" />
      </Tabs>

      {isError && (
        <DefaultRenderContainer>
          Não foi possível carregar as mensagens.
        </DefaultRenderContainer>
      )}

      {!isError && !isLoading && messages.length === 0 && (
        <DefaultRenderContainer>
          {tab === "pending"
            ? "Nenhuma mensagem pendente para hoje."
            : "Nenhuma mensagem nesta aba."}
        </DefaultRenderContainer>
      )}

      {groupedMessages.map((group) => (
        <Stack key={group.type} spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            {formatMessageTemplateType(group.type)}
          </Typography>
          <Stack spacing={2}>
            {group.items.map((message) => (
              <Paper key={message.id} sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Box>
                      <Typography fontWeight={700}>
                        {message.customerName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {message.customerPhone} ·{" "}
                        {formatMessageTemplateType(message.type)}
                        {message.type === "RETURN_REMINDER" &&
                          message.returnReminderServiceName &&
                          message.returnReminderAppointmentDate && (
                            <>
                              {" "}
                              · {message.returnReminderServiceName} (
                              {new Date(
                                `${message.returnReminderAppointmentDate}T12:00:00`
                              ).toLocaleDateString("pt-BR")}
                              )
                            </>
                          )}
                        {message.type === "BIRTHDAY" &&
                          message.customerDateOfBirth && (
                            <>
                              {" "}
                              · Aniversário{" "}
                              {formatDateOfBirthDisplay(
                                message.customerDateOfBirth
                              )}{" "}
                              (
                              {computeAge(message.customerDateOfBirth)} anos)
                            </>
                          )}
                      </Typography>
                    </Box>
                    {tab !== "pending" && (
                      <Chip
                        size="small"
                        label={
                          message.status === "SENT" ? "Enviada" : "Descartada"
                        }
                        color={
                          message.status === "SENT" ? "success" : "default"
                        }
                      />
                    )}
                  </Stack>

                  <Typography whiteSpace="pre-wrap">{message.content}</Typography>

                  {tab === "sent" && message.sentAt && (
                    <Typography variant="body2" color="text.secondary">
                      Enviada em{" "}
                      {new Date(message.sentAt).toLocaleString("pt-BR")}
                      {message.sentByName ? ` por ${message.sentByName}` : ""}
                    </Typography>
                  )}

                  {tab === "pending" && (
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <RoundedButton
                        size="small"
                        variant="outlined"
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => setEditingMessage(message)}
                      >
                        Editar
                      </RoundedButton>
                      <RoundedButton
                        size="small"
                        startIcon={<SendIcon />}
                        onClick={() => handleOpenWhatsApp(message)}
                      >
                        Enviar pelo WhatsApp
                      </RoundedButton>
                      <RoundedButton
                        size="small"
                        color="inherit"
                        variant="outlined"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => setMessageToCancel(message)}
                      >
                        Descartar
                      </RoundedButton>
                    </Stack>
                  )}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Stack>
      ))}

      <EditMessageDialog
        open={Boolean(editingMessage)}
        message={editingMessage}
        onClose={() => setEditingMessage(null)}
        onSubmit={handleEdit}
      />

      <MessageSendConfirmDialog
        open={Boolean(confirmSendMessage)}
        message={confirmSendMessage}
        onClose={() => setConfirmSendMessage(null)}
        onConfirmSent={handleConfirmSent}
      />

      <ConfirmDialog
        open={Boolean(messageToCancel)}
        confirmTitle="Descartar mensagem?"
        confirmSubtitle="A mensagem sairá da fila de pendentes."
        rejectMsg="Voltar"
        resolveMsg="Descartar"
        resolveLoading={cancelMutation.isLoading}
        onClose={() => setMessageToCancel(null)}
        onReject={() => setMessageToCancel(null)}
        onResolve={handleCancel}
        danger
      />
    </Stack>
  );
}

export default DailyMessages;
