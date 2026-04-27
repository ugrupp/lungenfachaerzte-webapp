import { imageFragment, imageSchema } from "#/lib/image";
import { SEO_FRAGMENT, SeoSchema } from "#/lib/seo";
import { z } from "zod";

const HERO_IMAGE_WIDTHS = [400, 800, 1200, 1600] as const;

const AUSSTATTUNG_QUERY = /* GraphQL */ `
  ${imageFragment(HERO_IMAGE_WIDTHS, "HeroImage")}
  ${SEO_FRAGMENT}
  query Ausstattung {
    entry(section: "ausstattung") {
      id
      title
      uri
      ... on subpage_Entry {
        mainImage {
          ...HeroImage
        }
        seo {
          ...SeoFields
        }
      }
    }
  }
`;

const AusstattungQuerySchema = z
  .object({
    data: z.object({
      entry: z
        .object({
          id: z.string(),
          title: z.string(),
          uri: z.string(),
          mainImage: z
            .array(imageSchema(HERO_IMAGE_WIDTHS))
            .transform((arr) => arr[0] ?? null)
            .nullable(),
          seo: SeoSchema.nullable(),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { entry } }) => entry);

type AusstattungQuery = z.infer<typeof AusstattungQuerySchema>;

export { AUSSTATTUNG_QUERY, AusstattungQuerySchema };
export type { AusstattungQuery };
