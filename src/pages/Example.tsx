import { useState } from "react";
import { Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQuery, useQueryClient } from "react-query";
import DebouncedSearchField from "components/DebouncedSearchField";
import ConfirmDialog from "components/Dialogs/ConfirmDialog";
import FriendlyDate from "components/FriendlyDate";
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
import { ExampleItem } from "interfaces/example";
import { exampleServices } from "services/examples";

/** Página modelo: listagem com busca, tabela, react-query e diálogo de confirmação. */
function Example() {
  const [search, setSearch] = useState("");
  const [toRemove, setToRemove] = useState<ExampleItem | null>(null);
  const queryClient = useQueryClient();
  const { snackSuccess, snackError } = useSnackbarContext();

  const { data = [], isLoading, isFetching, isError } = useQuery(
    ["examples", search],
    () => exampleServices.list(search),
    { keepPreviousData: true }
  );

  const removeMutation = useMutation(exampleServices.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries("examples");
      snackSuccess("Registro removido.");
      setToRemove(null);
    },
    onError: (error) => snackError("Não foi possível remover.", error),
  });

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
      >
        <Typography variant="h5" fontWeight={700}>
          Exemplo
        </Typography>
        <DebouncedSearchField
          allowBlankAction
          loading={isFetching}
          onSearch={setSearch}
          onClear={() => setSearch("")}
          textFieldProps={{ placeholder: "Buscar..." }}
        />
      </Stack>

      <Paper>
        <TableContainer
          isLoading={isLoading}
          hasError={isError}
          errorFeedback={
            <DefaultRenderContainer>
              Não foi possível carregar os dados.
            </DefaultRenderContainer>
          }
          isEmpty={data.length === 0}
          emptyFeedback={
            <DefaultRenderContainer>
              Nenhum registro encontrado.
            </DefaultRenderContainer>
          }
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Criado</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={item.status}
                      color={item.status === "ativo" ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell>
                    <FriendlyDate date={item.createdAt} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label={`Remover ${item.name}`}
                      onClick={() => setToRemove(item)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ConfirmDialog
        open={!!toRemove}
        danger
        confirmTitle="Remover registro?"
        confirmSubtitle={`"${toRemove?.name}" será removido.`}
        rejectMsg="Cancelar"
        resolveMsg="Remover"
        resolveLoading={removeMutation.isLoading}
        onClose={() => setToRemove(null)}
        onReject={() => setToRemove(null)}
        onResolve={() => toRemove && removeMutation.mutate(toRemove.id)}
      />
    </Stack>
  );
}

export default Example;
