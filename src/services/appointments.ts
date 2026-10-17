import { MOCK_API } from "config";
import { CreateAppointmentResponse } from "interfaces/customerRewards";
import {
  AppointmentDetail,
  AppointmentServices,
  ListAppointmentsResponse,
  SaveAppointmentPayload,
} from "interfaces/appointments";
import { api } from "./api";
import { mockAppointmentServices } from "./mocks/appointments";

const APPOINTMENTS_PAGE_SIZE = 10;

const apiAppointmentServices: AppointmentServices = {
  list: ({ page = 1, customerId, startDate, endDate } = {}) =>
    api
      .get<ListAppointmentsResponse>("appointments", {
        params: {
          page,
          perPage: APPOINTMENTS_PAGE_SIZE,
          customerId,
          startDate,
          endDate,
        },
      })
      .then((res) => res.data),
  getById: (id: string) =>
    api.get<AppointmentDetail>(`appointments/${id}`).then((res) => res.data),
  create: (payload: SaveAppointmentPayload) =>
    api
      .post<CreateAppointmentResponse>("appointments", payload)
      .then((res) => res.data),
  update: (id: string, payload: SaveAppointmentPayload) =>
    api.patch(`appointments/${id}`, payload).then(() => undefined),
};

export const appointmentServices = MOCK_API
  ? mockAppointmentServices
  : apiAppointmentServices;

export { APPOINTMENTS_PAGE_SIZE };
