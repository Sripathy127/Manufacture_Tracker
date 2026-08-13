import { QueryClient } from "@tanstack/react-query";
import { defaultQueryFn } from "./react-query-deafult-fn";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});
