import { nullToUndefined } from "#/lib/helpers";
import { imageFragment, imageSchema } from "#/lib/image";
import { SEO_FRAGMENT, SeoSchema } from "#/lib/seo";
import { TEXT_FRAGMENT, TextSchema } from "#/lib/text";
import { z } from "zod";

const HERO_IMAGE_WIDTHS = [400, 800, 1200, 1600] as const;

const HeroImageSchema = z
  .array(imageSchema(HERO_IMAGE_WIDTHS))
  .transform((arr) => arr.at(0));

const SCHWERPUNKTE_QUERY = /* GraphQL */ `
  ${imageFragment(HERO_IMAGE_WIDTHS, "HeroImage")}
  ${SEO_FRAGMENT}
  ${TEXT_FRAGMENT}
  query Schwerpunkte {
    entry(section: "schwerpunkte") {
      id
      title
      uri
      ... on schwerpunkte_Entry {
        heroImage {
          ...HeroImage
        }
        headline
        introText {
          ...TextFields
        }
        text {
          ...TextFields
        }
        text2 {
          ...TextFields
        }
        text3 {
          ...TextFields
        }
        headline2
        introText2 {
          ...TextFields
        }
        text4 {
          ...TextFields
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
          heroImage: HeroImageSchema,
          headline: z.string().apply(nullToUndefined),
          introText: TextSchema.apply(nullToUndefined),
          text: TextSchema.apply(nullToUndefined),
          text2: TextSchema.apply(nullToUndefined),
          text3: TextSchema.apply(nullToUndefined),
          headline2: z.string().apply(nullToUndefined),
          introText2: TextSchema.apply(nullToUndefined),
          text4: TextSchema.apply(nullToUndefined),
          seo: SeoSchema.apply(nullToUndefined),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { entry } }) => entry);

type SchwerpunkteQuery = z.infer<typeof SchwerpunkteQuerySchema>;

export { SCHWERPUNKTE_QUERY, SchwerpunkteQuerySchema };
export type { SchwerpunkteQuery };
