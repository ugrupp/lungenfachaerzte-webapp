import { imageFragment, imageSchema } from "#/lib/image";
import { SEO_FRAGMENT, SeoSchema } from "#/lib/seo";
import { z } from "zod";

const HOME_IMAGE_WIDTHS = [400, 800, 1200] as const;

const HOME_QUERY = /* GraphQL */ `
  ${imageFragment(HOME_IMAGE_WIDTHS, "HomeImage")}
  ${SEO_FRAGMENT}
  query Home {
    entry(section: "home") {
      id
      title
      uri
      ... on home_Entry {
        seo {
          ...SeoFields
        }
        text {
          html
        }
        image {
          ...HomeImage
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
          text: z
            .object({
              html: z.string(),
            })
            .nullable(),
          image: z
            .array(imageSchema(HOME_IMAGE_WIDTHS))
            .transform((arr) => arr[0] ?? null)
            .nullable(),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { entry } }) => entry);

type HomeQueryResult = z.infer<typeof HomeQuerySchema>;

export { HOME_QUERY, HomeQuerySchema };
export type { HomeQueryResult };
