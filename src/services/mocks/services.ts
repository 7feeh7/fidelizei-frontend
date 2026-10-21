import {
  CreateServicePayload,
  ListServicesResponse,
  ServiceListItem,
  ServiceServices,
  UpdateServicePayload,
} from "interfaces/services";
import { delay } from "./delay";

let services: ServiceListItem[] = [
  {
    id: "service-1",
    name: "Corte masculino",
    description: "Corte tradicional",
    price: 45.9,
    durationMinutes: 30,
    suggestedReturnDays: 21,
    active: true,
  },
  {
    id: "service-2",
    name: "Barba",
    description: null,
    price: 25,
    durationMinutes: null,
    suggestedReturnDays: 14,
    active: false,
  },
];

function findDuplicateName(name: string, ignoreId?: string) {
  return services.some(
    (service) =>
      service.id !== ignoreId &&
      service.name.toLowerCase() === name.toLowerCase()
  );
}

export const mockServiceServices: ServiceServices = {
  async list(): Promise<ListServicesResponse> {
    await delay();
    return { data: [...services] };
  },

  async create(payload: CreateServicePayload) {
    await delay();

    if (findDuplicateName(payload.name)) {
      throw new Error("O serviço já existe");
    }

    services = [
      {
        id: crypto.randomUUID(),
        name: payload.name,
        description: payload.description ?? null,
        price: payload.price,
        durationMinutes: payload.durationMinutes ?? null,
        suggestedReturnDays: payload.suggestedReturnDays ?? null,
        active: true,
      },
      ...services,
    ];
  },

  async update(id: string, payload: UpdateServicePayload) {
    await delay();

    const index = services.findIndex((service) => service.id === id);

    if (index === -1) {
      throw new Error("Serviço não encontrado");
    }

    if (findDuplicateName(payload.name, id)) {
      throw new Error("O serviço já existe");
    }

    services = services.map((service) =>
      service.id === id
        ? {
            ...service,
            name: payload.name,
            description: payload.description ?? null,
            price: payload.price,
            durationMinutes: payload.durationMinutes ?? null,
            suggestedReturnDays: payload.suggestedReturnDays ?? null,
          }
        : service
    );
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
