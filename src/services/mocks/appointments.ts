import {
  AppointmentDetail,
  AppointmentServices,
  ListAppointmentsParams,
  SaveAppointmentPayload,
} from "interfaces/appointments";
import { delay } from "./delay";

const appointments: AppointmentDetail[] = [
  {
    id: "appt-1",
    customerId: "1",
    customerName: "Ana Lima",
    userId: "user-1",
    userName: "Profissional Demo",
    appointmentDate: new Date().toISOString(),
    subtotal: 150,
    discountAmount: 10,
    total: 140,
    notes: "Cliente preferiu horário da tarde.",
    usedReward: null,
    items: [
      {
        id: "item-1",
        serviceId: "svc-1",
        serviceName: "Corte feminino",
        price: 90,
        returnDueDate: "2026-11-16",
      },
      {
        id: "item-2",
        serviceId: "svc-2",
        serviceName: "Hidratação",
        price: 60,
        returnDueDate: null,
      },
    ],
  },
];

function toListItem(appointment: AppointmentDetail) {
  return {
    id: appointment.id,
    customerId: appointment.customerId,
    customerName: appointment.customerName,
    userId: appointment.userId,
    userName: appointment.userName,
    appointmentDate: appointment.appointmentDate,
    subtotal: appointment.subtotal,
    discountAmount: appointment.discountAmount,
    total: appointment.total,
  };
}

export const mockAppointmentServices: AppointmentServices = {
  list: async (params: ListAppointmentsParams = {}) => {
    await delay();
    let filtered = [...appointments];

    if (params.customerId) {
      filtered = filtered.filter(
        (item) => item.customerId === params.customerId
      );
    }

    const page = params.page ?? 1;
    const start = (page - 1) * 10;
    const slice = filtered.slice(start, start + 10);

    return {
      data: slice.map(toListItem),
      page,
      totalPages: Math.max(1, Math.ceil(filtered.length / 10)),
    };
  },
  getById: async (id: string) => {
    await delay();
    const found = appointments.find((item) => item.id === id);
    if (!found) {
      throw new Error("Atendimento não encontrado");
    }
    return found;
  },
  create: async (payload: SaveAppointmentPayload) => {
    await delay();
    const subtotal = payload.items.reduce((sum, item) => sum + item.price, 0);
    const discountAmount = payload.discountAmount ?? 0;
    const total = subtotal - discountAmount;
    appointments.unshift({
      id: `appt-${Date.now()}`,
      customerId: payload.customerId,
      customerName: "Cliente mock",
      userId: payload.userId ?? payload.loggedUserId,
      userName: "Profissional Demo",
      appointmentDate: payload.appointmentDate,
      subtotal,
      discountAmount,
      total,
      notes: payload.notes ?? null,
      usedReward: null,
      items: payload.items.map((item, index) => ({
        id: `item-${Date.now()}-${index}`,
        serviceId: item.serviceId,
        serviceName: `Serviço ${item.serviceId}`,
        price: item.price,
        returnDueDate: null,
      })),
    });

    return { grantedRewards: [] };
  },
  update: async (id: string, payload: SaveAppointmentPayload) => {
    await delay();
    const index = appointments.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("Atendimento não encontrado");
    }
    const subtotal = payload.items.reduce((sum, item) => sum + item.price, 0);
    const discountAmount = payload.discountAmount ?? 0;
    appointments[index] = {
      ...appointments[index],
      customerId: payload.customerId,
      appointmentDate: payload.appointmentDate,
      userId: payload.userId ?? payload.loggedUserId,
      subtotal,
      discountAmount,
      total: subtotal - discountAmount,
      notes: payload.notes ?? null,
      items: payload.items.map((item, itemIndex) => ({
        id: appointments[index].items[itemIndex]?.id ?? `item-${itemIndex}`,
        serviceId: item.serviceId,
        serviceName:
          appointments[index].items[itemIndex]?.serviceName ??
          `Serviço ${item.serviceId}`,
        price: item.price,
        returnDueDate: appointments[index].items[itemIndex]?.returnDueDate ?? null,
      })),
    };
  },
};
