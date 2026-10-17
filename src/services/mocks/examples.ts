import { ExampleItem, ExampleServices } from "interfaces/example";
import { delay } from "./delay";

const DAY = 24 * 60 * 60 * 1000;

let items: ExampleItem[] = [
  "Contrato de serviço",
  "Relatório mensal",
  "Pedido de compra",
  "Nota fiscal",
  "Proposta comercial",
  "Ordem de produção",
].map((name, index) => ({
  id: index + 1,
  name,
  status: index % 3 === 0 ? "inativo" : "ativo",
  createdAt: new Date(Date.now() - index * DAY).toISOString(),
}));

export const mockExampleServices: ExampleServices = {
  async list(search = "") {
    await delay(400);
    const term = search.trim().toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(term));
  },
  async remove(id) {
    await delay(400);
    items = items.filter((item) => item.id !== id);
  },
};
