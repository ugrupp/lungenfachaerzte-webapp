import { nullToUndefined } from "#/lib/helpers";
import { imageFragment, imageSchema } from "#/lib/image";
import { SEO_FRAGMENT, SeoSchema } from "#/lib/seo";
import { TEXT_FRAGMENT, TextSchema } from "#/lib/text";
import { z } from "zod";

const HERO_IMAGE_WIDTHS = [400, 800, 1200] as const;
const TEASER_IMAGE_WIDTHS = [400, 800] as const;

const HOME_QUERY = /* GraphQL */ `
  ${imageFragment(HERO_IMAGE_WIDTHS, "HeroImage")}
  ${imageFragment(TEASER_IMAGE_WIDTHS, "TeaserImage")}
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
    teaserSchwerpunkte: entry(section: "schwerpunkte") {
      ... on subpage_Entry {
        url
        title
        mainImage {
          ...TeaserImage
        }
        introText {
          html
        }
      }
    }
    teaserAusstattung: entry(section: "ausstattung") {
      ... on subpage_Entry {
        url
        title
        mainImage {
          ...TeaserImage
        }
        introText {
          html
        }
      }
    }
  }
`;

const HeroImageSchema = z
  .array(imageSchema(HERO_IMAGE_WIDTHS))
  .transform((arr) => arr.at(0));

const TeaserImageSchema = z
  .array(imageSchema(TEASER_IMAGE_WIDTHS))
  .transform((arr) => arr.at(0));

const TeaserSchema = z.object({
  url: z.string(),
  title: z.string(),
  mainImage: TeaserImageSchema,
  introText: TextSchema.apply(nullToUndefined),
});
type Teaser = z.infer<typeof TeaserSchema>;

const HomeQuerySchema = z
  .object({
    data: z.object({
      entry: z
        .object({
          id: z.string(),
          title: z.string(),
          uri: z.string(),
          seo: SeoSchema.apply(nullToUndefined),
          heroImage: HeroImageSchema,
          introHead: TextSchema.apply(nullToUndefined),
          introText: TextSchema.apply(nullToUndefined),
          introInfotext: TextSchema.apply(nullToUndefined),
        })
        .nullable(),
      teaserSchwerpunkte: TeaserSchema,
      teaserAusstattung: TeaserSchema,
    }),
  })
  .transform(({ data: { teaserAusstattung, teaserSchwerpunkte, entry } }) => ({
    teaserAusstattung,
    teaserSchwerpunkte,
    ...entry,
  }));

type HomeQuery = z.infer<typeof HomeQuerySchema>;

export { HOME_QUERY, HomeQuerySchema };
export type { HomeQuery, Teaser as HomeTeaser };
