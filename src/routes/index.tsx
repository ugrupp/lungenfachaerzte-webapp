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
  component: HomePage,
});

function HomePage() {
  const { title, text } = Route.useLoaderData();

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
          {title}
        </h1>
        {text?.html && (
          <div className="prose max-w-2xl text-[var(--sea-ink-soft)]">
            {parse(text.html)}
          </div>
        )}
      </section>
    </main>
  );
}
