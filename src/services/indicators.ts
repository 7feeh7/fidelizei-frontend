import { MOCK_API } from "config";
import type {
  IndicatorsServices,
  IndicatorsResponse,
} from "interfaces/indicators";
import { api } from "./api";
import { mockIndicatorsServices } from "./mocks/indicators";

const apiIndicatorsServices: IndicatorsServices = {
  get: (params) =>
    api
      .get<IndicatorsResponse>("indicators", { params })
      .then((res) => res.data),
};

export const indicatorsServices = MOCK_API
  ? mockIndicatorsServices
  : apiIndicatorsServices;
