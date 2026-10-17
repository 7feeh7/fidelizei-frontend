import type { MessageTemplateType } from "interfaces/messageTemplates";

export const MESSAGE_STATUSES = ["PENDING", "SENT", "CANCELED"] as const;

export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export interface MessageListItem {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  templateId: string | null;
  appointmentItemId: string | null;
  customerRewardId: string | null;
  type: MessageTemplateType;
  content: string;
  status: MessageStatus;
  scheduledFor: string;
  sentAt: string | null;
  sentBy: string | null;
  sentByName: string | null;
  returnReminderServiceName: string | null;
  returnReminderAppointmentDate: string | null;
  customerDateOfBirth: string | null;
  whatsappUrl: string | null;
  createdAt: string;
}

export interface ListMessagesParams {
  status?: MessageStatus;
  type?: MessageTemplateType;
  customerId?: string;
  scheduledUntil?: string;
  scheduledFrom?: string;
}

export interface ListMessagesResponse {
  data: MessageListItem[];
  pendingCount: number;
}

export interface CreateCustomerMessagePayload {
  templateId?: string;
  content?: string;
  scheduledFor?: string;
}

export interface CreateCustomerMessageResponse {
  message: MessageListItem;
}

export interface UpdateMessageContentPayload {
  content: string;
}

export interface UpdateMessageContentResponse {
  message: MessageListItem;
}

export interface MarkMessageSentPayload {
  loggedUserId: string;
}

export interface MarkMessageSentResponse {
  message: MessageListItem;
}

export interface GetMessageWhatsAppLinkResponse {
  whatsappUrl: string;
}

export interface MessagePendingCountResponse {
  pendingCount: number;
}

export interface MessageServices {
  list(params?: ListMessagesParams): Promise<ListMessagesResponse>;
  pendingCount(): Promise<MessagePendingCountResponse>;
  createForCustomer(
    customerId: string,
    payload: CreateCustomerMessagePayload
  ): Promise<CreateCustomerMessageResponse>;
  updateContent(
    id: string,
    payload: UpdateMessageContentPayload
  ): Promise<UpdateMessageContentResponse>;
  markSent(
    id: string,
    payload: MarkMessageSentPayload
  ): Promise<MarkMessageSentResponse>;
  cancel(id: string): Promise<void>;
  getWhatsAppLink(id: string): Promise<GetMessageWhatsAppLinkResponse>;
}
