import {
  LoyaltyRewardType,
  LoyaltyTriggerType,
} from "interfaces/loyaltyRules";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const LOYALTY_TRIGGER_OPTIONS: {
  value: LoyaltyTriggerType;
  label: string;
}[] = [
  { value: "FIRST_VISIT", label: "Primeira visita" },
  { value: "VISIT_COUNT", label: "Número de visitas" },
  { value: "REFERRAL_GIVEN", label: "Indicação feita" },
  { value: "REFERRAL_RECEIVED", label: "Indicação recebida" },
  { value: "BIRTHDAY", label: "Aniversário" },
];

export const LOYALTY_REWARD_OPTIONS: {
  value: LoyaltyRewardType;
  label: string;
}[] = [
  { value: "PERCENT_DISCOUNT", label: "Desconto percentual" },
  { value: "FIXED_DISCOUNT", label: "Desconto fixo" },
  { value: "FREE_SERVICE", label: "Serviço grátis" },
];

function formatRewardSummary(params: {
  rewardType: LoyaltyRewardType;
  rewardValue: number | null;
  freeServiceName?: string | null;
}) {
  switch (params.rewardType) {
    case "PERCENT_DISCOUNT":
      return `${params.rewardValue ?? 0}% de desconto`;
    case "FIXED_DISCOUNT":
      return `${currencyFormatter.format(params.rewardValue ?? 0)} de desconto`;
    case "FREE_SERVICE":
      return params.freeServiceName
        ? `${params.freeServiceName} grátis`
        : "Serviço grátis";
  }
}

function formatTriggerPreview(
  triggerType: LoyaltyTriggerType,
  visitCount: number | null
) {
  switch (triggerType) {
    case "FIRST_VISIT":
      return "Na primeira visita";
    case "VISIT_COUNT":
      return visitCount ? `Na ${visitCount}ª visita` : "Na visita indicada";
    case "REFERRAL_GIVEN":
      return "Quando o cliente indicar alguém";
    case "REFERRAL_RECEIVED":
      return "Quando o cliente for indicado";
    case "BIRTHDAY":
      return "No aniversário do cliente";
  }
}

export function buildLoyaltyRulePreview(params: {
  triggerType: LoyaltyTriggerType | "";
  visitCount: number | null;
  rewardType: LoyaltyRewardType | "";
  rewardValue: number | null;
  freeServiceName?: string | null;
  validDays: number | null;
}) {
  if (!params.triggerType || !params.rewardType) {
    return "Preencha os campos para ver a pré-visualização da regra.";
  }

  const rewardPart = formatRewardSummary({
    rewardType: params.rewardType,
    rewardValue: params.rewardValue,
    freeServiceName: params.freeServiceName,
  });

  let preview = `${formatTriggerPreview(params.triggerType, params.visitCount)}, o cliente ganha ${rewardPart}`;

  if (params.validDays != null) {
    preview += `, válida por ${params.validDays} dias`;
  }

  return preview;
}

export function formatLoyaltyRuleValidity(validDays: number | null) {
  if (validDays == null) {
    return "Sem validade";
  }

  return `${validDays} dias`;
}

export function formatLoyaltyRuleStatus(active: boolean) {
  return active ? "Ativa" : "Inativa";
}
