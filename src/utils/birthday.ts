export function formatDateOfBirthDisplay(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const dateOnly = value.slice(0, 10);
  const date = new Date(`${dateOnly}T12:00:00`);

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function computeAge(
  dateOfBirth: string,
  referenceDate = new Date().toISOString().slice(0, 10)
) {
  const [year, month, day] = referenceDate.slice(0, 10).split("-").map(Number);
  const birthYear = Number(dateOfBirth.slice(0, 4));
  const birthMonth = Number(dateOfBirth.slice(5, 7));
  const birthDay = Number(dateOfBirth.slice(8, 10));

  let age = year - birthYear;
  const isLeapYear = (value: number) =>
    (value % 4 === 0 && value % 100 !== 0) || value % 400 === 0;
  const effectiveBirthDay =
    birthMonth === 2 && birthDay === 29 && !isLeapYear(year) ? 28 : birthDay;

  if (
    month < birthMonth ||
    (month === birthMonth && day < effectiveBirthDay)
  ) {
    age -= 1;
  }

  return age;
}

/**
 * Dias entre hoje e o aniversário no ano informado.
 * Positivo: ainda vai acontecer | 0: hoje | negativo: já passou.
 * Quem nasceu em 29/02 faz aniversário em 28/02 nos anos não bissextos.
 */
export function daysUntilBirthday(
  dateOfBirth: string,
  year: number,
  today = new Date()
) {
  const birthMonth = Number(dateOfBirth.slice(5, 7));
  const birthDay = Number(dateOfBirth.slice(8, 10));
  const isLeapYear =
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const day = birthMonth === 2 && birthDay === 29 && !isLeapYear ? 28 : birthDay;

  const birthday = Date.UTC(year, birthMonth - 1, day);
  const todayUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return Math.round((birthday - todayUtc) / 86_400_000);
}

/** "Hoje" | "Amanhã" | "Faltam 15 dias" | "Foi ontem" | "Foi há 3 dias" */
export function formatDaysUntilBirthday(days: number) {
  if (days === 0) {
    return "Hoje";
  }

  if (days === 1) {
    return "Amanhã";
  }

  if (days > 1) {
    return `Faltam ${days} dias`;
  }

  if (days === -1) {
    return "Foi ontem";
  }

  return `Foi há ${Math.abs(days)} dias`;
}
