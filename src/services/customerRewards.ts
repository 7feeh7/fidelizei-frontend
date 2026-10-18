import { MOCK_API } from "config";
import {
  CustomerRewardServices,
  GrantManualCustomerRewardResponse,
  ListCustomerRewardsResponse,
} from "interfaces/customerRewards";
import { api } from "./api";
import { mockCustomerRewardServices } from "./mocks/customerRewards";

export const CUSTOMER_REWARDS_PAGE_SIZE = 10;

const apiCustomerRewardServices: CustomerRewardServices = {
  list: (customerId, params) =>
    api
      .get<ListCustomerRewardsResponse>(`customers/${customerId}/rewards`, {
        params: {
          status: params?.status,
          page: params?.page,
          perPage: params?.perPage ?? CUSTOMER_REWARDS_PAGE_SIZE,
        },
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
