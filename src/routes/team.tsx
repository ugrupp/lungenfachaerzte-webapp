import { craftPreviewSearchSchema } from "#/lib/craftPreview";
import { seoToHead } from "#/lib/seo";
import { getTeamPageServerFn } from "#/serverFunctions/getTeamPageServerFn";
import { createFileRoute } from "@tanstack/react-router";
import parse from "html-react-parser";

export const Route = createFileRoute("/team")({
  validateSearch: craftPreviewSearchSchema,
  loaderDeps: ({ search }) => ({
    token: search.token,
    preview: search["x-craft-live-preview"],
  }),
  loader: async ({ deps }) => {
    const entry = await getTeamPageServerFn({
      data: { previewToken: deps.token },
    });
    return { ...entry, _isPreview: !!deps.token };
  },
  headers: ({ loaderData }): Record<string, string> =>
    loaderData?._isPreview
      ? { "Cache-Control": "private, no-store" }
      : {
          "Netlify-CDN-Cache-Control":
            "public, max-age=3600, stale-while-revalidate=86400",
          "Cache-Control": "public, max-age=0, must-revalidate",
        },
  head: ({ loaderData }) => seoToHead(loaderData?.seo),
  component: TeamPage,
});

function TeamPage() {
  const { text } = Route.useLoaderData();

  return (
    <main>
      <section>
        {!!text?.html && <div className="richtext">{parse(text.html)}</div>}
      </section>
    </main>
  );
}
