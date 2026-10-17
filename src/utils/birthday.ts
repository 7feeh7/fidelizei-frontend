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
