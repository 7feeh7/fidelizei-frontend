import { useMemo } from "react";
import { Stack, Typography } from "@mui/material";
import { useInfiniteQuery } from "react-query";
import { DefaultRenderContainer } from "components/RenderList";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "components/Tables";
import { appointmentServices } from "services/appointments";
import { formatCurrency } from "utils/currency";
import { getNextPageParam } from "utils/query";

interface CustomerAppointmentsPanelProps {
  customerId: string;
}

function CustomerAppointmentsPanel({ customerId }: CustomerAppointmentsPanelProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(
    ["customer-appointments", customerId],
    ({ pageParam = 1 }) =>
      appointmentServices.list({ page: pageParam, customerId }),
    {
      enabled: Boolean(customerId),
      getNextPageParam,
    }
  );

  const appointments = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1" fontWeight={700}>
        Atendimentos
      </Typography>
      <TableContainer
        isLoading={isLoading}
        hasError={isError}
        errorFeedback={
          <DefaultRenderContainer>
            Não foi possível carregar os atendimentos.
          </DefaultRenderContainer>
        }
        isEmpty={!isLoading && appointments.length === 0}
        emptyFeedback={
          <DefaultRenderContainer>
            Nenhum atendimento registrado.
          </DefaultRenderContainer>
        }
        onScrolledToEnd={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        isFetchingNextPage={isFetchingNextPage}
        contentHeight="min(40vh, 360px)"
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Profissional</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {new Date(appointment.appointmentDate).toLocaleString(
                    "pt-BR"
                  )}
                </TableCell>
                <TableCell>{appointment.userName ?? "—"}</TableCell>
                <TableCell align="right">
                  {formatCurrency(appointment.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default CustomerAppointmentsPanel;
