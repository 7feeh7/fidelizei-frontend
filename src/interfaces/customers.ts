import type { LeadSource } from "validators/customers";

export interface CustomerListItem {
  id: string;
  name: string;
  phone: string;
  dateOfBirth: string | null;
  leadSource: LeadSource;
  referrerId: string | null;
  referrerName: string | null;
  referralsMadeCount: number;
}

export interface ListCustomersParams {
  page?: number;
  search?: string;
}

export interface ListCustomersResponse {
  data: CustomerListItem[];
  page: number;
  totalPages: number;
}

export interface CreateCustomerPayload {
  name: string;
  phone: string;
  leadSource: LeadSource;
  dateOfBirth?: string | null;
  referrerId?: string;
}

export interface CustomerServices {
  list(params: ListCustomersParams): Promise<ListCustomersResponse>;
  create(payload: CreateCustomerPayload): Promise<void>;
  update(id: string, payload: CreateCustomerPayload): Promise<void>;
  deactivate(id: string): Promise<void>;
}
