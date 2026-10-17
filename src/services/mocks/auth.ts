import { AuthServices } from "interfaces/auth";
import { delay } from "./delay";

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
  async requestNewPassword() {
    await delay();
  },
  async resetPassword() {
    await delay();
  },
};
