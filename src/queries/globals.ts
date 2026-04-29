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
    footer: globalSet(handle: "footer") {
      ... on footer_GlobalSet {
        infoText1 {
          html
        }
        infoText2 {
          html
        }
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
    contact: globalSet(handle: "contact") {
      ... on contact_GlobalSet {
        appointmentText {
          html
        }
        appointmentLink {
          ...LinkFields
        }
        contactText {
          html
        }
        opentimes {
          html
        }
        address {
          html
        }
        routeLink {
          ...LinkFields
        }
      }
    }
  }
`;

// TODO: globalize
const RichTextSchema = z.object({ html: z.string() }).nullable();

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
      footer: z
        .object({
          infoText1: RichTextSchema,
          infoText2: RichTextSchema,
          navigationItems: z.array(
            z.object({
              id: z.string(),
              link: LinkSchema.nullable(),
            }),
          ),
        })
        .nullable(),
      contact: z
        .object({
          appointmentText: RichTextSchema,
          appointmentLink: LinkSchema.nullable(),
          contactText: RichTextSchema,
          opentimes: RichTextSchema,
          address: RichTextSchema,
          routeLink: LinkSchema.nullable(),
        })
        .nullable(),
    }),
  })
  .transform(({ data: { navigation, doctolib, footer, contact } }) => ({
    navigation: (navigation?.navigationItems ?? []).flatMap(({ id, link }) =>
      link !== null ? [{ id, link }] : [],
    ),
    doctolibLink: doctolib?.doctolibLink ?? null,
    footer: {
      infoText1: footer?.infoText1?.html,
      infoText2: footer?.infoText2?.html,
      navigationItems: (footer?.navigationItems ?? []).flatMap(
        ({ id, link }) => (link !== null ? [{ id, link }] : []),
      ),
    },
    contact: {
      appointmentText: contact?.appointmentText?.html ?? null,
      appointmentLink: contact?.appointmentLink ?? null,
      contactText: contact?.contactText?.html ?? null,
      opentimes: contact?.opentimes?.html ?? null,
      address: contact?.address?.html ?? null,
      routeLink: contact?.routeLink ?? null,
    },
  }));

export type GlobalsQuery = z.infer<typeof GlobalsQuerySchema>;
