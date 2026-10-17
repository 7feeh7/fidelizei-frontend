import { MOCK_API } from "config";
import { AuthServices, SignInResponse } from "interfaces/auth";
import { api } from "./api";
import { mockAuthServices } from "./mocks/auth";

// ajuste os endpoints conforme a API do produto
const apiAuthServices: AuthServices = {
  signIn: (payload) =>
    api.post<SignInResponse>("login", payload).then((res) => res.data),
  requestNewPassword: (email) =>
    api.post("password/request", { email }).then(() => undefined),
  resetPassword: (payload) =>
    api.post("password/reset", payload).then(() => undefined),
};

export const authServices = MOCK_API ? mockAuthServices : apiAuthServices;
