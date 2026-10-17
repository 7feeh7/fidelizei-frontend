import { useState } from "react";
import { Chip, Paper, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { RoundedButton } from "components/Button/RoundedButton";
import LoyaltyRuleFormDialog from "components/LoyaltyRules/LoyaltyRuleFormDialog";
import LoyaltyRuleRowActions from "components/LoyaltyRules/LoyaltyRuleRowActions";
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
  LoyaltyRuleListItem,
  LoyaltyRulePayload,
} from "interfaces/loyaltyRules";
import { loyaltyRuleServices } from "services/loyaltyRules";
import { serviceServices } from "services/services";
import { getApiErrorMessage } from "utils/apiError";
import {
  formatLoyaltyRuleStatus,
  formatLoyaltyRuleValidity,
} from "utils/loyaltyRulePresentation";

function LoyaltyRules() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<LoyaltyRuleListItem | null>(
    null
  );
  const queryClient = useQueryClient();
  const { snackSuccess, snackError } = useSnackbarContext();

  const { data, isLoading, isError } = useQuery(["loyalty-rules"], () =>
    loyaltyRuleServices.list()
  );

  const { data: servicesData } = useQuery(["services"], () =>
    serviceServices.list()
  );

  const rules = data?.data ?? [];
  const services = servicesData?.data ?? [];

  async function refreshRules() {
    await queryClient.invalidateQueries(["loyalty-rules"]);
  }

  const createMutation = useMutation(loyaltyRuleServices.create, {
    onSuccess: async () => {
      await refreshRules();
      snackSuccess("Regra cadastrada.");
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation(
    ({ id, payload }: { id: string; payload: LoyaltyRulePayload }) =>
      loyaltyRuleServices.update(id, payload),
    {
      onSuccess: async () => {
        await refreshRules();
        snackSuccess("Regra atualizada.");
        setEditingRule(null);
        setFormOpen(false);
      },
    }
  );

  const toggleActiveMutation = useMutation(
    ({ id, active }: { id: string; active: boolean }) =>
      loyaltyRuleServices.setActive(id, active),
    {
      onSuccess: async (_data, variables) => {
        await refreshRules();
        snackSuccess(
          variables.active ? "Regra ativada." : "Regra inativada."
        );
      },
    }
  );

  async function handleSubmit(payload: LoyaltyRulePayload) {
    try {
      if (editingRule) {
        await updateMutation.mutateAsync({ id: editingRule.id, payload });
        return;
      }

      await createMutation.mutateAsync(payload);
    } catch (error) {
      snackError(
        getApiErrorMessage(
          error,
          editingRule
            ? "Não foi possível atualizar a regra."
            : "Não foi possível cadastrar a regra."
        ),
        error
      );
      throw error;
    }
  }

  async function handleToggleActive(rule: LoyaltyRuleListItem) {
    try {
      await toggleActiveMutation.mutateAsync({
        id: rule.id,
        active: !rule.active,
      });
    } catch (error) {
      snackError(
        getApiErrorMessage(error, "Não foi possível alterar o status da regra."),
        error
      );
    }
  }

  function openCreateDialog() {
    setEditingRule(null);
    setFormOpen(true);
  }

  function openEditDialog(rule: LoyaltyRuleListItem) {
    setEditingRule(rule);
    setFormOpen(true);
  }

  function closeFormDialog() {
    setFormOpen(false);
    setEditingRule(null);
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        Regras de fidelidade
      </Typography>

      <Stack direction="row" justifyContent="flex-end">
        <RoundedButton startIcon={<AddIcon />} onClick={openCreateDialog}>
          Nova regra
        </RoundedButton>
      </Stack>

      <Paper>
        <TableContainer
          contentHeight="min(60vh, 520px)"
          isLoading={isLoading}
          hasError={isError}
          errorFeedback={
            <DefaultRenderContainer>
              Não foi possível carregar as regras de fidelidade.
            </DefaultRenderContainer>
          }
          isEmpty={!isLoading && rules.length === 0}
          emptyFeedback={
            <DefaultRenderContainer>
              Nenhuma regra cadastrada.
            </DefaultRenderContainer>
          }
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Gatilho</TableCell>
                <TableCell>Recompensa</TableCell>
                <TableCell>Validade</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rules.map((rule) => (
                <TableRow
                  key={rule.id}
                  hover
                  sx={rule.active ? undefined : { opacity: 0.6 }}
                >
                  <TableCell>{rule.name}</TableCell>
                  <TableCell>{rule.triggerLabel}</TableCell>
                  <TableCell>{rule.rewardSummary}</TableCell>
                  <TableCell>{formatLoyaltyRuleValidity(rule.validDays)}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={formatLoyaltyRuleStatus(rule.active)}
                      color={rule.active ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <LoyaltyRuleRowActions
                      rule={rule}
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

      <LoyaltyRuleFormDialog
        open={formOpen}
        rule={editingRule}
        services={services}
        onClose={closeFormDialog}
        onSubmit={handleSubmit}
      />
    </Stack>
  );
}

export default LoyaltyRules;
