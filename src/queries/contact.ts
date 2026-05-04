import { nullToUndefined } from "#/lib/helpers";
import { SEO_FRAGMENT, SeoSchema } from "#/lib/seo";
import { z } from "zod";

const CONTACT_QUERY = /* GraphQL */ `
  ${SEO_FRAGMENT}
  query ContactPage {
    entry(section: "contact") {
      id
      title
      uri
      ... on contact_Entry {
        seo {
          ...SeoFields
        }
      }
    }
  }
`;

const ContactQuerySchema = z
  .object({
    data: z.object({
      entry: z
        .object({
          id: z.string(),
          title: z.string(),
          uri: z.string(),
          seo: SeoSchema.apply(nullToUndefined),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { entry } }) => entry);

type ContactQuery = z.infer<typeof ContactQuerySchema>;

export { CONTACT_QUERY, ContactQuerySchema };
export type { ContactQuery };
