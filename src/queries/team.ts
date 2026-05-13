import { imageFragment, imageSchema } from "#/lib/image";
import { SEO_FRAGMENT, SeoSchema } from "#/lib/seo";
import { TEXT_FRAGMENT, TextSchema } from "#/lib/text";
import { z } from "zod";

const HERO_IMAGE_WIDTHS = [400, 800, 1200, 1600] as const;

const HeroImageSchema = z
  .array(imageSchema(HERO_IMAGE_WIDTHS))
  .transform((arr) => arr.at(0));

const TEAM_QUERY = /* GraphQL */ `
  ${imageFragment(HERO_IMAGE_WIDTHS, "HeroImage")}
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
          heroImage: HeroImageSchema,
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
