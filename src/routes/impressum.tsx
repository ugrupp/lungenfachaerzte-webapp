import Plainpage from "#/components/Plainpage";
import { craftPreviewSearchSchema } from "#/lib/craftPreview";
import { routeCacheHeaders } from "#/lib/routeCacheHeaders";
import { getImprintPageServerFn } from "#/serverFunctions/getImprintPageServerFn";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/impressum")({
  validateSearch: craftPreviewSearchSchema,
  loaderDeps: ({ search }) => ({
    token: search.token,
    preview: search["x-craft-live-preview"],
  }),
  loader: async ({ deps }) => {
    const entry = await getImprintPageServerFn({
      data: { previewToken: deps.token },
    });
    return { ...entry, _isPreview: !!deps.token };
  },
  headers: ({ loaderData }) => routeCacheHeaders(!!loaderData?._isPreview),
  component: ImpressumPage,
});

function ImpressumPage() {
  const { title, textPrimary, textSecondary } = Route.useLoaderData();

  return (
    <Plainpage
      title={title ?? ""}
      textPrimary={textPrimary}
      textSecondary={textSecondary}
    />
  );
}
