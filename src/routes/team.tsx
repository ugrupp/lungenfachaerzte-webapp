import SubHeader from "#/components/SubHeader";
import TeamMembersPrimary from "#/components/TeamMembersPrimary";
import TeamMembersSecondary from "#/components/TeamMembersSecondary";
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
  head: ({ loaderData }) => seoToHead(loaderData?.seo, loaderData?.uri),
  component: TeamPage,
});

function TeamPage() {
  const {
    heroImage,
    title,
    headline,
    teamSections = [],
  } = Route.useLoaderData();

  return (
    <>
      <SubHeader heroImage={heroImage} />

      <div className="bg-ci-light py-30 768:py-38 1024:pb-50">
        <h1 className="sr-only">{headline || title}</h1>

        <div className="space-y-36 1280:space-y-50">
          {teamSections.map(({ category, members }) => (
            <section key={category.id}>
              <div className="container-grid">
                <h2 className="col-[content/content] ml-(--logo-offset) w-fit headline--1 text-ci-light bg-ci-dark rounded-full px-7 py-2.75 overflow-hidden mb-10 768:mb-16">
                  {category.title}
                </h2>
              </div>

              {category.teamCategoryPrimary ? (
                <TeamMembersPrimary members={members} />
              ) : (
                <TeamMembersSecondary members={members} />
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
