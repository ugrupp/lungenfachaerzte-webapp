/* eslint-disable unicorn/filename-case */
import { QueryClient } from "@tanstack/react-query";

export function getContext() {
  // Globals fetched via useSuspenseQuery (Header/Footer) are dehydrated from
  // SSR and rehydrated on the client. Mark them Infinity-stale so they are
  // never re-fetched during the session — content only changes on CDN purge.
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  return {
    queryClient,
  };
}
export default function TanstackQueryProvider() {}
