import { MOCK_API } from "config";
import { ListUsersResponse, UserServices } from "interfaces/users";
import { api } from "./api";
import { mockUserServices } from "./mocks/users";

const apiUserServices: UserServices = {
  list: () => api.get<ListUsersResponse>("users").then((res) => res.data),
};

export const userServices = MOCK_API ? mockUserServices : apiUserServices;
