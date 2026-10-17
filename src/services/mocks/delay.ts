export const delay = (ms = 600) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
