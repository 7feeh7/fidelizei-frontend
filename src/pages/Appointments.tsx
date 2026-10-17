import { useMemo, useState } from "react";
import {
  Autocomplete,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useInfiniteQuery, useQuery } from "react-query";
import { Link } from "react-router-dom";
import { RoundedButton } from "components/Button/RoundedButton";
import { DefaultRenderContainer } from "components/RenderList";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "components/Tables";
import { useQueryParams } from "hooks/useQueryParams";
import { customerServices } from "services/customers";
import { appointmentServices } from "services/appointments";
import { formatCurrency } from "utils/currency";
import { endOfDayIso, startOfDayIso } from "utils/datetime";
import { getNextPageParam } from "utils/query";
import siteMap from "routes/siteMap";

function Appointments() {
  const { navigate } = useQueryParams();
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: customersData } = useQuery(["customers-options"], () =>
    customerServices.list({ page: 1 })
  );

  const customerOptions = useMemo(
    () =>
      (customersData?.data ?? []).map((customer) => ({
        label: customer.name,
        value: customer.id,
      })),
    [customersData]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(
    ["appointments", customerId, startDate, endDate],
    ({ pageParam = 1 }) =>
      appointmentServices.list({
        page: pageParam,
        customerId: customerId ?? undefined,
        startDate: startDate ? startOfDayIso(startDate) : undefined,
        endDate: endDate ? endOfDayIso(endDate) : undefined,
      }),
    {
      getNextPageParam,
      keepPreviousData: true,
    }
  );

  const appointments = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  function formatAppointmentDate(value: string) {
    return format(parseISO(value), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
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
          Atendimentos
        </Typography>
        <RoundedButton
          startIcon={<AddIcon />}
          onClick={() => navigate(siteMap.protected.newAppointment)}
          sx={{ alignSelf: { xs: "stretch", sm: "auto" } }}
        >
          Novo atendimento
        </RoundedButton>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Autocomplete
          options={customerOptions}
          value={
            customerOptions.find((option) => option.value === customerId) ?? null
          }
          onChange={(_, option) => setCustomerId(option?.value ?? null)}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cliente"
              placeholder="Todos os clientes"
              size="small"
            />
          )}
          sx={{ minWidth: { md: 280 } }}
        />
        <TextField
          label="De"
          type="date"
          size="small"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="Até"
          type="date"
          size="small"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Stack>

      <Paper>
        <TableContainer
          contentHeight="min(60vh, 520px)"
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
              Nenhum atendimento encontrado.
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
                <TableCell>Data</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Profissional</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>
                    {formatAppointmentDate(appointment.appointmentDate)}
                  </TableCell>
                  <TableCell>{appointment.customerName}</TableCell>
                  <TableCell>{appointment.userName ?? "—"}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(appointment.total)}
                  </TableCell>
                  <TableCell align="right">
                    <MuiLink
                      component={Link}
                      to={`${siteMap.protected.appointments}/${appointment.id}`}
                      underline="hover"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <VisibilityOutlinedIcon fontSize="small" />
                      Ver detalhes
                    </MuiLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}

export default Appointments;
