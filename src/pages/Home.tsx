import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import appConfig from "app.config";
import IndicatorCard from "components/Indicators/IndicatorCard";
import { useAuth } from "contexts/AuthContext";
import { indicatorsServices } from "services/indicators";
import { formatCurrency } from "utils/currency";
import {
  getCurrentMonthDateRange,
  getEarliestIndicatorsDate,
  getTodayDateOnly,
  isIndicatorsRangeValid,
} from "utils/indicatorsDateRange";

function Home() {
  const { user } = useAuth();
  const now = useMemo(() => new Date(), []);
  const defaultRange = useMemo(() => getCurrentMonthDateRange(now), [now]);
  const minDate = useMemo(() => getEarliestIndicatorsDate(now), [now]);
  const maxDate = useMemo(() => getTodayDateOnly(now), [now]);

  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);

  const isRangeValid = isIndicatorsRangeValid(startDate, endDate, now);

  const { data, isLoading, isError } = useQuery(
    ["indicators", startDate, endDate],
    () => indicatorsServices.get({ startDate, endDate }),
    { enabled: isRangeValid }
  );

  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="h4" fontWeight={700}>
          Olá, {user?.name}
        </Typography>
        <Typography color="text.secondary">
          Bem-vindo ao {appConfig.name}.
        </Typography>
      </div>

      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
        >
          <Typography variant="h6" fontWeight={700}>
            Resumo
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              label="De"
              type="date"
              size="small"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: minDate, max: maxDate }}
              fullWidth
            />
            <TextField
              label="Até"
              type="date"
              size="small"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: minDate, max: maxDate }}
              fullWidth
            />
          </Stack>
        </Stack>

        {!isRangeValid ? (
          <Alert severity="warning">
            Selecione um período válido de até 12 meses dentro dos últimos 12
            meses.
          </Alert>
        ) : null}

        {isError ? (
          <Alert severity="error">
            Não foi possível carregar os indicadores.
          </Alert>
        ) : null}

        {isRangeValid && isLoading ? (
          <Stack alignItems="center" py={6}>
            <CircularProgress />
          </Stack>
        ) : null}

        {isRangeValid && !isLoading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            <IndicatorCard
              icon={<EventAvailableOutlinedIcon />}
              value={String(data?.appointmentsCount ?? 0)}
              description="atendimentos"
            />
            <IndicatorCard
              icon={<AttachMoneyOutlinedIcon />}
              value={formatCurrency(data?.billedAmount ?? 0)}
              description="faturado"
            />
            <IndicatorCard
              icon={<PersonAddOutlinedIcon />}
              value={String(data?.newCustomersCount ?? 0)}
              description="clientes novos"
            />
            <IndicatorCard
              icon={<ShareOutlinedIcon />}
              value={String(data?.convertedReferralsCount ?? 0)}
              description="indicações que viraram clientes"
            />
          </Box>
        ) : null}
      </Stack>
    </Stack>
  );
}

export default Home;
