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
  const [createOpen, setCreateOpen] = useState(false);
  const queryClient = useQueryClient();
  const { snackSuccess, snackError } = useSnackbarContext();

  const { data, isLoading, isError } = useQuery(["services"], () =>
    serviceServices.list()
  );

  const services = data?.data ?? [];

  async function refreshServices() {
    await queryClient.invalidateQueries(["services"]);
  }

  const createMutation = useMutation(serviceServices.create, {
    onSuccess: async () => {
      await refreshServices();
      snackSuccess("Serviço cadastrado.");
      setCreateOpen(false);
    },
  });

  const deactivateMutation = useMutation(serviceServices.deactivate, {
    onSuccess: async () => {
      await refreshServices();
      snackSuccess("Serviço excluído.");
    },
  });

  async function handleCreate(payload: CreateServicePayload) {
    try {
      await createMutation.mutateAsync(payload);
    } catch (error) {
      snackError(
        getApiErrorMessage(error, "Não foi possível cadastrar o serviço."),
        error
      );
      throw error;
    }
  }

  async function handleDelete(service: ServiceListItem) {
    try {
      await deactivateMutation.mutateAsync(service.id);
    } catch (error) {
      snackError(
        getApiErrorMessage(error, "Não foi possível excluir o serviço."),
        error
      );
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        Serviços
      </Typography>

      <Stack direction="row" justifyContent="flex-end">
        <RoundedButton
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
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
                <TableCell>Dias sugeridos para retorno</TableCell>
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
                      onDelete={handleDelete}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <CreateServiceDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </Stack>
  );
}

export default Services;
