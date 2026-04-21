import { imageFragment, imageSchema } from "#/lib/image";
import { SEO_FRAGMENT, SeoSchema } from "#/lib/seo";
import { z } from "zod";

const HERO_IMAGE_WIDTHS = [400, 800, 1200, 1600] as const;

const SCHWERPUNKTE_QUERY = /* GraphQL */ `
  ${imageFragment(HERO_IMAGE_WIDTHS, "HeroImage")}
  ${SEO_FRAGMENT}
  query Schwerpunkte {
    entry(section: "schwerpunkte") {
      id
      title
      uri
      ... on subpage_Entry {
        heroImage {
          ...HeroImage
        }
        seo {
          ...SeoFields
        }
      }
    }
  }
`;

const SchwerpunkteQuerySchema = z
  .object({
    data: z.object({
      entry: z
        .object({
          id: z.string(),
          title: z.string(),
          uri: z.string(),
          heroImage: z
            .array(imageSchema(HERO_IMAGE_WIDTHS))
            .transform((arr) => arr[0] ?? null)
            .nullable(),
          seo: SeoSchema.nullable(),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { entry } }) => entry);

type SchwerpunkteQuery = z.infer<typeof SchwerpunkteQuerySchema>;

export { SCHWERPUNKTE_QUERY, SchwerpunkteQuerySchema };
export type { SchwerpunkteQuery };
