import { MOCK_API } from "config";
import {
  CreateReferralPayload,
  ListReferralsResponse,
  ReferralServices,
} from "interfaces/referrals";
import { api } from "./api";
import { mockReferralServices } from "./mocks/referrals";

const REFERRALS_PAGE_SIZE = 10;

const apiReferralServices: ReferralServices = {
  list: ({ page = 1, status, referrerId } = {}) =>
    api
      .get<ListReferralsResponse>("referrals", {
        params: {
          page,
          perPage: REFERRALS_PAGE_SIZE,
          status,
          referrerId,
        },
      })
      .then((res) => res.data),
  create: (payload: CreateReferralPayload) =>
    api.post("referrals", payload).then(() => undefined),
  cancel: (id: string) =>
    api.patch(`referrals/${id}/cancel`).then(() => undefined),
};

export const referralServices = MOCK_API
  ? mockReferralServices
  : apiReferralServices;

export { REFERRALS_PAGE_SIZE };
