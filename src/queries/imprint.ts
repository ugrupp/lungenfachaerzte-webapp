import { nullToUndefined } from "#/lib/helpers";
import { TEXT_FRAGMENT, TextSchema } from "#/lib/text";
import { z } from "zod";

const IMPRINT_QUERY = /* GraphQL */ `
  ${TEXT_FRAGMENT}
  query ImprintPage {
    entry(section: "imprint") {
      id
      title
      uri
      ... on plainpage_Entry {
        textPrimary {
          ...TextFields
        }
        textSecondary {
          ...TextFields
        }
      }
    }
  }
`;

const ImprintQuerySchema = z
  .object({
    data: z.object({
      entry: z
        .object({
          id: z.string(),
          title: z.string(),
          uri: z.string(),
          textPrimary: TextSchema.apply(nullToUndefined),
          textSecondary: TextSchema.apply(nullToUndefined),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { entry } }) => entry);

type ImprintQuery = z.infer<typeof ImprintQuerySchema>;

export { IMPRINT_QUERY, ImprintQuerySchema };
export type { ImprintQuery };
