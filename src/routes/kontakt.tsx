import Contact from "#/components/Contact";
import { craftPreviewSearchSchema } from "#/lib/craftPreview";
import { routeCacheHeaders } from "#/lib/routeCacheHeaders";
import { seoToHead } from "#/lib/seo";
import { getContactPageServerFn } from "#/serverFunctions/getContactPageServerFn";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/kontakt")({
  validateSearch: craftPreviewSearchSchema,
  loaderDeps: ({ search }) => ({
    token: search.token,
    preview: search["x-craft-live-preview"],
  }),
  loader: async ({ deps }) => {
    const entry = await getContactPageServerFn({
      data: { previewToken: deps.token },
    });
    return { ...entry, _isPreview: !!deps.token };
  },
  headers: ({ loaderData }) => routeCacheHeaders(!!loaderData?._isPreview),
  head: ({ loaderData }) => seoToHead(loaderData?.seo),
  component: ContactPage,
});

function ContactPage() {
  const { title } = Route.useLoaderData();

  return (
    <>
      <h1 className="sr-only">{title}</h1>
      <Contact standalone />
    </>
  );
}
