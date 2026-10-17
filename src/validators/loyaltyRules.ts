import * as Yup from "yup";
import {
  LOYALTY_REWARD_TYPES,
  LOYALTY_TRIGGER_TYPES,
} from "interfaces/loyaltyRules";

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

export const loyaltyRuleValidator = Yup.object({
  name: Yup.string().trim().required("Nome obrigatório").max(100, "Nome inválido"),
  description: Yup.string().trim().nullable().optional(),
  triggerType: Yup.string()
    .oneOf([...LOYALTY_TRIGGER_TYPES], "Gatilho inválido")
    .required("Gatilho obrigatório"),
  visitCount: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue == null ? null : value
    )
    .nullable()
    .when("triggerType", {
      is: "VISIT_COUNT",
      then: (schema) =>
        schema
          .required("Informe em qual visita o benefício será concedido")
          .integer("Visita inválida")
          .min(2, "A visita mínima é a 2ª"),
      otherwise: (schema) => schema.nullable().optional(),
    }),
  rewardType: Yup.string()
    .oneOf([...LOYALTY_REWARD_TYPES], "Recompensa inválida")
    .required("Recompensa obrigatória"),
  rewardValue: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue == null ? null : value
    )
    .nullable()
    .when("rewardType", ([rewardType], schema) => {
      if (rewardType === "PERCENT_DISCOUNT") {
        return schema
          .required("Percentual obrigatório")
          .min(0, "Percentual inválido")
          .max(100, "Percentual inválido");
      }

      if (rewardType === "FIXED_DISCOUNT") {
        return schema.required("Valor obrigatório").moreThan(0, "Valor inválido");
      }

      return schema.nullable().optional();
    }),
  freeServiceId: Yup.string()
    .nullable()
    .when("rewardType", {
      is: "FREE_SERVICE",
      then: (schema) => schema.required("Selecione o serviço grátis"),
      otherwise: (schema) => schema.nullable().optional(),
    }),
  validDays: optionalPositiveInteger("Validade"),
});
