import { ApiError } from "@/lib/api";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Client errors will not fix themselves, so only retry network and server failures
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500
        )
          return false;
        return failureCount < 2;
      },
    },
    mutations: { retry: false },
  },
});
