export const MONTH_OPTIONS = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
] as const;

export function getMonthLabel(month: number): string {
  return MONTH_OPTIONS.find((option) => option.value === month)?.label ?? "";
}

export function buildMonthYearOptions(monthsBack = 24) {
  const options: { value: string; year: number; month: number; label: string }[] =
    [];
  const cursor = new Date();

  for (let index = 0; index < monthsBack; index += 1) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth() + 1;
    options.push({
      value: `${year}-${month}`,
      year,
      month,
      label: `${getMonthLabel(month)} de ${year}`,
    });

    cursor.setMonth(cursor.getMonth() - 1);
  }

  return options;
}

export function buildYearOptions(yearsBack = 5) {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: yearsBack }, (_, index) => currentYear - index);
}
