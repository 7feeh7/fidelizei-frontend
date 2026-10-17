import {
  MESSAGE_TEMPLATE_TYPES,
  MessageTemplateType,
} from "interfaces/messageTemplates";

export const MESSAGE_TEMPLATE_VARIABLES = [
  { key: "nome", label: "Nome" },
  { key: "servico", label: "Serviço" },
  { key: "dias", label: "Dias" },
  { key: "beneficio", label: "Benefício" },
  { key: "validade", label: "Validade" },
  { key: "negocio", label: "Negócio" },
] as const;

const TYPE_LABELS: Record<MessageTemplateType, string> = {
  RETURN_REMINDER: "Lembrete de retorno",
  BIRTHDAY: "Aniversário",
  REWARD_EXPIRING: "Benefício expirando",
  CUSTOM: "Personalizado",
};

export const MESSAGE_TEMPLATE_TYPE_OPTIONS = MESSAGE_TEMPLATE_TYPES.map(
  (type) => ({
    value: type,
    label: TYPE_LABELS[type],
  })
);

export function formatMessageTemplateType(type: MessageTemplateType): string {
  return TYPE_LABELS[type];
}

export function formatMessageTemplateStatus(active: boolean): string {
  return active ? "Ativo" : "Inativo";
}
