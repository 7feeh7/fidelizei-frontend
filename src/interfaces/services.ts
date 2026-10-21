export interface ServiceListItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number | null;
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

export type UpdateServicePayload = CreateServicePayload;

export interface ServiceServices {
  list(): Promise<ListServicesResponse>;
  create(payload: CreateServicePayload): Promise<void>;
  update(id: string, payload: UpdateServicePayload): Promise<void>;
  deactivate(id: string): Promise<void>;
}
