import { useMemo, useState } from "react";
import {
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "react-query";
import { DefaultRenderContainer } from "components/RenderList";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "components/Tables";
import { customerServices } from "services/customers";
import {
  formatDateOfBirthDisplay,
} from "utils/birthday";

const MONTH_OPTIONS = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

function MonthlyBirthdays() {
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data, isLoading, isError } = useQuery(
    ["monthly-birthdays", year, month],
    () => customerServices.listMonthlyBirthdays({ year, month })
  );

  const birthdays = data?.data ?? [];
  const monthLabel =
    MONTH_OPTIONS.find((option) => option.value === month)?.label ?? "";

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        Aniversariantes do mês
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          select
          label="Mês"
          value={month}
          onChange={(event) => setMonth(Number(event.target.value))}
          sx={{ minWidth: 180 }}
        >
          {MONTH_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Ano"
          type="number"
          value={year}
          onChange={(event) => setYear(Number(event.target.value))}
          inputProps={{ min: 1900, max: 2200 }}
          sx={{ width: 140 }}
        />
      </Stack>

      <Paper>
        <TableContainer
          isLoading={isLoading}
          hasError={isError}
          errorFeedback={
            <DefaultRenderContainer>
              Não foi possível carregar os aniversariantes.
            </DefaultRenderContainer>
          }
          isEmpty={!isLoading && birthdays.length === 0}
          emptyFeedback={
            <DefaultRenderContainer>
              Nenhum aniversariante em {monthLabel.toLowerCase()} de {year}.
            </DefaultRenderContainer>
          }
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Aniversário</TableCell>
                <TableCell align="right">Idade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {birthdays.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    {formatDateOfBirthDisplay(customer.dateOfBirth) ?? "—"}
                  </TableCell>
                  <TableCell align="right">{customer.age} anos</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}

export default MonthlyBirthdays;
