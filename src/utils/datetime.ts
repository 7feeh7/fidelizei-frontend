export function toDateTimeLocalValue(iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function fromDateTimeLocalValue(value: string): string {
  return new Date(value).toISOString();
}

export function startOfDayIso(dateValue: string): string {
  return new Date(`${dateValue}T00:00:00`).toISOString();
}

export function endOfDayIso(dateValue: string): string {
  return new Date(`${dateValue}T23:59:59.999`).toISOString();
}
