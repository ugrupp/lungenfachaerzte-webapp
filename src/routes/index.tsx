import { Image } from "#/components/Image";
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
  const { text, image } = Route.useLoaderData();

  return (
    <main>
      <section>
        {!!text?.html && <div className="richtext">{parse(text.html)}</div>}
        {image && (
          <Image
            src={image.url}
            srcSet={image.srcset}
            sizes="100vw"
            alt={image.alt ?? ""}
          />
        )}
      </section>
    </main>
  );
}
