import { nullToUndefined } from "#/lib/helpers";
import { imageFragment, imageSchema } from "#/lib/image";
import { SEO_FRAGMENT, SeoSchema } from "#/lib/seo";
import { TEXT_FRAGMENT, TextSchema } from "#/lib/text";
import { z } from "zod";

const HERO_IMAGE_WIDTHS = [400, 800, 1200, 1600] as const;
const CONTENT_IMAGE_WIDTHS = [400, 800, 1200] as const;

const HeroImageSchema = z
  .array(imageSchema(HERO_IMAGE_WIDTHS))
  .transform((arr) => arr.at(0));

const ContentImageSchema = z
  .array(imageSchema(CONTENT_IMAGE_WIDTHS))
  .transform((arr) => arr.at(0));

const SCHWERPUNKTE_QUERY = /* GraphQL */ `
  ${imageFragment(HERO_IMAGE_WIDTHS, "HeroImage")}
  ${imageFragment(CONTENT_IMAGE_WIDTHS, "ContentImage")}
  ${SEO_FRAGMENT}
  ${TEXT_FRAGMENT}
  query Schwerpunkte {
    entry(section: "schwerpunkte") {
      id
      title
      uri
      ... on subpage_Entry {
        heroImage {
          ...HeroImage
        }
        headline
        introText {
          ...TextFields
        }
        image {
          ...ContentImage
        }
        image2 {
          ...ContentImage
        }
        image3 {
          ...ContentImage
        }
        image4 {
          ...ContentImage
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
          image: ContentImageSchema,
          image2: ContentImageSchema,
          image3: ContentImageSchema,
          image4: ContentImageSchema,
          text: TextSchema.apply(nullToUndefined),
          text2: TextSchema.apply(nullToUndefined),
          text3: TextSchema.apply(nullToUndefined),
          seo: SeoSchema.apply(nullToUndefined),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { entry } }) => entry);

type SchwerpunkteQuery = z.infer<typeof SchwerpunkteQuerySchema>;

export { SCHWERPUNKTE_QUERY, SchwerpunkteQuerySchema };
export type { SchwerpunkteQuery };
