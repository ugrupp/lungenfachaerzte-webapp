import { z } from "zod";

export const ERRORPAGE_QUERY = /* GraphQL */ `
  query Errorpage {
    globalSet(handle: "errorpage") {
      id
      ... on errorpage_GlobalSet {
        text {
          html
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
          text: z
            .object({
              html: z.string(),
            })
            .nullable(),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { globalSet } }) => globalSet);

export type ErrorpageQueryResult = z.infer<typeof ErrorpageQuerySchema>;
