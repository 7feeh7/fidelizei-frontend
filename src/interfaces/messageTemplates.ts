export const MESSAGE_TEMPLATE_TYPES = [
  "RETURN_REMINDER",
  "BIRTHDAY",
  "REWARD_EXPIRING",
  "CUSTOM",
] as const;

export type MessageTemplateType = (typeof MESSAGE_TEMPLATE_TYPES)[number];

export interface MessageTemplateListItem {
  id: string;
  name: string;
  type: MessageTemplateType;
  content: string;
  active: boolean;
}

export interface ListMessageTemplatesResponse {
  data: MessageTemplateListItem[];
}

export interface MessageTemplatePayload {
  name: string;
  type: MessageTemplateType;
  content: string;
}

export interface UpdateMessageTemplatePayload {
  name: string;
  content: string;
}

export interface PreviewMessageTemplatePayload {
  content?: string;
  templateId?: string;
  customerId?: string;
}

export interface PreviewMessageTemplateResponse {
  preview: string;
}

export interface MessageTemplateServices {
  list(): Promise<ListMessageTemplatesResponse>;
  getById(id: string): Promise<MessageTemplateListItem>;
  create(payload: MessageTemplatePayload): Promise<void>;
  update(id: string, payload: UpdateMessageTemplatePayload): Promise<void>;
  setActive(id: string, active: boolean): Promise<void>;
  preview(
    payload: PreviewMessageTemplatePayload
  ): Promise<PreviewMessageTemplateResponse>;
}
