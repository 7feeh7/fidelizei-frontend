import { STORAGE_KEYS } from "config";
import { createStorage } from "./createStorage";

export const hideBilledAmountStorage = createStorage<boolean>(
  STORAGE_KEYS.HIDE_BILLED_AMOUNT
);
