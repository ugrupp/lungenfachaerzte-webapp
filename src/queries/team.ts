import { nullToUndefined } from "#/lib/helpers";
import { imageFragment, imageSchema } from "#/lib/image";
import { LINK_FRAGMENT, LinkSchema } from "#/lib/link";
import { SEO_FRAGMENT, SeoSchema } from "#/lib/seo";
import { TEXT_FRAGMENT, TextSchema } from "#/lib/text";
import { z } from "zod";

const HERO_IMAGE_WIDTHS = [400, 800, 1200, 1600] as const;
const TEAM_MEMBER_IMAGE_WIDTHS = [400, 800] as const;

const HeroImageSchema = z
  .array(imageSchema(HERO_IMAGE_WIDTHS))
  .transform((arr) => arr.at(0));

const TeamMemberImageSchema = z
  .array(imageSchema(TEAM_MEMBER_IMAGE_WIDTHS))
  .transform((arr) => arr.at(0));

const TeamMemberSchema = z.object({
  typeHandle: z.literal("teamMember"),
  id: z.string(),
  title: z.string().apply(nullToUndefined),
  image: TeamMemberImageSchema,
  description: TextSchema.apply(nullToUndefined),
  vita: z.array(
    z.object({
      id: z.string(),
      title: z.string().apply(nullToUndefined),
      occupation: TextSchema.apply(nullToUndefined),
    }),
  ),
  appointmentLink: LinkSchema.apply(nullToUndefined),
});

const TeamCategorySchema = z.object({
  typeHandle: z.literal("teamCategory"),
  id: z.string(),
  title: z.string(),
  teamCategoryPrimary: z.boolean(),
});

const TeamMembersSchema = z.array(
  z.discriminatedUnion("typeHandle", [TeamMemberSchema, TeamCategorySchema]),
);

// eslint-disable-next-line unused-imports/no-unused-vars
const TeamSectionSchema = z.object({
  category: TeamCategorySchema,
  members: z.array(TeamMemberSchema),
});

const TEAM_QUERY = /* GraphQL */ `
  ${imageFragment(HERO_IMAGE_WIDTHS, "HeroImage")}
  ${imageFragment(TEAM_MEMBER_IMAGE_WIDTHS, "TeamMemberImage")}
  ${SEO_FRAGMENT}
  ${TEXT_FRAGMENT}
  ${LINK_FRAGMENT}
  query Team {
    entry(section: "team") {
      id
      title
      uri
      ... on team_Entry {
        heroImage {
          ...HeroImage
        }
        headline
        teamMembers {
          ... on teamMember_Entry {
            typeHandle
            id
            title
            image {
              ...TeamMemberImage
            }
            description {
              ...TextFields
            }
            vita {
              ... on vitaItem_Entry {
                id
                title
                occupation {
                  ...TextFields
                }
              }
            }
            appointmentLink {
              ...LinkFields
            }
          }
          ... on teamCategory_Entry {
            typeHandle
            id
            title
            teamCategoryPrimary
          }
        }
        seo {
          ...SeoFields
        }
      }
    }
  }
`;

const TeamQuerySchema = z
  .object({
    data: z.object({
      entry: z
        .object({
          id: z.string(),
          title: z.string(),
          uri: z.string(),
          heroImage: HeroImageSchema,
          headline: z.string().apply(nullToUndefined),
          teamMembers: TeamMembersSchema,
          seo: SeoSchema.apply(nullToUndefined),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { entry } }) => ({
    ...entry,
    // Transform the flat list of team members and categories into sections
    teamSections: entry?.teamMembers.reduce<
      z.infer<typeof TeamSectionSchema>[]
    >((sections, item) => {
      if (item.typeHandle === "teamCategory") {
        sections.push({ category: item, members: [] });
      } else {
        sections.at(-1)?.members.push(item);
      }

      return sections;
    }, []),
  }));

type TeamQuery = z.infer<typeof TeamQuerySchema>;
type TeamMember = z.infer<typeof TeamMemberSchema>;
type TeamCategory = z.infer<typeof TeamCategorySchema>;
type TeamMembers = z.infer<typeof TeamMembersSchema>;

export {
  TEAM_QUERY,
  TeamCategorySchema,
  TeamMemberSchema,
  TeamMembersSchema,
  TeamQuerySchema,
};
export type { TeamCategory, TeamMember, TeamMembers, TeamQuery };
