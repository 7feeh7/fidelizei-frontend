import type { CreateCustomerResponse } from "interfaces/customerRewards";
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
  isExistingCustomer?: boolean;
}

export interface CustomerReturnSummaryResponse {
  nextSuggestedReturnDate: string | null;
}

export interface CustomerServices {
  list(params: ListCustomersParams): Promise<ListCustomersResponse>;
  create(payload: CreateCustomerPayload): Promise<CreateCustomerResponse>;
  update(id: string, payload: CreateCustomerPayload): Promise<void>;
  deactivate(id: string): Promise<void>;
  getReturnSummary(customerId: string): Promise<CustomerReturnSummaryResponse>;
}
