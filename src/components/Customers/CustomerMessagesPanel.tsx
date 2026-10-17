import { useMemo } from "react";
import { Chip, Stack, Typography } from "@mui/material";
import { useQuery } from "react-query";
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

  return "—";
}

function CustomerMessagesPanel({ customerId }: CustomerMessagesPanelProps) {
  const { data, isLoading } = useQuery(
    ["customer-messages", customerId],
    async () => {
      const [sent, canceled] = await Promise.all([
        messageServices.list({ customerId, status: "SENT" }),
        messageServices.list({ customerId, status: "CANCELED" }),
      ]);
      return [...sent.data, ...canceled.data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    { enabled: Boolean(customerId) }
  );

  const messages = useMemo(() => data ?? [], [data]);

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1" fontWeight={700}>
        Histórico de mensagens
      </Typography>
      <TableContainer isLoading={isLoading}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Motivo</TableCell>
              <TableCell>Texto</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Detalhes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  Nenhuma mensagem no histórico.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
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
                      label={
                        message.status === "SENT" ? "Enviada" : "Descartada"
                      }
                      color={
                        message.status === "SENT" ? "success" : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>{formatSentInfo(message)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default CustomerMessagesPanel;
