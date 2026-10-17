import { MOCK_API } from "config";
import {
  CreateCustomerPayload,
  CustomerServices,
  ListCustomersResponse,
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
    api.post("customers", payload).then(() => undefined),
  update: (id: string, payload: CreateCustomerPayload) =>
    api.patch(`customers/${id}`, payload).then(() => undefined),
  deactivate: (id: string) =>
    api.delete(`customers/${id}`).then(() => undefined),
};

export const customerServices = MOCK_API
  ? mockCustomerServices
  : apiCustomerServices;

export { CUSTOMERS_PAGE_SIZE };
