import {
  CustomerRewardListItem,
  CustomerRewardServices,
  GrantManualCustomerRewardResponse,
  ListCustomerRewardsResponse,
} from "interfaces/customerRewards";

const mockRewards: CustomerRewardListItem[] = [];

export const mockCustomerRewardServices: CustomerRewardServices = {
  list: async (_customerId, params) => {
    const page = params?.page ?? 1;
    const perPage = params?.perPage ?? 10;
    const filtered = params?.status
      ? mockRewards.filter((item) => item.status === params.status)
      : mockRewards;
    const totalPages =
      filtered.length === 0 ? 0 : Math.ceil(filtered.length / perPage);
    const start = (page - 1) * perPage;

    return Promise.resolve<ListCustomerRewardsResponse>({
      data: filtered.slice(start, start + perPage),
      page,
      totalPages: totalPages || (filtered.length > 0 ? 1 : 0),
    });
  },
  grantManual: async (customerId, loyaltyRuleId) =>
    Promise.resolve<GrantManualCustomerRewardResponse>({
      reward: {
        id: crypto.randomUUID(),
        customerId,
        loyaltyRuleId,
        referralId: null,
        appointmentId: null,
        status: "AVAILABLE",
        grantedAt: new Date().toISOString(),
        expiresAt: null,
        usedAt: null,
        ruleName: "Cortesia",
        rewardType: "PERCENT_DISCOUNT",
        rewardValue: 10,
        freeServiceId: null,
        rewardSummary: "10% de desconto",
        triggerLabel: "Primeira visita",
        preview: "Benefício concedido manualmente",
      },
    }),
  cancel: async () => Promise.resolve(),
};
