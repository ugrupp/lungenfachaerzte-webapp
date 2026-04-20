import { TEXT_FRAGMENT, TextSchema } from "#/lib/text";
import { z } from "zod";

export const ERRORPAGE_QUERY = /* GraphQL */ `
  ${TEXT_FRAGMENT}
  query Errorpage {
    globalSet(handle: "errorpage") {
      id
      ... on errorpage_GlobalSet {
        text {
          ...TextFields
        }
      }
    }
  }
`;

export const ErrorpageQuerySchema = z
  .object({
    data: z.object({
      globalSet: z
        .object({
          id: z.string(),
          text: TextSchema.nullable(),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { globalSet } }) => globalSet);

export type ErrorpageQuery = z.infer<typeof ErrorpageQuerySchema>;
