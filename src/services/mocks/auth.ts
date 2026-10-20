import { AuthServices } from "interfaces/auth";
import { delay } from "./delay";

const mockCurrentUser = {
  id: "user-1",
  name: "Profissional Demo",
  email: "demo@fidelizei.com",
};

/** Aceita qualquer email/senha que passe na validação do formulário. */
export const mockAuthServices: AuthServices = {
  async signIn() {
    await delay();
    return {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_in: 86_400,
    };
  },
  async getMe() {
    await delay();
    return mockCurrentUser;
  },
  async updateProfile(_id, payload) {
    await delay();
    mockCurrentUser.name = payload.name;
    mockCurrentUser.email = payload.email;
  },
  async requestNewPassword() {
    await delay();
  },
  async resetPassword() {
    await delay();
  },
};
