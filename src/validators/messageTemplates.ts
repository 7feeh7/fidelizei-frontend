import * as Yup from "yup";
import { MESSAGE_TEMPLATE_TYPES } from "interfaces/messageTemplates";

export const messageTemplateValidator = Yup.object({
  name: Yup.string()
    .trim()
    .required("Nome obrigatório")
    .max(100, "Nome inválido"),
  type: Yup.string()
    .oneOf([...MESSAGE_TEMPLATE_TYPES], "Tipo inválido")
    .required("Tipo obrigatório"),
  content: Yup.string().trim().required("Conteúdo obrigatório"),
});

