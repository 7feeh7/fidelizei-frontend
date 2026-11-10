/** Remove tudo que não é dígito. É assim que o telefone vai e vem da API. */
export function onlyDigits(value: string | null | undefined): string {
  return (value ?? "").replace(/\D/g, "");
}

/** DDD + número local: (85) 98702-0916 | (85) 3270-0916 */
function formatLocal(digits: string): string {
  const ddd = digits.slice(0, 2);
  const number = digits.slice(2);
  const splitAt = number.length === 9 ? 5 : 4;

  return `(${ddd}) ${number.slice(0, splitAt)}-${number.slice(splitAt)}`;
}

/**
 * Formata o telefone para exibição.
 * 85987020916 -> (85) 98702-0916
 * 8532700916 -> (85) 3270-0916
 * 5585987020916 -> +55 (85) 98702-0916
 * Valores fora desses tamanhos voltam como vieram.
 */
export function formatPhone(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  const digits = onlyDigits(value);

  if (digits.length === 10 || digits.length === 11) {
    return formatLocal(digits);
  }

  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    return `+55 ${formatLocal(digits.slice(2))}`;
  }

  return value;
}

/**
 * Máscara progressiva para campo de digitação (até 11 dígitos).
 * "859" -> "(85) 9" | "85987020916" -> "(85) 98702-0916"
 */
export function maskPhone(value: string | null | undefined): string {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length === 0) {
    return "";
  }

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  const ddd = digits.slice(0, 2);
  const number = digits.slice(2);

  if (number.length <= 4) {
    return `(${ddd}) ${number}`;
  }

  // com 11 dígitos o hífen vai depois do 5º número (celular), senão depois do 4º
  const splitAt = digits.length === 11 ? 5 : 4;

  return `(${ddd}) ${number.slice(0, splitAt)}-${number.slice(splitAt)}`;
}
