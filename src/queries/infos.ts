import { nullToUndefined } from "#/lib/helpers";
import { imageFragment, imageSchema } from "#/lib/image";
import { SEO_FRAGMENT, SeoSchema } from "#/lib/seo";
import { TEXT_FRAGMENT, TextSchema } from "#/lib/text";
import { z } from "zod";

const HERO_IMAGE_WIDTHS = [400, 800, 1200, 1600] as const;

const HeroImageSchema = z
  .array(imageSchema(HERO_IMAGE_WIDTHS))
  .transform((arr) => arr.at(0));

const INFOS_QUERY = /* GraphQL */ `
  ${imageFragment(HERO_IMAGE_WIDTHS, "HeroImage")}
  ${SEO_FRAGMENT}
  ${TEXT_FRAGMENT}
  query Infos {
    entry(section: "infos") {
      id
      title
      uri
      ... on infos_Entry {
        heroImage {
          ...HeroImage
        }
        headline
        infoAccordion {
          ... on accordionItem_Entry {
            id
            title
            text {
              html
            }
          }
        }
        text {
          ...TextFields
        }
        downloadsHeadline
        downloads {
          id
          title
          url
        }
        seo {
          ...SeoFields
        }
      }
    }
  }
`;

const InfosQuerySchema = z
  .object({
    data: z.object({
      entry: z
        .object({
          id: z.string(),
          title: z.string(),
          uri: z.string(),
          heroImage: HeroImageSchema,
          headline: z.string().apply(nullToUndefined),
          infoAccordion: z
            .array(
              z.object({
                id: z.string(),
                title: z.string(),
                text: TextSchema.apply(nullToUndefined),
              }),
            )
            .apply(nullToUndefined),
          text: TextSchema.apply(nullToUndefined),
          downloadsHeadline: z.string().apply(nullToUndefined),
          downloads: z
            .array(
              z.object({
                id: z.string(),
                title: z.string(),
                url: z.string(),
              }),
            )
            .apply(nullToUndefined),
          seo: SeoSchema.apply(nullToUndefined),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { entry } }) => entry);

type InfosQuery = z.infer<typeof InfosQuerySchema>;

export { INFOS_QUERY, InfosQuerySchema };
export type { InfosQuery };
