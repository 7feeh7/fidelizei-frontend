import { UserServices } from "interfaces/users";
import { delay } from "./delay";

export const mockUserServices: UserServices = {
  list: async () => {
    await delay();
    return {
      data: [
        { id: "user-1", name: "Profissional Demo" },
        { id: "user-2", name: "Recepcionista Demo" },
      ],
    };
  },
};
