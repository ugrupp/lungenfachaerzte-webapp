import Subpage from "#/components/Subpage";
import { craftPreviewSearchSchema } from "#/lib/craftPreview";
import { routeCacheHeaders } from "#/lib/routeCacheHeaders";
import { seoToHead } from "#/lib/seo";
import { getSchwerpunktePageServerFn } from "#/serverFunctions/getSchwerpunktePageServerFn";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/schwerpunkte")({
  validateSearch: craftPreviewSearchSchema,
  loaderDeps: ({ search }) => ({
    token: search.token,
    preview: search["x-craft-live-preview"],
  }),
  loader: async ({ deps }) => {
    const entry = await getSchwerpunktePageServerFn({
      data: { previewToken: deps.token },
    });
    return { ...entry, _isPreview: !!deps.token };
  },
  headers: ({ loaderData }) => routeCacheHeaders(!!loaderData?._isPreview),
  head: ({ loaderData }) => seoToHead(loaderData?.seo),
  component: SchwerpunktePage,
});

function SchwerpunktePage() {
  const { heroImage } = Route.useLoaderData();

  return <Subpage heroImage={heroImage} />;
}
