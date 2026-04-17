import { z } from "zod";

const HOME_QUERY = /* GraphQL */ `
  query Home {
    entry(section: "home") {
      id
      title
      uri
      ... on home_Entry {
        text {
          html
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
          text: z.object({ html: z.string() }).nullish(),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { entry } }) => entry);

type HomeQueryResult = z.infer<typeof HomeQuerySchema>;

export { HOME_QUERY, HomeQuerySchema };
export type { HomeQueryResult };
