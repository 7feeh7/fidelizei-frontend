import { MOCK_API } from "config";
import { CreateCustomerResponse } from "interfaces/customerRewards";
import {
  CreateCustomerPayload,
  CustomerReturnSummaryResponse,
  CustomerSummaryResponse,
  CustomerServices,
  ListCustomersResponse,
  ListMonthlyBirthdaysParams,
  ListMonthlyBirthdaysResponse,
} from "interfaces/customers";
import { api } from "./api";
import { mockCustomerServices } from "./mocks/customers";

const CUSTOMERS_PAGE_SIZE = 10;

const apiCustomerServices: CustomerServices = {
  list: ({ page = 1, search } = {}) =>
    api
      .get<ListCustomersResponse>("customers", {
        params: { page, perPage: CUSTOMERS_PAGE_SIZE, search },
      })
      .then((res) => res.data),
  create: (payload: CreateCustomerPayload) =>
    api
      .post<CreateCustomerResponse>("customers", payload)
      .then((res) => res.data),
  update: (id: string, payload: CreateCustomerPayload) =>
    api.patch(`customers/${id}`, payload).then(() => undefined),
  deactivate: (id: string) =>
    api.delete(`customers/${id}`).then(() => undefined),
  getReturnSummary: (customerId: string) =>
    api
      .get<CustomerReturnSummaryResponse>(
        `customers/${customerId}/return-summary`
      )
      .then((res) => res.data),
  getSummary: (customerId: string) =>
    api
      .get<CustomerSummaryResponse>(`customers/${customerId}/summary`)
      .then((res) => res.data),
  listMonthlyBirthdays: (params: ListMonthlyBirthdaysParams = {}) =>
    api
      .get<ListMonthlyBirthdaysResponse>("customers/birthdays", { params })
      .then((res) => res.data),
};

export const customerServices = MOCK_API
  ? mockCustomerServices
  : apiCustomerServices;

export { CUSTOMERS_PAGE_SIZE };
