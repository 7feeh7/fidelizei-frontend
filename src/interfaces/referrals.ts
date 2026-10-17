export const REFERRAL_STATUSES = [
  "PENDING",
  "CONVERTED",
  "CANCELED",
] as const;

export type ReferralStatus = (typeof REFERRAL_STATUSES)[number];

export interface ReferralListItem {
  id: string;
  referrerId: string;
  referrerName: string;
  referredId: string;
  referredName: string;
  status: ReferralStatus;
  createdAt: string;
  convertedAt: string | null;
}

export interface ListReferralsParams {
  page?: number;
  status?: ReferralStatus;
  referrerId?: string;
}

export interface ListReferralsResponse {
  data: ReferralListItem[];
  page: number;
  totalPages: number;
}

export interface CreateReferralPayload {
  referrerId: string;
  referredId: string;
}

export interface ReferralServices {
  list(params?: ListReferralsParams): Promise<ListReferralsResponse>;
  create(payload: CreateReferralPayload): Promise<void>;
  cancel(id: string): Promise<void>;
}
