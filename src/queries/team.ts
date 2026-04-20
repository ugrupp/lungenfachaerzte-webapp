import { SEO_FRAGMENT, SeoSchema } from "#/lib/seo";
import { TEXT_FRAGMENT, TextSchema } from "#/lib/text";
import { z } from "zod";

const TEAM_QUERY = /* GraphQL */ `
  ${SEO_FRAGMENT}
  ${TEXT_FRAGMENT}
  query Team {
    entry(section: "team") {
      id
      title
      uri
      ... on team_Entry {
        seo {
          ...SeoFields
        }
        text {
          ...TextFields
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
          seo: SeoSchema.nullable(),
          text: TextSchema.nullable(),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { entry } }) => entry);

type TeamQuery = z.infer<typeof TeamQuerySchema>;

export { TEAM_QUERY, TeamQuerySchema };
export type { TeamQuery };
