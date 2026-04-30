import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { getContext } from "./integrations/tanstack-query/root-provider";

export function getRouter() {
  const context = getContext();

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: "intent",
    // Content only changes when Craft publishes and the Netlify CDN cache is
    // purged. Within a single browser session, loader data never goes stale —
    // re-fetching on every client-side navigation would needlessly invoke the
    // Netlify function. Preview mode is unaffected: loaderDeps changes (token)
    // and router.invalidate() both bypass staleTime.
    defaultStaleTime: Infinity,
    // Keep preloaded data for the full session too, so hover-preloads are
    // reused on navigation rather than triggering a second fetch.
    defaultPreloadStaleTime: Infinity,
    defaultViewTransition: true,
  });

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient });

  return router;
}

declare module "@tanstack/react-router" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
