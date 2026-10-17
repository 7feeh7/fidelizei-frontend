import { MOCK_API } from "config";
import {
  CustomerRewardServices,
  GrantManualCustomerRewardResponse,
  ListCustomerRewardsResponse,
} from "interfaces/customerRewards";
import { api } from "./api";
import { mockCustomerRewardServices } from "./mocks/customerRewards";

const apiCustomerRewardServices: CustomerRewardServices = {
  list: (customerId, status) =>
    api
      .get<ListCustomerRewardsResponse>(`customers/${customerId}/rewards`, {
        params: status ? { status } : undefined,
      })
      .then((res) => res.data),
  grantManual: (customerId, loyaltyRuleId) =>
    api
      .post<GrantManualCustomerRewardResponse>(
        `customers/${customerId}/rewards`,
        { loyaltyRuleId }
      )
      .then((res) => res.data),
  cancel: (customerId, rewardId) =>
    api
      .patch(`customers/${customerId}/rewards/${rewardId}/cancel`)
      .then(() => undefined),
};

export const customerRewardServices = MOCK_API
  ? mockCustomerRewardServices
  : apiCustomerRewardServices;
