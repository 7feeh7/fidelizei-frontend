import {
  CreateCustomerPayload,
  CustomerListItem,
  CustomerServices,
  ListCustomersParams,
} from "interfaces/customers";
import { delay } from "./delay";

const PAGE_SIZE = 10;

let customers: CustomerListItem[] = [
  {
    id: "1",
    name: "Ana Lima",
    phone: "11999990001",
    dateOfBirth: null,
    leadSource: "INSTAGRAM",
  },
  {
    id: "2",
    name: "Bruno Souza",
    phone: "11999990002",
    dateOfBirth: null,
    leadSource: "INDICACAO",
  },
  {
    id: "3",
    name: "Carla Mendes",
    phone: "21988880003",
    dateOfBirth: null,
    leadSource: "PANFLETO",
  },
  {
    id: "4",
    name: "Diego Alves",
    phone: "31977770004",
    dateOfBirth: null,
    leadSource: "OUTRO",
  },
  {
    id: "5",
    name: "Elisa Rocha",
    phone: "41966660005",
    dateOfBirth: null,
    leadSource: "INSTAGRAM",
  },
  {
    id: "6",
    name: "Felipe Costa",
    phone: "51955550006",
    dateOfBirth: null,
    leadSource: "INDICACAO",
  },
  {
    id: "7",
    name: "Gabriela Nunes",
    phone: "61944440007",
    dateOfBirth: null,
    leadSource: "PANFLETO",
  },
  {
    id: "8",
    name: "Henrique Dias",
    phone: "71933330008",
    dateOfBirth: null,
    leadSource: "OUTRO",
  },
  {
    id: "9",
    name: "Isabela Pires",
    phone: "81922220009",
    dateOfBirth: null,
    leadSource: "INSTAGRAM",
  },
  {
    id: "10",
    name: "João Pedro",
    phone: "91911110010",
    dateOfBirth: null,
    leadSource: "INDICACAO",
  },
  {
    id: "11",
    name: "Karina Veiga",
    phone: "11900000011",
    dateOfBirth: null,
    leadSource: "PANFLETO",
  },
  {
    id: "12",
    name: "Lucas Ferreira",
    phone: "11900000012",
    dateOfBirth: null,
    leadSource: "OUTRO",
  },
];

function filterCustomers(search?: string) {
  const term = search?.trim().toLowerCase();
  if (!term) {
    return customers;
  }

  return customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(term) ||
      customer.phone.includes(term)
  );
}

export const mockCustomerServices: CustomerServices = {
  async list({ page = 1, search }: ListCustomersParams = {}) {
    await delay(400);
    const filtered = filterCustomers(search);
    const totalPages =
      filtered.length === 0 ? 0 : Math.ceil(filtered.length / PAGE_SIZE);
    const start = (page - 1) * PAGE_SIZE;
    const data = filtered.slice(start, start + PAGE_SIZE);

    return { data, page, totalPages };
  },
  async create(payload: CreateCustomerPayload) {
    await delay(400);
    const phone = payload.phone.replace(/\D/g, "");
    const exists = customers.some((customer) => customer.phone === phone);
    if (exists) {
      throw new Error("O cliente já existe");
    }

    customers = [
      {
        id: crypto.randomUUID(),
        name: payload.name.trim(),
        phone,
        dateOfBirth: payload.dateOfBirth ?? null,
        leadSource: payload.leadSource,
      },
      ...customers,
    ];
  },
  async update(id: string, payload: CreateCustomerPayload) {
    await delay(400);
    const phone = payload.phone.replace(/\D/g, "");
    const index = customers.findIndex((customer) => customer.id === id);

    if (index === -1) {
      throw new Error("Cliente não encontrado");
    }

    const phoneInUse = customers.some(
      (customer) => customer.phone === phone && customer.id !== id
    );
    if (phoneInUse) {
      throw new Error("O cliente já existe");
    }

    customers = customers.map((customer) =>
      customer.id === id
        ? {
            ...customer,
            name: payload.name.trim(),
            phone,
            dateOfBirth: payload.dateOfBirth ?? null,
            leadSource: payload.leadSource,
          }
        : customer
    );
  },
  async deactivate(id: string) {
    await delay(400);
    const exists = customers.some((customer) => customer.id === id);
    if (!exists) {
      throw new Error("Cliente não encontrado");
    }

    customers = customers.filter((customer) => customer.id !== id);
  },
};
