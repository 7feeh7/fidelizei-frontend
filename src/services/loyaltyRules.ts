import { MOCK_API } from "config";
import {
  ListLoyaltyRulesResponse,
  LoyaltyRuleListItem,
  LoyaltyRulePayload,
  LoyaltyRuleServices,
} from "interfaces/loyaltyRules";
import { api } from "./api";
import { mockLoyaltyRuleServices } from "./mocks/loyaltyRules";

const apiLoyaltyRuleServices: LoyaltyRuleServices = {
  list: () =>
    api.get<ListLoyaltyRulesResponse>("loyalty-rules").then((res) => res.data),
  getById: (id: string) =>
    api.get<LoyaltyRuleListItem>(`loyalty-rules/${id}`).then((res) => res.data),
  create: (payload: LoyaltyRulePayload) =>
    api.post("loyalty-rules", payload).then(() => undefined),
  update: (id: string, payload: LoyaltyRulePayload) =>
    api.patch(`loyalty-rules/${id}`, payload).then(() => undefined),
  setActive: (id: string, active: boolean) =>
    api.patch(`loyalty-rules/${id}/active`, { active }).then(() => undefined),
};

export const loyaltyRuleServices = MOCK_API
  ? mockLoyaltyRuleServices
  : apiLoyaltyRuleServices;
