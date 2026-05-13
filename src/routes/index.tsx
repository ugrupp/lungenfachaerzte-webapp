import { HomeIntro } from "#/components/HomeIntro";
import { HomeTeasers } from "#/components/HomeTeasers";
import SubHeader from "#/components/SubHeader";
import { craftPreviewSearchSchema } from "#/lib/craftPreview";
import { routeCacheHeaders } from "#/lib/routeCacheHeaders";
import { seoToHead } from "#/lib/seo";
import { getHomePageServerFn } from "#/serverFunctions/getHomePageServerFn";
import { createFileRoute } from "@tanstack/react-router";

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
  headers: ({ loaderData }) => routeCacheHeaders(!!loaderData?._isPreview),
  head: ({ loaderData }) => seoToHead(loaderData?.seo),
  component: HomePage,
});

function HomePage() {
  const { heroImage } = Route.useLoaderData();

  return (
    <>
      <SubHeader variant="tall" heroImage={heroImage} />
      <HomeIntro />
      <HomeTeasers />
    </>
  );
}
