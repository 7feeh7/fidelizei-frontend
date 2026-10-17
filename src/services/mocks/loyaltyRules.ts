import {
  ListLoyaltyRulesResponse,
  LoyaltyRuleListItem,
  LoyaltyRulePayload,
  LoyaltyRuleServices,
} from "interfaces/loyaltyRules";
import { delay } from "./delay";

let rules: LoyaltyRuleListItem[] = [
  {
    id: "rule-1",
    name: "Indicação",
    description: null,
    triggerType: "REFERRAL_GIVEN",
    visitCount: null,
    rewardType: "PERCENT_DISCOUNT",
    rewardValue: 10,
    freeServiceId: null,
    freeServiceName: null,
    validDays: 30,
    active: true,
    rewardSummary: "10% de desconto",
    triggerLabel: "Indicação feita",
    preview:
      "Quando o cliente indicar alguém, o cliente ganha 10% de desconto, válida por 30 dias",
  },
];

function buildPresentation(
  payload: LoyaltyRulePayload,
  freeServiceName: string | null
): Pick<LoyaltyRuleListItem, "rewardSummary" | "triggerLabel" | "preview"> {
  const rewardSummary =
    payload.rewardType === "PERCENT_DISCOUNT"
      ? `${payload.rewardValue ?? 0}% de desconto`
      : payload.rewardType === "FIXED_DISCOUNT"
        ? `R$ ${(payload.rewardValue ?? 0).toFixed(2).replace(".", ",")} de desconto`
        : freeServiceName
          ? `${freeServiceName} grátis`
          : "Serviço grátis";

  const triggerLabel =
    payload.triggerType === "VISIT_COUNT" && payload.visitCount
      ? `${payload.visitCount}ª visita`
      : payload.triggerType === "FIRST_VISIT"
        ? "Primeira visita"
        : payload.triggerType === "REFERRAL_GIVEN"
          ? "Indicação feita"
          : payload.triggerType === "REFERRAL_RECEIVED"
            ? "Indicação recebida"
            : "Aniversário";

  let preview = `${triggerLabel}, o cliente ganha ${rewardSummary}`;
  if (payload.validDays != null) {
    preview += `, válida por ${payload.validDays} dias`;
  }

  return { rewardSummary, triggerLabel, preview };
}

export const mockLoyaltyRuleServices: LoyaltyRuleServices = {
  async list(): Promise<ListLoyaltyRulesResponse> {
    await delay();
    return { data: [...rules] };
  },

  async getById(id: string) {
    await delay();
    const rule = rules.find((item) => item.id === id);
    if (!rule) {
      throw new Error("Regra de fidelidade não encontrada");
    }
    return { ...rule };
  },

  async create(payload: LoyaltyRulePayload) {
    await delay();
    const presentation = buildPresentation(payload, null);
    rules = [
      {
        id: crypto.randomUUID(),
        ...payload,
        description: payload.description ?? null,
        visitCount: payload.visitCount ?? null,
        rewardValue: payload.rewardValue ?? null,
        freeServiceId: payload.freeServiceId ?? null,
        freeServiceName: null,
        validDays: payload.validDays ?? null,
        active: true,
        ...presentation,
      },
      ...rules,
    ];
  },

  async update(id: string, payload: LoyaltyRulePayload) {
    await delay();
    const index = rules.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Regra de fidelidade não encontrada");
    }

    const current = rules[index];
    const presentation = buildPresentation(
      payload,
      current.freeServiceName ?? null
    );

    rules = rules.map((item) =>
      item.id === id
        ? {
            ...item,
            ...payload,
            description: payload.description ?? null,
            visitCount: payload.visitCount ?? null,
            rewardValue: payload.rewardValue ?? null,
            freeServiceId: payload.freeServiceId ?? null,
            validDays: payload.validDays ?? null,
            ...presentation,
          }
        : item
    );
  },

  async setActive(id: string, active: boolean) {
    await delay();
    const index = rules.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Regra de fidelidade não encontrada");
    }

    rules = rules.map((item) =>
      item.id === id ? { ...item, active } : item
    );
  },
};
