import { MOCK_API } from "config";
import type {
  CreateCustomerMessageResponse,
  GetMessageWhatsAppLinkResponse,
  ListMessagesResponse,
  MarkMessageSentResponse,
  MessagePendingCountResponse,
  MessageServices,
  UpdateMessageContentResponse,
} from "interfaces/messages";
import { api } from "./api";
import { mockMessageServices } from "./mocks/messages";

export const MESSAGES_PAGE_SIZE = 10;

const apiMessageServices: MessageServices = {
  list: (params) =>
    api
      .get<ListMessagesResponse>("messages", {
        params: {
          ...params,
          perPage: params?.perPage ?? MESSAGES_PAGE_SIZE,
        },
      })
      .then((res) => res.data),
  pendingCount: () =>
    api
      .get<MessagePendingCountResponse>("messages/pending-count")
      .then((res) => res.data),
  createForCustomer: (customerId, payload) =>
    api
      .post<CreateCustomerMessageResponse>(
        `customers/${customerId}/messages`,
        payload
      )
      .then((res) => res.data),
  updateContent: (id, payload) =>
    api
      .patch<UpdateMessageContentResponse>(`messages/${id}`, payload)
      .then((res) => res.data),
  markSent: (id, payload) =>
    api
      .patch<MarkMessageSentResponse>(`messages/${id}/sent`, payload)
      .then((res) => res.data),
  cancel: (id) => api.patch(`messages/${id}/cancel`).then(() => undefined),
  getWhatsAppLink: (id) =>
    api
      .get<GetMessageWhatsAppLinkResponse>(`messages/${id}/whatsapp-link`)
      .then((res) => res.data),
};

export const messageServices = MOCK_API
  ? mockMessageServices
  : apiMessageServices;
