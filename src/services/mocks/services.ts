import {
  CreateServicePayload,
  ListServicesResponse,
  ServiceListItem,
  ServiceServices,
} from "interfaces/services";
import { delay } from "./delay";

let services: ServiceListItem[] = [
  {
    id: "service-1",
    name: "Corte masculino",
    price: 45.9,
    suggestedReturnDays: 21,
    active: true,
  },
  {
    id: "service-2",
    name: "Barba",
    price: 25,
    suggestedReturnDays: 14,
    active: false,
  },
];

export const mockServiceServices: ServiceServices = {
  async list(): Promise<ListServicesResponse> {
    await delay();
    return { data: [...services] };
  },

  async create(payload: CreateServicePayload) {
    await delay();

    const duplicated = services.some(
      (service) => service.name.toLowerCase() === payload.name.toLowerCase()
    );

    if (duplicated) {
      throw new Error("O serviço já existe");
    }

    services = [
      ...services,
      {
        id: crypto.randomUUID(),
        name: payload.name,
        price: payload.price,
        suggestedReturnDays: payload.suggestedReturnDays ?? null,
        active: true,
      },
    ];
  },

  async deactivate(id: string) {
    await delay();

    const index = services.findIndex(
      (service) => service.id === id && service.active
    );

    if (index === -1) {
      throw new Error("Serviço não encontrado");
    }

    services = services.map((service) =>
      service.id === id ? { ...service, active: false } : service
    );
  },
};
