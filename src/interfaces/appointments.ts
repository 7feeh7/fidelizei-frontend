import type { CreateAppointmentResponse } from "interfaces/customerRewards";
import type { LoyaltyRewardType } from "interfaces/loyaltyRules";

export interface AppointmentListItem {
  id: string;
  customerId: string;
  customerName: string;
  userId: string | null;
  userName: string | null;
  appointmentDate: string;
  subtotal: number;
  discountAmount: number;
  total: number;
}

export interface ListAppointmentsParams {
  page?: number;
  customerId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ListAppointmentsResponse {
  data: AppointmentListItem[];
  page: number;
  totalPages: number;
}

export interface AppointmentItemPayload {
  serviceId: string;
  price: number;
}

export interface AppointmentUsedReward {
  id: string;
  ruleName: string;
  rewardType: LoyaltyRewardType;
  rewardValue: number | null;
  freeServiceId: string | null;
  rewardSummary: string;
  preview: string;
}

export interface SaveAppointmentPayload {
  customerId: string;
  appointmentDate: string;
  loggedUserId: string;
  userId?: string | null;
  discountAmount?: number;
  customerRewardId?: string | null;
  notes?: string | null;
  items: AppointmentItemPayload[];
}

export interface AppointmentItemDetail {
  id: string;
  serviceId: string;
  serviceName: string;
  price: number;
  returnDueDate: string | null;
}

export interface AppointmentDetail {
  id: string;
  customerId: string;
  customerName: string;
  userId: string | null;
  userName: string | null;
  appointmentDate: string;
  subtotal: number;
  discountAmount: number;
  total: number;
  notes: string | null;
  usedReward: AppointmentUsedReward | null;
  items: AppointmentItemDetail[];
}

export interface AppointmentServices {
  list(params?: ListAppointmentsParams): Promise<ListAppointmentsResponse>;
  getById(id: string): Promise<AppointmentDetail>;
  create(payload: SaveAppointmentPayload): Promise<CreateAppointmentResponse>;
  update(id: string, payload: SaveAppointmentPayload): Promise<void>;
}
