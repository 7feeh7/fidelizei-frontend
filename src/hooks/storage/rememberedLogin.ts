import { STORAGE_KEYS } from "config";
import { createStorage } from "./createStorage";

export interface RememberedLogin {
  email: string;
  password: string;
}

export const rememberedLoginStorage = createStorage<RememberedLogin>(
  STORAGE_KEYS.REMEMBERED_LOGIN
);
