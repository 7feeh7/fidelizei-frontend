import { MOCK_API } from "config";
import {
  ListMessageTemplatesResponse,
  MessageTemplateListItem,
  MessageTemplatePayload,
  MessageTemplateServices,
  PreviewMessageTemplatePayload,
  PreviewMessageTemplateResponse,
  UpdateMessageTemplatePayload,
} from "interfaces/messageTemplates";
import { api } from "./api";
import { mockMessageTemplateServices } from "./mocks/messageTemplates";

const apiMessageTemplateServices: MessageTemplateServices = {
  list: () =>
    api
      .get<ListMessageTemplatesResponse>("message-templates")
      .then((res) => res.data),
  getById: (id: string) =>
    api
      .get<MessageTemplateListItem>(`message-templates/${id}`)
      .then((res) => res.data),
  create: (payload: MessageTemplatePayload) =>
    api.post("message-templates", payload).then(() => undefined),
  update: (id: string, payload: UpdateMessageTemplatePayload) =>
    api.patch(`message-templates/${id}`, payload).then(() => undefined),
  setActive: (id: string, active: boolean) =>
    api
      .patch(`message-templates/${id}/active`, { active })
      .then(() => undefined),
  preview: (payload: PreviewMessageTemplatePayload) =>
    api
      .post<PreviewMessageTemplateResponse>("message-templates/preview", payload)
      .then((res) => res.data),
};

export const messageTemplateServices = MOCK_API
  ? mockMessageTemplateServices
  : apiMessageTemplateServices;
