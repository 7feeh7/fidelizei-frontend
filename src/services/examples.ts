import { MOCK_API } from "config";
import { ExampleItem, ExampleServices } from "interfaces/example";
import { api } from "./api";
import { mockExampleServices } from "./mocks/examples";

const apiExampleServices: ExampleServices = {
  list: (search) =>
    api
      .get<ExampleItem[]>("examples", { params: { search } })
      .then((res) => res.data),
  remove: (id) => api.delete(`examples/${id}`).then(() => undefined),
};

export const exampleServices = MOCK_API
  ? mockExampleServices
  : apiExampleServices;
