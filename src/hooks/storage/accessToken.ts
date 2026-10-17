import { STORAGE_KEYS } from "config";
import { createStorage } from "./createStorage";
import { IStorage } from "./interfaces";

export const accessTokenStorage = createStorage<string>(
  STORAGE_KEYS.ACCESS_TOKEN
);
export const refreshTokenStorage = createStorage<string>(
  STORAGE_KEYS.REFRESH_TOKEN
);

export function useStorageAccessToken(): IStorage<string> {
  return accessTokenStorage;
}

export function useStorageRefreshToken(): IStorage<string> {
  return refreshTokenStorage;
}
