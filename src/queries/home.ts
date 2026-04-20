import { imageFragment, imageSchema } from "#/lib/image";
import { SEO_FRAGMENT, SeoSchema } from "#/lib/seo";
import { TEXT_FRAGMENT, TextSchema } from "#/lib/text";
import { z } from "zod";

const HERO_IMAGE_WIDTHS = [400, 800, 1200] as const;

const HOME_QUERY = /* GraphQL */ `
  ${imageFragment(HERO_IMAGE_WIDTHS, "HeroImage")}
  ${SEO_FRAGMENT}
  ${TEXT_FRAGMENT}
  query Home {
    entry(section: "home") {
      id
      title
      uri
      ... on home_Entry {
        seo {
          ...SeoFields
        }
        heroImage {
          ...HeroImage
        }
        introHead {
          ...TextFields
        }
        introText {
          ...TextFields
        }
        introInfotext {
          ...TextFields
        }
      }
    }
  }
`;

const HomeQuerySchema = z
  .object({
    data: z.object({
      entry: z
        .object({
          id: z.string(),
          title: z.string(),
          uri: z.string(),
          seo: SeoSchema.nullable(),
          heroImage: z
            .array(imageSchema(HERO_IMAGE_WIDTHS))
            .transform((arr) => arr[0] ?? null)
            .nullable(),
          introHead: TextSchema.nullable(),
          introText: TextSchema.nullable(),
          introInfotext: TextSchema.nullable(),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { entry } }) => entry);

type HomeQuery = z.infer<typeof HomeQuerySchema>;

export { HOME_QUERY, HomeQuerySchema };
export type { HomeQuery };
