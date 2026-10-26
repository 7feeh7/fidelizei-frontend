import packageJSON from "../package.json";

export const projectName = packageJSON.name;

export const API_URL =
  import.meta.env.VITE_APP_API_URL ?? "http://localhost:8000/";

/** quando true, os serviços usam os mocks de `services/mocks` */
export const MOCK_API = import.meta.env.VITE_APP_MOCK_API === "true";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: `@${projectName}:access_token`,
  REFRESH_TOKEN: `@${projectName}:refresh_token`,
  USER: `@${projectName}:user`,
  REMEMBERED_LOGIN: `@${projectName}:remembered_login`,
  HIDE_BILLED_AMOUNT: `@${projectName}:hide_billed_amount`,
};
