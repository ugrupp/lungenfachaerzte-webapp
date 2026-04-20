import { LINK_FRAGMENT, LinkSchema } from "#/lib/craftLink";
import { z } from "zod";

export const GLOBALS_QUERY = /* GraphQL */ `
  ${LINK_FRAGMENT}
  query Globals {
    navigation: globalSet(handle: "navigation") {
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
    doctolib: globalSet(handle: "doctolibLink") {
      ... on doctolibLink_GlobalSet {
        doctolibLink {
          ...LinkFields
        }
      }
    }
  }
`;

export const GlobalsQuerySchema = z
  .object({
    data: z.object({
      navigation: z
        .object({
          navigationItems: z.array(
            z.object({
              id: z.string(),
              link: LinkSchema.nullable(),
            }),
          ),
        })
        .nullable(),
      doctolib: z
        .object({
          doctolibLink: LinkSchema.nullable(),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { navigation, doctolib } }) => ({
    navigation: (navigation?.navigationItems ?? []).flatMap(({ id, link }) =>
      link !== null ? [{ id, link }] : [],
    ),
    doctolibLink: doctolib?.doctolibLink ?? null,
  }));

export type GlobalsQuery = z.infer<typeof GlobalsQuerySchema>;
