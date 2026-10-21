import { MOCK_API } from "config";
import {
  CreateServicePayload,
  ListServicesResponse,
  ServiceServices,
  UpdateServicePayload,
} from "interfaces/services";
import { api } from "./api";
import { mockServiceServices } from "./mocks/services";

const apiServiceServices: ServiceServices = {
  list: () => api.get<ListServicesResponse>("services").then((res) => res.data),
  create: (payload: CreateServicePayload) =>
    api.post("services", payload).then(() => undefined),
  update: (id: string, payload: UpdateServicePayload) =>
    api.patch(`services/${id}`, payload).then(() => undefined),
  deactivate: (id: string) =>
    api.delete(`services/${id}`).then(() => undefined),
};

export const serviceServices = MOCK_API
  ? mockServiceServices
  : apiServiceServices;
