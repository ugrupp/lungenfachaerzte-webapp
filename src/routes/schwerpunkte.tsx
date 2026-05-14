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
  head: ({ loaderData }) => seoToHead(loaderData?.seo, loaderData?.uri),
  component: SchwerpunktePage,
});

function SchwerpunktePage() {
  const {
    title,
    heroImage,
    introText,
    image,
    image2,
    image3,
    image4,
    text,
    text2,
    text3,
  } = Route.useLoaderData();

  return (
    <Subpage
      subHeaderProps={{
        heroImage,
      }}
      subpageIntroProps={{
        title: title ?? "",
        introText,
      }}
      subpageContentProps={{
        image,
        text,
        image2,
        image3,
        text2,
        image4,
        text3,
      }}
    />
  );
}
