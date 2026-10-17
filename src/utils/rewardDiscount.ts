import { LoyaltyRewardType } from "interfaces/loyaltyRules";
import { roundMoney } from "utils/currency";

export interface RewardDiscountInput {
  rewardType: LoyaltyRewardType;
  rewardValue: number | null;
  freeServiceId: string | null;
  subtotal: number;
  items: Array<{ serviceId: string; price: number }>;
}

export function computeRewardDiscount(input: RewardDiscountInput): number | null {
  const { rewardType, subtotal } = input;

  if (subtotal <= 0) {
    return 0;
  }

  switch (rewardType) {
    case "PERCENT_DISCOUNT": {
      if (input.rewardValue == null || input.rewardValue <= 0) {
        return null;
      }
      return roundMoney(subtotal * (input.rewardValue / 100));
    }
    case "FIXED_DISCOUNT": {
      if (input.rewardValue == null || input.rewardValue <= 0) {
        return null;
      }
      return roundMoney(Math.min(input.rewardValue, subtotal));
    }
    case "FREE_SERVICE": {
      if (!input.freeServiceId) {
        return null;
      }

      const matchingItem = input.items.find(
        (item) => item.serviceId === input.freeServiceId
      );

      if (!matchingItem) {
        return null;
      }

      return roundMoney(Math.min(matchingItem.price, subtotal));
    }
    default:
      return null;
  }
}

export function isFreeServiceRewardApplicable(
  freeServiceId: string | null,
  items: Array<{ serviceId: string }>
) {
  if (!freeServiceId) {
    return true;
  }

  return items.some((item) => item.serviceId === freeServiceId);
}
