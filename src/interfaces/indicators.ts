export interface GetIndicatorsParams {
  startDate?: string;
  endDate?: string;
}

export interface IndicatorsResponse {
  startDate: string;
  endDate: string;
  appointmentsCount: number;
  billedAmount: number;
  newCustomersCount: number;
  convertedReferralsCount: number;
}

export interface IndicatorsServices {
  get: (params?: GetIndicatorsParams) => Promise<IndicatorsResponse>;
}
