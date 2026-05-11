import SubHeader from "#/components/SubHeader";
import { craftPreviewSearchSchema } from "#/lib/craftPreview";
import { routeCacheHeaders } from "#/lib/routeCacheHeaders";
import { seoToHead } from "#/lib/seo";
import { getTeamPageServerFn } from "#/serverFunctions/getTeamPageServerFn";
import { createFileRoute } from "@tanstack/react-router";

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
  headers: ({ loaderData }) => routeCacheHeaders(!!loaderData?._isPreview),
  head: ({ loaderData }) => seoToHead(loaderData?.seo),
  component: TeamPage,
});

function TeamPage() {
  const { text } = Route.useLoaderData();

  return (
    <>
      <SubHeader />

      <section>
        {!!text?.__html && (
          <div className="richtext" dangerouslySetInnerHTML={text} />
        )}
      </section>
    </>
  );
}
