export interface OverdueReturnItem {
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  appointmentDate: string;
  returnDueDate: string;
  overdueDays: number;
  additionalServicesCount: number;
}

export interface ListOverdueReturnsResponse {
  data: OverdueReturnItem[];
  page: number;
  totalPages: number;
}

export interface ListOverdueReturnsParams {
  page?: number;
  perPage?: number;
}

export interface OverdueReturnsServices {
  list: (params?: ListOverdueReturnsParams) => Promise<ListOverdueReturnsResponse>;
}
