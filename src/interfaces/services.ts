export interface ServiceListItem {
  id: string;
  name: string;
  price: number;
  suggestedReturnDays: number | null;
  active: boolean;
}

export interface ListServicesResponse {
  data: ServiceListItem[];
}

export interface CreateServicePayload {
  name: string;
  description?: string | null;
  price: number;
  durationMinutes?: number | null;
  suggestedReturnDays?: number | null;
}

export interface ServiceServices {
  list(): Promise<ListServicesResponse>;
  create(payload: CreateServicePayload): Promise<void>;
  deactivate(id: string): Promise<void>;
}
