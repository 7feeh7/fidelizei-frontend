import { useMemo } from "react";
import { Chip, Stack, Typography } from "@mui/material";
import { useInfiniteQuery } from "react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "components/Tables";
import { MessageListItem } from "interfaces/messages";
import { messageServices } from "services/messages";
import { formatMessageTemplateType } from "utils/messageTemplatePresentation";
import { getNextPageParam } from "utils/query";

interface CustomerMessagesPanelProps {
  customerId: string;
}

function formatSentInfo(message: MessageListItem) {
  if (message.status === "SENT" && message.sentAt) {
    const date = new Date(message.sentAt).toLocaleString("pt-BR");
    return `Enviada em ${date}${message.sentByName ? ` por ${message.sentByName}` : ""}`;
  }

  if (message.status === "CANCELED") {
    return "Descartada";
  }

  if (message.status === "PENDING") {
    return `Agendada para ${new Date(message.scheduledFor).toLocaleDateString("pt-BR")}`;
  }

  return "—";
}

const STATUS_LABELS: Record<MessageListItem["status"], string> = {
  PENDING: "Pendente",
  SENT: "Enviada",
  CANCELED: "Descartada",
};

function CustomerMessagesPanel({ customerId }: CustomerMessagesPanelProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["customer-messages", customerId],
    ({ pageParam = 1 }) =>
      messageServices.list({ customerId, page: pageParam }),
    {
      enabled: Boolean(customerId),
      getNextPageParam,
    }
  );

  const messages = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1" fontWeight={700}>
        Mensagens
      </Typography>
      <TableContainer
        isLoading={isLoading}
        isEmpty={!isLoading && messages.length === 0}
        emptyFeedback={
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            Nenhuma mensagem registrada.
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
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Motivo</TableCell>
              <TableCell>Texto</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Detalhes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell>
                  {formatMessageTemplateType(message.type)}
                </TableCell>
                <TableCell sx={{ whiteSpace: "pre-wrap" }}>
                  {message.content}
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={STATUS_LABELS[message.status]}
                    color={
                      message.status === "SENT"
                        ? "success"
                        : message.status === "PENDING"
                          ? "warning"
                          : "default"
                    }
                  />
                </TableCell>
                <TableCell>{formatSentInfo(message)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default CustomerMessagesPanel;
