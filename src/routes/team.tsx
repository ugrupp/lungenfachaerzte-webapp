import SubHeader from "#/components/SubHeader";
import TeamIntro from "#/components/TeamIntro";
import TeamMembersPrimary from "#/components/TeamMembersPrimary";
import TeamMembersSecondary from "#/components/TeamMembersSecondary";
import { craftPreviewSearchSchema } from "#/lib/craftPreview";
import { routeCacheHeaders } from "#/lib/routeCacheHeaders";
import { seoToHead } from "#/lib/seo";
import { getTeamPageServerFn } from "#/serverFunctions/getTeamPageServerFn";
import { createFileRoute } from "@tanstack/react-router";
import { partition } from "es-toolkit";

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
  const { heroImage, title, teamMembers } = Route.useLoaderData();
  const [primaryMembers, secondaryMembers] = partition(
    teamMembers ?? [],
    ({ teamMemberPrimary }) => teamMemberPrimary,
  );

  return (
    <>
      <SubHeader heroImage={heroImage} />

      <div className="bg-ci-light py-30 768:py-38 1024:pb-50">
        <TeamIntro title={title ?? ""} />
        <TeamMembersPrimary
          members={primaryMembers}
          className="mt-14 768:mt-15 1024:mt-18"
        />
        <TeamMembersSecondary
          members={secondaryMembers}
          className="mt-36 1280:mt-50"
        />
      </div>
    </>
  );
}
