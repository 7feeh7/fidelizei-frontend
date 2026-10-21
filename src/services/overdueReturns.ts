import { MOCK_API } from "config";
import {
  ListOverdueReturnsResponse,
  OverdueReturnsServices,
} from "interfaces/overdueReturns";
import { api } from "./api";
import { mockOverdueReturnsServices } from "./mocks/overdueReturns";

const OVERDUE_RETURNS_PAGE_SIZE = 5;

const apiOverdueReturnsServices: OverdueReturnsServices = {
  list: ({ page = 1, perPage = OVERDUE_RETURNS_PAGE_SIZE } = {}) =>
    api
      .get<ListOverdueReturnsResponse>("overdue-returns", {
        params: { page, perPage },
      })
      .then((res) => res.data),
};

export const overdueReturnsServices = MOCK_API
  ? mockOverdueReturnsServices
  : apiOverdueReturnsServices;
