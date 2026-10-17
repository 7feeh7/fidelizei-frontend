import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      refetchInterval: false,
      refetchOnMount: false,
      staleTime: Infinity,
      retry: 1,
    },
  },
});
