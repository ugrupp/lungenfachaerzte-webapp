import { SEO_FRAGMENT, SeoSchema } from "#/lib/seo";
import { z } from "zod";

const TEAM_QUERY = /* GraphQL */ `
  ${SEO_FRAGMENT}
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
          html
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
          text: z
            .object({
              html: z.string(),
            })
            .nullable(),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { entry } }) => entry);

type TeamQueryResult = z.infer<typeof TeamQuerySchema>;

export { TEAM_QUERY, TeamQuerySchema };
export type { TeamQueryResult };
