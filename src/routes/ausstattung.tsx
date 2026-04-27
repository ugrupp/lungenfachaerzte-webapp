import Subpage from "#/components/Subpage";
import { craftPreviewSearchSchema } from "#/lib/craftPreview";
import { routeCacheHeaders } from "#/lib/routeCacheHeaders";
import { seoToHead } from "#/lib/seo";
import { getAusstattungPageServerFn } from "#/serverFunctions/getAusstattungPageServerFn";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ausstattung")({
  validateSearch: craftPreviewSearchSchema,
  loaderDeps: ({ search }) => ({
    token: search.token,
    preview: search["x-craft-live-preview"],
  }),
  loader: async ({ deps }) => {
    const entry = await getAusstattungPageServerFn({
      data: { previewToken: deps.token },
    });
    return { ...entry, _isPreview: !!deps.token };
  },
  headers: ({ loaderData }) => routeCacheHeaders(!!loaderData?._isPreview),
  head: ({ loaderData }) => seoToHead(loaderData?.seo),
  component: AusstattungPage,
});

function AusstattungPage() {
  const { mainImage } = Route.useLoaderData();

  return <Subpage heroImage={mainImage} />;
}
