import { IStorage } from "./interfaces";

export function createStorage<T>(key: string): IStorage<T> {
  return {
    get: () => {
      try {
        const value = localStorage.getItem(key);
        return value ? (JSON.parse(value) as T) : null;
      } catch {
        return null;
      }
    },
    set: (value) => localStorage.setItem(key, JSON.stringify(value)),
    destroy: () => localStorage.removeItem(key),
  };
}
