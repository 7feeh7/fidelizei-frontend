export const INDICATORS_MAX_MONTHS = 12;

export interface IndicatorsDateRange {
  startDate: string;
  endDate: string;
}

function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getLastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getTodayDateOnly(referenceDate = new Date()): string {
  return formatDateOnly(referenceDate);
}

export function getCurrentMonthDateRange(
  referenceDate = new Date()
): IndicatorsDateRange {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth() + 1;
  const monthPart = `${year}-${String(month).padStart(2, "0")}`;
  const lastDay = getLastDayOfMonth(year, month);
  const today = getTodayDateOnly(referenceDate);
  const endOfMonth = `${monthPart}-${String(lastDay).padStart(2, "0")}`;

  return {
    startDate: `${monthPart}-01`,
    endDate: endOfMonth > today ? today : endOfMonth,
  };
}

export function getEarliestIndicatorsDate(
  referenceDate = new Date()
): string {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth() + 1;
  const earliest = new Date(year, month - 1 - (INDICATORS_MAX_MONTHS - 1), 1);
  return formatDateOnly(earliest);
}

function countMonthsInRange(startDate: string, endDate: string): number {
  const startYear = Number(startDate.slice(0, 4));
  const startMonth = Number(startDate.slice(5, 7));
  const endYear = Number(endDate.slice(0, 4));
  const endMonth = Number(endDate.slice(5, 7));

  return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
}

export function isIndicatorsRangeValid(
  startDate: string,
  endDate: string,
  referenceDate = new Date()
): boolean {
  if (!startDate || !endDate || startDate > endDate) {
    return false;
  }

  if (countMonthsInRange(startDate, endDate) > INDICATORS_MAX_MONTHS) {
    return false;
  }

  const today = getTodayDateOnly(referenceDate);

  if (endDate > today) {
    return false;
  }

  if (startDate < getEarliestIndicatorsDate(referenceDate)) {
    return false;
  }

  return true;
}
