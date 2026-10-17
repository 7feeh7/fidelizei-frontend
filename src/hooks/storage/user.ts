import { STORAGE_KEYS } from "config";
import { User } from "interfaces/auth";
import { createStorage } from "./createStorage";

export const userStorage = createStorage<User>(STORAGE_KEYS.USER);
