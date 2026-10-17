import { AuthServices } from "interfaces/auth";
import { delay } from "./delay";

/** Aceita qualquer email/senha que passe na validação do formulário. */
export const mockAuthServices: AuthServices = {
  async signIn({ username }) {
    await delay();
    return {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      user: {
        id: 1,
        name: username.split("@")[0],
        email: username,
        role: "Administrador",
      },
    };
  },
  async requestNewPassword() {
    await delay();
  },
  async resetPassword() {
    await delay();
  },
};
