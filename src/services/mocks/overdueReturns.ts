import {
  ListOverdueReturnsResponse,
  OverdueReturnsServices,
} from "interfaces/overdueReturns";
import { delay } from "./delay";

const MOCK_OVERDUE_RETURNS: ListOverdueReturnsResponse = {
  page: 1,
  totalPages: 1,
  data: [
    {
      customerId: "1",
      customerName: "Ana Souza",
      customerPhone: "85999990001",
      serviceName: "Hidratação",
      appointmentDate: "2026-08-28",
      returnDueDate: "2026-09-27",
      overdueDays: 19,
      additionalServicesCount: 1,
    },
    {
      customerId: "2",
      customerName: "Carla Mendes",
      customerPhone: "85999990002",
      serviceName: "Corte",
      appointmentDate: "2026-09-05",
      returnDueDate: "2026-10-05",
      overdueDays: 11,
      additionalServicesCount: 1,
    },
    {
      customerId: "3",
      customerName: "Juliana Rocha",
      customerPhone: "85999990003",
      serviceName: "Cauterização",
      appointmentDate: "2026-07-10",
      returnDueDate: "2026-10-08",
      overdueDays: 8,
      additionalServicesCount: 0,
    },
    {
      customerId: "4",
      customerName: "Renata Costa",
      customerPhone: "85999990004",
      serviceName: "Corte",
      appointmentDate: "2026-09-12",
      returnDueDate: "2026-10-12",
      overdueDays: 4,
      additionalServicesCount: 0,
    },
  ],
};

export const mockOverdueReturnsServices: OverdueReturnsServices = {
  list: async () => {
    await delay();
    return MOCK_OVERDUE_RETURNS;
  },
};
