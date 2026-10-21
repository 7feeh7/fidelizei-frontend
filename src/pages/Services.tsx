import { useState } from "react";
import { Paper, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { RoundedButton } from "components/Button/RoundedButton";
import CreateServiceDialog from "components/Services/CreateServiceDialog";
import ServiceRowActions from "components/Services/ServiceRowActions";
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
  CreateServicePayload,
  ServiceListItem,
  UpdateServicePayload,
} from "interfaces/services";
import { serviceServices } from "services/services";
import { getApiErrorMessage } from "utils/apiError";

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatSuggestedReturnDays(value: number | null) {
  if (value == null) {
    return "—";
  }

  return `${value} dias`;
}

function Services() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceListItem | null>(
    null
  );
  const queryClient = useQueryClient();
  const { snackSuccess, snackError } = useSnackbarContext();

  const { data, isLoading, isError } = useQuery(["services"], () =>
    serviceServices.list()
  );

  const services = data?.data ?? [];

  async function refreshRelatedQueries() {
    await Promise.all([
      queryClient.invalidateQueries(["services"]),
      queryClient.invalidateQueries(["loyalty-rules"]),
      queryClient.invalidateQueries(["appointments"]),
    ]);
  }

  const createMutation = useMutation(serviceServices.create, {
    onSuccess: async () => {
      await refreshRelatedQueries();
      snackSuccess("Serviço cadastrado.");
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation(
    ({ id, payload }: { id: string; payload: UpdateServicePayload }) =>
      serviceServices.update(id, payload),
    {
      onSuccess: async (_data, variables) => {
        await refreshRelatedQueries();
        snackSuccess(
          variables.payload.active
            ? "Serviço atualizado."
            : "Serviço inativado."
        );
        setEditingService(null);
        setFormOpen(false);
      },
    }
  );

  async function handleSubmit(
    payload: CreateServicePayload | UpdateServicePayload
  ) {
    try {
      if (editingService) {
        await updateMutation.mutateAsync({
          id: editingService.id,
          payload: payload as UpdateServicePayload,
        });
        return;
      }

      await createMutation.mutateAsync(payload as CreateServicePayload);
    } catch (error) {
      snackError(
        getApiErrorMessage(
          error,
          editingService
            ? "Não foi possível atualizar o serviço."
            : "Não foi possível cadastrar o serviço."
        ),
        error
      );
      throw error;
    }
  }

  function openCreateDialog() {
    setEditingService(null);
    setFormOpen(true);
  }

  function openEditDialog(service: ServiceListItem) {
    setEditingService(service);
    setFormOpen(true);
  }

  function closeFormDialog() {
    setFormOpen(false);
    setEditingService(null);
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
      >
        <Typography variant="h5" fontWeight={700}>
          Serviços
        </Typography>
        <RoundedButton
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          sx={{ alignSelf: { xs: "stretch", sm: "auto" } }}
        >
          Novo serviço
        </RoundedButton>
      </Stack>

      <Paper>
        <TableContainer
          contentHeight="min(60vh, 520px)"
          isLoading={isLoading}
          hasError={isError}
          errorFeedback={
            <DefaultRenderContainer>
              Não foi possível carregar os serviços.
            </DefaultRenderContainer>
          }
          isEmpty={!isLoading && services.length === 0}
          emptyFeedback={
            <DefaultRenderContainer>
              Nenhum serviço cadastrado.
            </DefaultRenderContainer>
          }
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Sugestão de retorno</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow
                  key={service.id}
                  hover
                  sx={service.active ? undefined : { opacity: 0.6 }}
                >
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{priceFormatter.format(service.price)}</TableCell>
                  <TableCell>
                    {formatSuggestedReturnDays(service.suggestedReturnDays)}
                  </TableCell>
                  <TableCell align="right">
                    <ServiceRowActions
                      service={service}
                      onEdit={openEditDialog}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <CreateServiceDialog
        open={formOpen}
        service={editingService}
        onClose={closeFormDialog}
        onSubmit={handleSubmit}
      />
    </Stack>
  );
}

export default Services;
