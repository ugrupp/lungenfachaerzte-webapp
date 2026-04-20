import SubHeader from "#/components/SubHeader";
import { craftPreviewSearchSchema } from "#/lib/craftPreview";
import { routeCacheHeaders } from "#/lib/routeCacheHeaders";
import { seoToHead } from "#/lib/seo";
import { getHomePageServerFn } from "#/serverFunctions/getHomePageServerFn";
import { createFileRoute } from "@tanstack/react-router";
import parse from "html-react-parser";

export const Route = createFileRoute("/")({
  validateSearch: craftPreviewSearchSchema,
  loaderDeps: ({ search }) => ({
    token: search.token,
    preview: search["x-craft-live-preview"],
  }),
  loader: async ({ deps }) => {
    const entry = await getHomePageServerFn({
      data: { previewToken: deps.token },
    });
    return { ...entry, _isPreview: !!deps.token };
  },
  headers: ({ loaderData }): Record<string, string> =>
    routeCacheHeaders(!!loaderData?._isPreview),
  head: ({ loaderData }) => seoToHead(loaderData?.seo),
  component: HomePage,
});

function HomePage() {
  const { introHead } = Route.useLoaderData();

  return (
    <>
      <SubHeader />

      {!!introHead?.html && (
        <div className="richtext">{parse(introHead.html)}</div>
      )}

      {/* {heroImage && (
        <Image
          src={heroImage.url}
          srcSet={heroImage.srcset}
          sizes="100vw"
          alt={heroImage.alt ?? ""}
        />
      )} */}
    </>
  );
}
