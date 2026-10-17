import type { LoyaltyRewardType } from "interfaces/loyaltyRules";

export type CustomerRewardStatus =
  | "AVAILABLE"
  | "USED"
  | "EXPIRED"
  | "CANCELED";

export interface GrantedReward {
  id: string;
  ruleName: string;
  rewardSummary: string;
  preview: string;
}

export interface CustomerRewardListItem {
  id: string;
  customerId: string;
  loyaltyRuleId: string;
  referralId: string | null;
  appointmentId: string | null;
  status: CustomerRewardStatus;
  grantedAt: string;
  expiresAt: string | null;
  usedAt: string | null;
  ruleName: string;
  rewardType: LoyaltyRewardType;
  rewardValue: number | null;
  freeServiceId: string | null;
  rewardSummary: string;
  triggerLabel: string;
  preview: string;
}

export interface ListCustomerRewardsResponse {
  data: CustomerRewardListItem[];
}

export interface CreateCustomerResponse {
  grantedRewards: GrantedReward[];
}

export interface CreateAppointmentResponse {
  grantedRewards: GrantedReward[];
}

export interface GrantManualCustomerRewardResponse {
  reward: CustomerRewardListItem;
}

export interface CustomerRewardServices {
  list(
    customerId: string,
    status?: CustomerRewardStatus
  ): Promise<ListCustomerRewardsResponse>;
  grantManual(
    customerId: string,
    loyaltyRuleId: string
  ): Promise<GrantManualCustomerRewardResponse>;
  cancel(customerId: string, rewardId: string): Promise<void>;
}
