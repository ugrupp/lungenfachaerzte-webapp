import { craftPreviewSearchSchema } from "#/lib/craftPreview";
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
  headers: ({ loaderData }): Record<string, string> => {
    if (loaderData?._isPreview) {
      return { "Cache-Control": "private, no-store" };
    }
    return {
      "Netlify-CDN-Cache-Control":
        "public, max-age=3600, stale-while-revalidate=86400",
      "Cache-Control": "public, max-age=0, must-revalidate",
    };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData?.title }],
  }),
  component: HomePage,
});

function HomePage() {
  const { text } = Route.useLoaderData();

  return (
    <main>
      <section>
        {!!text?.html && <div className="richtext">{parse(text.html)}</div>}
      </section>
    </main>
  );
}
