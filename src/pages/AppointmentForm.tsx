import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ActionButton from "components/ActionButton";
import { RoundedButton } from "components/Button/RoundedButton";
import { useAuth } from "contexts/AuthContext";
import { useSnackbarContext } from "contexts/SnackbarContext";
import { SaveAppointmentPayload } from "interfaces/appointments";
import { appointmentServices } from "services/appointments";
import { customerServices } from "services/customers";
import { serviceServices } from "services/services";
import { userServices } from "services/users";
import siteMap from "routes/siteMap";
import { getApiErrorMessage } from "utils/apiError";
import { formatCurrency, roundMoney } from "utils/currency";
import {
  fromDateTimeLocalValue,
  toDateTimeLocalValue,
} from "utils/datetime";
import { isNumber } from "utils/math";

interface ServiceLine {
  key: string;
  serviceId: string | null;
  price: string;
}

interface SelectOption {
  label: string;
  value: string;
}

function createEmptyLine(): ServiceLine {
  return {
    key: crypto.randomUUID(),
    serviceId: null,
    price: "",
  };
}

function AppointmentForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [searchParams] = useSearchParams();
  const presetCustomerId = searchParams.get("customerId");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { snackSuccess, snackError } = useSnackbarContext();

  const [customerId, setCustomerId] = useState<string | null>(
    presetCustomerId
  );
  const [appointmentDateLocal, setAppointmentDateLocal] = useState(() =>
    toDateTimeLocalValue(new Date())
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState("0");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<ServiceLine[]>([createEmptyLine()]);
  const [isSaving, setIsSaving] = useState(false);

  const { data: customersData } = useQuery(["customers-options"], () =>
    customerServices.list({ page: 1 })
  );
  const { data: servicesData } = useQuery(["services"], () =>
    serviceServices.list()
  );
  const { data: usersData } = useQuery(["users"], () => userServices.list());
  const { data: appointmentDetail, isLoading: isLoadingDetail } = useQuery(
    ["appointment", id],
    () => appointmentServices.getById(id as string),
    { enabled: isEditing }
  );

  const customerOptions: SelectOption[] = useMemo(
    () =>
      (customersData?.data ?? []).map((customer) => ({
        label: customer.name,
        value: customer.id,
      })),
    [customersData]
  );

  const serviceOptions = useMemo(
    () =>
      (servicesData?.data ?? [])
        .filter((service) => service.active)
        .map((service) => ({
          label: service.name,
          value: service.id,
          price: service.price,
        })),
    [servicesData]
  );

  const userOptions: SelectOption[] = useMemo(
    () =>
      (usersData?.data ?? []).map((entry) => ({
        label: entry.name,
        value: entry.id,
      })),
    [usersData]
  );

  useEffect(() => {
    if (!appointmentDetail) {
      return;
    }

    setCustomerId(appointmentDetail.customerId);
    setAppointmentDateLocal(
      toDateTimeLocalValue(appointmentDetail.appointmentDate)
    );
    setUserId(appointmentDetail.userId);
    setDiscountAmount(String(appointmentDetail.discountAmount));
    setNotes(appointmentDetail.notes ?? "");
    setLines(
      appointmentDetail.items.map((item) => ({
        key: item.id,
        serviceId: item.serviceId,
        price: String(item.price),
      }))
    );
  }, [appointmentDetail]);

  useEffect(() => {
    if (!user?.id || userId || isEditing) {
      return;
    }

    setUserId(String(user.id));
  }, [user, userId, isEditing]);

  const parsedLines = useMemo(
    () =>
      lines
        .filter((line) => line.serviceId)
        .map((line) => ({
          serviceId: line.serviceId as string,
          price: roundMoney(Number(line.price)),
        })),
    [lines]
  );

  const subtotal = useMemo(
    () => roundMoney(parsedLines.reduce((sum, line) => sum + line.price, 0)),
    [parsedLines]
  );

  const parsedDiscount = useMemo(() => {
    if (!isNumber(discountAmount)) {
      return 0;
    }
    return roundMoney(Number(discountAmount));
  }, [discountAmount]);

  const total = useMemo(
    () => roundMoney(Math.max(subtotal - parsedDiscount, 0)),
    [parsedDiscount, subtotal]
  );

  async function refreshAppointmentsList() {
    await queryClient.resetQueries(["appointments"]);
  }

  const saveMutation = useMutation(
    (payload: SaveAppointmentPayload) =>
      isEditing
        ? appointmentServices.update(id as string, payload)
        : appointmentServices.create(payload),
    {
      onSuccess: async () => {
        await refreshAppointmentsList();
        if (isEditing && id) {
          await queryClient.resetQueries(["appointment", id]);
        }
        snackSuccess(
          isEditing ? "Atendimento atualizado." : "Atendimento registrado."
        );
        navigate(siteMap.protected.appointments);
      },
    }
  );

  function handleAddLine() {
    setLines((current) => [...current, createEmptyLine()]);
  }

  function handleRemoveLine(key: string) {
    setLines((current) =>
      current.length === 1
        ? current
        : current.filter((line) => line.key !== key)
    );
  }

  function handleServiceChange(key: string, serviceId: string | null) {
    const service = serviceOptions.find((option) => option.value === serviceId);
    setLines((current) =>
      current.map((line) =>
        line.key === key
          ? {
              ...line,
              serviceId,
              price: service ? String(service.price) : "",
            }
          : line
      )
    );
  }

  async function handleSubmit() {
    if (!customerId) {
      snackError("Selecione o cliente.");
      return;
    }

    if (!appointmentDateLocal) {
      snackError("Informe a data e hora do atendimento.");
      return;
    }

    if (parsedLines.length === 0) {
      snackError("Adicione pelo menos um serviço.");
      return;
    }

    if (parsedDiscount > subtotal) {
      snackError("O desconto não pode ser maior que o subtotal.");
      return;
    }

    if (!user?.id) {
      snackError("Usuário não identificado. Faça login novamente.");
      return;
    }

    const payload: SaveAppointmentPayload = {
      customerId,
      appointmentDate: fromDateTimeLocalValue(appointmentDateLocal),
      loggedUserId: String(user.id),
      userId,
      discountAmount: parsedDiscount,
      notes: notes.trim() ? notes.trim() : null,
      items: parsedLines,
    };

    setIsSaving(true);
    try {
      await saveMutation.mutateAsync(payload);
    } catch (error) {
      snackError(
        getApiErrorMessage(
          error,
          isEditing
            ? "Não foi possível atualizar o atendimento."
            : "Não foi possível registrar o atendimento."
        ),
        error
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isEditing && isLoadingDetail) {
    return <Typography>Carregando atendimento...</Typography>;
  }

  const selectedCustomer =
    customerOptions.find((option) => option.value === customerId) ?? null;
  const selectedUser =
    userOptions.find((option) => option.value === userId) ?? null;

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton
          aria-label="Voltar"
          onClick={() => navigate(siteMap.protected.appointments)}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700}>
          {isEditing ? "Editar atendimento" : "Novo atendimento"}
        </Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Autocomplete
              options={customerOptions}
              value={selectedCustomer}
              onChange={(_, option) => setCustomerId(option?.value ?? null)}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField {...params} label="Cliente" size="small" required />
              )}
              fullWidth
            />
            <TextField
              label="Data e hora"
              type="datetime-local"
              size="small"
              value={appointmentDateLocal}
              onChange={(event) => setAppointmentDateLocal(event.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <Autocomplete
              options={userOptions}
              value={selectedUser}
              onChange={(_, option) => setUserId(option?.value ?? null)}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Profissional"
                  size="small"
                  required
                />
              )}
              fullWidth
            />
          </Stack>

          <Stack spacing={2}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Serviços
              </Typography>
              <RoundedButton
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddLine}
              >
                Adicionar serviço
              </RoundedButton>
            </Stack>

            {lines.map((line) => {
              const selectedService =
                serviceOptions.find(
                  (option) => option.value === line.serviceId
                ) ?? null;

              return (
                <Stack
                  key={line.key}
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems={{ md: "center" }}
                >
                  <Autocomplete
                    options={serviceOptions}
                    value={selectedService}
                    onChange={(_, option) =>
                      handleServiceChange(line.key, option?.value ?? null)
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Serviço"
                        size="small"
                        required
                      />
                    )}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Preço cobrado"
                    size="small"
                    type="number"
                    inputProps={{ min: 0, step: "0.01" }}
                    value={line.price}
                    onChange={(event) =>
                      setLines((current) =>
                        current.map((entry) =>
                          entry.key === line.key
                            ? { ...entry, price: event.target.value }
                            : entry
                        )
                      )
                    }
                    sx={{ width: { md: 180 } }}
                  />
                  <IconButton
                    aria-label="Remover serviço"
                    onClick={() => handleRemoveLine(line.key)}
                    disabled={lines.length === 1}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Stack>
              );
            })}
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Desconto manual"
              size="small"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={discountAmount}
              onChange={(event) => setDiscountAmount(event.target.value)}
              fullWidth
            />
            <TextField
              label="Observações"
              size="small"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>

          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: "action.hover",
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="body2">
                Subtotal: {formatCurrency(subtotal)}
              </Typography>
              <Typography variant="body2">
                Desconto: {formatCurrency(parsedDiscount)}
              </Typography>
              <Typography variant="subtitle1" fontWeight={700}>
                Total: {formatCurrency(total)}
              </Typography>
            </Stack>
          </Box>

          {isEditing && appointmentDetail && (
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Datas de retorno sugeridas
              </Typography>
              {appointmentDetail.items.map((item) => (
                <Typography key={item.id} variant="body2" color="text.secondary">
                  {item.serviceName}:{" "}
                  {item.returnDueDate
                    ? new Date(`${item.returnDueDate}T12:00:00`).toLocaleDateString(
                        "pt-BR"
                      )
                    : "—"}
                </Typography>
              ))}
            </Stack>
          )}

          <ActionButton
            resolveMsg={
              isEditing ? "Salvar alterações" : "Registrar atendimento"
            }
            resolveLoading={isSaving}
            onResolve={handleSubmit}
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

export default AppointmentForm;
