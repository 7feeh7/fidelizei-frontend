import {
  ListMessageTemplatesResponse,
  MessageTemplateListItem,
  MessageTemplatePayload,
  MessageTemplateServices,
  PreviewMessageTemplatePayload,
  UpdateMessageTemplatePayload,
} from "interfaces/messageTemplates";

const mockTemplates: MessageTemplateListItem[] = [
  {
    id: "mt-return",
    name: "Lembrete de retorno",
    type: "RETURN_REMINDER",
    content:
      "Oi {nome}! Já faz {dias} dias do seu {servico}. Que tal agendar um retorno no {negocio}? Estamos com saudades!",
    active: true,
  },
  {
    id: "mt-birthday",
    name: "Aniversário",
    type: "BIRTHDAY",
    content:
      "Oi {nome}! Feliz aniversário! O {negocio} preparou um presente especial para você: {beneficio}. Válido até {validade}.",
    active: true,
  },
];

function fillPreview(content: string): string {
  return content
    .replace(/\{nome\}/g, "Maria")
    .replace(/\{servico\}/g, "hidratação")
    .replace(/\{dias\}/g, "30")
    .replace(/\{beneficio\}/g, "hidratação grátis")
    .replace(/\{validade\}/g, "31/12")
    .replace(/\{negocio\}/g, "Fidelizei")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export const mockMessageTemplateServices: MessageTemplateServices = {
  list: async (): Promise<ListMessageTemplatesResponse> => ({
    data: mockTemplates,
  }),
  getById: async (id: string): Promise<MessageTemplateListItem> => {
    const template = mockTemplates.find((item) => item.id === id);
    if (!template) {
      throw new Error("Modelo de mensagem não encontrado");
    }
    return template;
  },
  create: async (payload: MessageTemplatePayload): Promise<void> => {
    mockTemplates.unshift({
      id: crypto.randomUUID(),
      ...payload,
      active: true,
    });
  },
  update: async (
    id: string,
    payload: UpdateMessageTemplatePayload
  ): Promise<void> => {
    const index = mockTemplates.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("Modelo de mensagem não encontrado");
    }
    mockTemplates[index] = {
      ...mockTemplates[index],
      ...payload,
    };
  },
  setActive: async (id: string, active: boolean): Promise<void> => {
    const template = mockTemplates.find((item) => item.id === id);
    if (!template) {
      throw new Error("Modelo de mensagem não encontrado");
    }
    template.active = active;
  },
  preview: async (payload: PreviewMessageTemplatePayload) => {
    let content = payload.content?.trim();
    if (!content && payload.templateId) {
      content = (await mockMessageTemplateServices.getById(payload.templateId))
        .content;
    }
    if (!content) {
      throw new Error("Conteúdo obrigatório");
    }
    return { preview: fillPreview(content) };
  },
};
