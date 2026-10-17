export interface IStorage<T = unknown> {
  get: () => T | null;
  set: (value: T) => void;
  destroy: () => void;
}
