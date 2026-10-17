import { MOCK_API } from "config";
import {
  CreateServicePayload,
  ListServicesResponse,
  ServiceServices,
} from "interfaces/services";
import { api } from "./api";
import { mockServiceServices } from "./mocks/services";

const apiServiceServices: ServiceServices = {
  list: () => api.get<ListServicesResponse>("services").then((res) => res.data),
  create: (payload: CreateServicePayload) =>
    api.post("services", payload).then(() => undefined),
  deactivate: (id: string) =>
    api.delete(`services/${id}`).then(() => undefined),
};

export const serviceServices = MOCK_API
  ? mockServiceServices
  : apiServiceServices;
