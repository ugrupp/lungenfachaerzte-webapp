import { nullToUndefined } from "#/lib/helpers";
import { TEXT_FRAGMENT, TextSchema } from "#/lib/text";
import { z } from "zod";

const PRIVACY_QUERY = /* GraphQL */ `
  ${TEXT_FRAGMENT}
  query PrivacyPage {
    entry(section: "privacy") {
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

const PrivacyQuerySchema = z
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

type PrivacyQuery = z.infer<typeof PrivacyQuerySchema>;

export { PRIVACY_QUERY, PrivacyQuerySchema };
export type { PrivacyQuery };
