import { useMemo, useState } from "react";
import { Paper, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "react-query";
import { RoundedButton } from "components/Button/RoundedButton";
import CreateCustomerDialog from "components/Customers/CreateCustomerDialog";
import DebouncedSearchField from "components/DebouncedSearchField";
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
import { CreateCustomerPayload } from "interfaces/customers";
import { customerServices } from "services/customers";
import { getApiErrorMessage } from "utils/apiError";
import { getNextPageParam } from "utils/query";

function Customers() {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const queryClient = useQueryClient();
  const { snackSuccess, snackError } = useSnackbarContext();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isError,
  } = useInfiniteQuery(
    ["customers", search],
    ({ pageParam = 1 }) => customerServices.list({ page: pageParam, search }),
    {
      getNextPageParam,
      keepPreviousData: true,
    }
  );

  const customers = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const createMutation = useMutation(customerServices.create, {
    onSuccess: async () => {
      await queryClient.resetQueries(["customers"]);
      snackSuccess("Cliente cadastrado.");
      setCreateOpen(false);
    },
  });

  async function handleCreate(payload: CreateCustomerPayload) {
    try {
      await createMutation.mutateAsync(payload);
    } catch (error) {
      snackError(
        getApiErrorMessage(error, "Não foi possível cadastrar o cliente."),
        error
      );
      throw error;
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        Clientes
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        <DebouncedSearchField
          allowBlankAction
          loading={isFetching && !isFetchingNextPage}
          onSearch={setSearch}
          onClear={() => setSearch("")}
          textFieldProps={{
            placeholder: "Buscar por nome ou telefone",
            fullWidth: true,
          }}
        />
        <RoundedButton
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
          sx={{ flexShrink: 0, alignSelf: { xs: "stretch", sm: "auto" } }}
        >
          Novo cliente
        </RoundedButton>
      </Stack>

      <Paper>
        <TableContainer
          contentHeight="min(60vh, 520px)"
          isLoading={isLoading}
          hasError={isError}
          errorFeedback={
            <DefaultRenderContainer>
              Não foi possível carregar os clientes.
            </DefaultRenderContainer>
          }
          isEmpty={!isLoading && customers.length === 0 && !search}
          emptyFeedback={
            <DefaultRenderContainer>
              Nenhum cliente cadastrado.
            </DefaultRenderContainer>
          }
          isEmptySearch={!!search && !isLoading && customers.length === 0}
          emptySearchFeedback={
            <DefaultRenderContainer>
              Nenhum cliente encontrado para esta busca.
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
                <TableCell>Nome</TableCell>
                <TableCell>Telefone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <CreateCustomerDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </Stack>
  );
}

export default Customers;
