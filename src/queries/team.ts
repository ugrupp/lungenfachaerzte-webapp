import { nullToUndefined } from "#/lib/helpers";
import { imageFragment, imageSchema } from "#/lib/image";
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
  id: z.string(),
  title: z.string().apply(nullToUndefined),
  image: TeamMemberImageSchema,
  teamMemberPrimary: z.boolean(),
  description: TextSchema.apply(nullToUndefined),
  vita: z.array(
    z.object({
      id: z.string(),
      title: z.string().apply(nullToUndefined),
      occupation: TextSchema.apply(nullToUndefined),
    }),
  ),
});

const TEAM_QUERY = /* GraphQL */ `
  ${imageFragment(HERO_IMAGE_WIDTHS, "HeroImage")}
  ${imageFragment(TEAM_MEMBER_IMAGE_WIDTHS, "TeamMemberImage")}
  ${SEO_FRAGMENT}
  ${TEXT_FRAGMENT}
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
            id
            title
            image {
              ...TeamMemberImage
            }
            teamMemberPrimary
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
          teamMembers: z.array(TeamMemberSchema),
          seo: SeoSchema.apply(nullToUndefined),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { entry } }) => entry);

type TeamQuery = z.infer<typeof TeamQuerySchema>;
type TeamMember = z.infer<typeof TeamMemberSchema>;

export { TEAM_QUERY, TeamMemberSchema, TeamQuerySchema };
export type { TeamMember, TeamQuery };
