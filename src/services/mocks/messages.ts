import {
  MessageListItem,
  MessageServices,
  MessageStatus,
} from "interfaces/messages";
import { buildWhatsAppLinkFromPhone } from "utils/whatsapp";

const mockMessages: MessageListItem[] = [
  {
    id: "msg-1",
    customerId: "cust-1",
    customerName: "Maria Silva",
    customerPhone: "(85) 99999-1111",
    templateId: "mt-return",
    appointmentItemId: null,
    customerRewardId: null,
    type: "RETURN_REMINDER",
    content:
      "Oi Maria! Já faz 30 dias do seu corte. Que tal agendar um retorno?",
    status: "PENDING",
    scheduledFor: new Date().toISOString().slice(0, 10),
    sentAt: null,
    sentBy: null,
    sentByName: null,
    whatsappUrl: buildWhatsAppLinkFromPhone(
      "(85) 99999-1111",
      "Oi Maria! Já faz 30 dias do seu corte. Que tal agendar um retorno?"
    ),
    createdAt: new Date().toISOString(),
  },
  {
    id: "msg-2",
    customerId: "cust-2",
    customerName: "João Souza",
    customerPhone: "(85) 98888-2222",
    templateId: null,
    appointmentItemId: null,
    customerRewardId: null,
    type: "CUSTOM",
    content: "Oi João, tudo bem?",
    status: "SENT",
    scheduledFor: new Date().toISOString().slice(0, 10),
    sentAt: new Date().toISOString(),
    sentBy: "user-1",
    sentByName: "Admin",
    whatsappUrl: null,
    createdAt: new Date().toISOString(),
  },
];

function countPending() {
  const today = new Date().toISOString().slice(0, 10);
  return mockMessages.filter(
    (item) => item.status === "PENDING" && item.scheduledFor <= today
  ).length;
}

function filterMessages(status?: MessageStatus, customerId?: string) {
  return mockMessages.filter((item) => {
    if (status && item.status !== status) {
      return false;
    }
    if (customerId && item.customerId !== customerId) {
      return false;
    }
    if (status === "PENDING" && item.scheduledFor > new Date().toISOString().slice(0, 10)) {
      return false;
    }
    return true;
  });
}

export const mockMessageServices: MessageServices = {
  list: async (params) => ({
    data: filterMessages(params?.status, params?.customerId),
    pendingCount: countPending(),
  }),
  pendingCount: async () => ({ pendingCount: countPending() }),
  createForCustomer: async (customerId, payload) => {
    const content =
      payload.content?.trim() ||
      "Mensagem gerada a partir do modelo selecionado.";
    const message: MessageListItem = {
      id: crypto.randomUUID(),
      customerId,
      customerName: "Cliente",
      customerPhone: "(85) 99999-0000",
      templateId: payload.templateId ?? null,
      appointmentItemId: null,
      customerRewardId: null,
      type: "CUSTOM",
      content,
      status: "PENDING",
      scheduledFor: payload.scheduledFor ?? new Date().toISOString().slice(0, 10),
      sentAt: null,
      sentBy: null,
      sentByName: null,
      whatsappUrl: buildWhatsAppLinkFromPhone("(85) 99999-0000", content),
      createdAt: new Date().toISOString(),
    };
    mockMessages.unshift(message);
    return { message };
  },
  updateContent: async (id, payload) => {
    const index = mockMessages.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Mensagem não encontrada");
    }
    mockMessages[index] = {
      ...mockMessages[index],
      content: payload.content,
      whatsappUrl: buildWhatsAppLinkFromPhone(
        mockMessages[index].customerPhone,
        payload.content
      ),
    };
    return { message: mockMessages[index] };
  },
  markSent: async (id) => {
    const index = mockMessages.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Mensagem não encontrada");
    }
    mockMessages[index] = {
      ...mockMessages[index],
      status: "SENT",
      sentAt: new Date().toISOString(),
      sentBy: "user-1",
      sentByName: "Admin",
      whatsappUrl: null,
    };
    return { message: mockMessages[index] };
  },
  cancel: async (id) => {
    const index = mockMessages.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Mensagem não encontrada");
    }
    mockMessages[index] = {
      ...mockMessages[index],
      status: "CANCELED",
      whatsappUrl: null,
    };
  },
  getWhatsAppLink: async (id) => {
    const message = mockMessages.find((item) => item.id === id);
    if (!message?.whatsappUrl) {
      throw new Error("Link indisponível");
    }
    return { whatsappUrl: message.whatsappUrl };
  },
};
