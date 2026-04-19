import { LINK_FRAGMENT, LinkSchema } from "#/lib/craftLink";
import { z } from "zod";

/** Navigation items from the Craft "navigation" global set. */
export const NAVIGATION_QUERY = /* GraphQL */ `
  ${LINK_FRAGMENT}
  query Navigation {
    globalSet(handle: "navigation") {
      ... on navigation_GlobalSet {
        navigationItems {
          ... on navigationItem_Entry {
            id
            link: linkit {
              ...LinkFields
            }
          }
        }
      }
    }
  }
`;

export const NavigationQuerySchema = z
  .object({
    data: z.object({
      globalSet: z
        .object({
          navigationItems: z.array(
            z.object({
              id: z.string(),
              link: LinkSchema.nullable(),
            }),
          ),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { globalSet } }) =>
    (globalSet?.navigationItems ?? []).flatMap(({ id, link }) =>
      link !== null ? [{ id, link }] : [],
    ),
  );

export type NavigationQueryResult = z.infer<typeof NavigationQuerySchema>;
