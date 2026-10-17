export const LOYALTY_TRIGGER_TYPES = [
  "FIRST_VISIT",
  "VISIT_COUNT",
  "REFERRAL_GIVEN",
  "REFERRAL_RECEIVED",
  "BIRTHDAY",
] as const;

export const LOYALTY_REWARD_TYPES = [
  "PERCENT_DISCOUNT",
  "FIXED_DISCOUNT",
  "FREE_SERVICE",
] as const;

export type LoyaltyTriggerType = (typeof LOYALTY_TRIGGER_TYPES)[number];
export type LoyaltyRewardType = (typeof LOYALTY_REWARD_TYPES)[number];

export interface LoyaltyRuleListItem {
  id: string;
  name: string;
  description: string | null;
  triggerType: LoyaltyTriggerType;
  visitCount: number | null;
  rewardType: LoyaltyRewardType;
  rewardValue: number | null;
  freeServiceId: string | null;
  freeServiceName: string | null;
  validDays: number | null;
  active: boolean;
  rewardSummary: string;
  triggerLabel: string;
  preview: string;
}

export interface ListLoyaltyRulesResponse {
  data: LoyaltyRuleListItem[];
}

export interface LoyaltyRulePayload {
  name: string;
  description?: string | null;
  triggerType: LoyaltyTriggerType;
  visitCount?: number | null;
  rewardType: LoyaltyRewardType;
  rewardValue?: number | null;
  freeServiceId?: string | null;
  validDays?: number | null;
}

export interface LoyaltyRuleServices {
  list(): Promise<ListLoyaltyRulesResponse>;
  getById(id: string): Promise<LoyaltyRuleListItem>;
  create(payload: LoyaltyRulePayload): Promise<void>;
  update(id: string, payload: LoyaltyRulePayload): Promise<void>;
  setActive(id: string, active: boolean): Promise<void>;
}
