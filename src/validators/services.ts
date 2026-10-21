import * as Yup from "yup";

function optionalPositiveInteger(label: string) {
  return Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue == null ? null : value
    )
    .nullable()
    .optional()
    .integer(`${label} deve ser um número inteiro`)
    .positive(`${label} inválido`);
}

export const createServiceValidator = Yup.object({
  name: Yup.string().trim().required("Nome obrigatório"),
  description: Yup.string().trim().nullable().optional(),
  price: Yup.number()
    .typeError("Preço inválido")
    .required("Preço obrigatório")
    .min(0, "Preço inválido"),
  durationMinutes: optionalPositiveInteger("Duração"),
  suggestedReturnDays: optionalPositiveInteger("Prazo de retorno sugerido"),
  active: Yup.boolean().optional(),
});
