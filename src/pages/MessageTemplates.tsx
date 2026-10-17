import { useState } from "react";
import { Chip, Paper, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { RoundedButton } from "components/Button/RoundedButton";
import MessageTemplateFormDialog from "components/MessageTemplates/MessageTemplateFormDialog";
import MessageTemplateRowActions from "components/MessageTemplates/MessageTemplateRowActions";
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
  MessageTemplateListItem,
  MessageTemplatePayload,
  UpdateMessageTemplatePayload,
} from "interfaces/messageTemplates";
import { customerServices } from "services/customers";
import { messageTemplateServices } from "services/messageTemplates";
import { getApiErrorMessage } from "utils/apiError";
import {
  formatMessageTemplateStatus,
  formatMessageTemplateType,
} from "utils/messageTemplatePresentation";

function MessageTemplates() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<MessageTemplateListItem | null>(null);
  const queryClient = useQueryClient();
  const { snackSuccess, snackError } = useSnackbarContext();

  const { data, isLoading, isError } = useQuery(["message-templates"], () =>
    messageTemplateServices.list()
  );

  const { data: customersData } = useQuery(["customers", "all"], () =>
    customerServices.list({ page: 1 })
  );

  const templates = data?.data ?? [];
  const customers = customersData?.data ?? [];

  async function refreshTemplates() {
    await queryClient.invalidateQueries(["message-templates"]);
  }

  const createMutation = useMutation(messageTemplateServices.create, {
    onSuccess: async () => {
      await refreshTemplates();
      snackSuccess("Modelo cadastrado.");
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation(
    ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateMessageTemplatePayload;
    }) => messageTemplateServices.update(id, payload),
    {
      onSuccess: async () => {
        await refreshTemplates();
        snackSuccess("Modelo atualizado.");
        setEditingTemplate(null);
        setFormOpen(false);
      },
    }
  );

  const toggleActiveMutation = useMutation(
    ({ id, active }: { id: string; active: boolean }) =>
      messageTemplateServices.setActive(id, active),
    {
      onSuccess: async (_data, variables) => {
        await refreshTemplates();
        snackSuccess(
          variables.active ? "Modelo ativado." : "Modelo inativado."
        );
      },
    }
  );

  async function handleSubmit(
    payload: MessageTemplatePayload | UpdateMessageTemplatePayload,
    isEditing: boolean
  ) {
    try {
      if (isEditing && editingTemplate) {
        await updateMutation.mutateAsync({
          id: editingTemplate.id,
          payload: payload as UpdateMessageTemplatePayload,
        });
        return;
      }

      await createMutation.mutateAsync(payload as MessageTemplatePayload);
    } catch (error) {
      snackError(
        getApiErrorMessage(
          error,
          isEditing
            ? "Não foi possível atualizar o modelo."
            : "Não foi possível cadastrar o modelo."
        ),
        error
      );
      throw error;
    }
  }

  async function handleToggleActive(template: MessageTemplateListItem) {
    try {
      await toggleActiveMutation.mutateAsync({
        id: template.id,
        active: !template.active,
      });
    } catch (error) {
      snackError(
        getApiErrorMessage(error, "Não foi possível alterar o status do modelo."),
        error
      );
    }
  }

  function openCreateDialog() {
    setEditingTemplate(null);
    setFormOpen(true);
  }

  function openEditDialog(template: MessageTemplateListItem) {
    setEditingTemplate(template);
    setFormOpen(true);
  }

  function closeFormDialog() {
    setFormOpen(false);
    setEditingTemplate(null);
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        Modelos de mensagem
      </Typography>

      <Stack direction="row" justifyContent="flex-end">
        <RoundedButton startIcon={<AddIcon />} onClick={openCreateDialog}>
          Novo modelo
        </RoundedButton>
      </Stack>

      <Paper>
        <TableContainer
          contentHeight="min(60vh, 520px)"
          isLoading={isLoading}
          hasError={isError}
          errorFeedback={
            <DefaultRenderContainer>
              Não foi possível carregar os modelos de mensagem.
            </DefaultRenderContainer>
          }
          isEmpty={!isLoading && templates.length === 0}
          emptyFeedback={
            <DefaultRenderContainer>
              Nenhum modelo cadastrado.
            </DefaultRenderContainer>
          }
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((template) => (
                <TableRow
                  key={template.id}
                  hover
                  sx={template.active ? undefined : { opacity: 0.6 }}
                >
                  <TableCell>{template.name}</TableCell>
                  <TableCell>
                    {formatMessageTemplateType(template.type)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={formatMessageTemplateStatus(template.active)}
                      color={template.active ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <MessageTemplateRowActions
                      template={template}
                      onEdit={openEditDialog}
                      onToggleActive={handleToggleActive}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <MessageTemplateFormDialog
        open={formOpen}
        template={editingTemplate}
        customers={customers}
        onClose={closeFormDialog}
        onSubmit={handleSubmit}
      />
    </Stack>
  );
}

export default MessageTemplates;
