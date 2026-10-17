import {
  CustomerRewardListItem,
  CustomerRewardServices,
  GrantManualCustomerRewardResponse,
  ListCustomerRewardsResponse,
} from "interfaces/customerRewards";

const mockRewards: CustomerRewardListItem[] = [];

export const mockCustomerRewardServices: CustomerRewardServices = {
  list: async () =>
    Promise.resolve<ListCustomerRewardsResponse>({ data: mockRewards }),
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
