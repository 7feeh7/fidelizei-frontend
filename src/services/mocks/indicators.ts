import type {
  GetIndicatorsParams,
  IndicatorsResponse,
  IndicatorsServices,
} from "interfaces/indicators";
import { getCurrentMonthDateRange } from "utils/indicatorsDateRange";
import { delay } from "./delay";

export const mockIndicatorsServices: IndicatorsServices = {
  get: async (params?: GetIndicatorsParams): Promise<IndicatorsResponse> => {
    await delay(400);

    const defaults = getCurrentMonthDateRange();
    const startDate = params?.startDate ?? defaults.startDate;
    const endDate = params?.endDate ?? defaults.endDate;

    return {
      startDate,
      endDate,
      appointmentsCount: 181,
      billedAmount: 15566,
      newCustomersCount: 24,
      convertedReferralsCount: 6,
    };
  },
};
