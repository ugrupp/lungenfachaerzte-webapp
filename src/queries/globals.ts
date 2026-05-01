import { nullToUndefined } from "#/lib/helpers";
import { imageFragment, imageSchema } from "#/lib/image";
import { LINK_FRAGMENT, LinkSchema } from "#/lib/link";
import { TextSchema } from "#/lib/text";
import { z } from "zod";

const TEXTURE_IMAGE_WIDTHS = [400, 800, 1200, 1600] as const;

export const GLOBALS_QUERY = /* GraphQL */ `
  ${imageFragment(TEXTURE_IMAGE_WIDTHS, "TextureImage")}
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
    textur: asset(filename: "textur.jpg") {
      ...TextureImage
    }
  }
`;

export const GlobalsQuerySchema = z
  .object({
    data: z.object({
      navigation: z.object({
        navigationItems: z.array(
          z.object({
            id: z.string(),
            link: LinkSchema.nullable(),
          }),
        ),
      }),
      doctolib: z
        .object({
          doctolibLink: LinkSchema.apply(nullToUndefined),
        })
        .apply(nullToUndefined),
      footer: z.object({
        infoText1: TextSchema.apply(nullToUndefined),
        infoText2: TextSchema.apply(nullToUndefined),
        navigationItems: z.array(
          z.object({
            id: z.string(),
            link: LinkSchema.nullable(),
          }),
        ),
      }),
      contact: z.object({
        appointmentText: TextSchema.apply(nullToUndefined),
        appointmentLink: LinkSchema.apply(nullToUndefined),
        contactText: TextSchema.apply(nullToUndefined),
        opentimes: TextSchema.apply(nullToUndefined),
        address: TextSchema.apply(nullToUndefined),
        routeLink: LinkSchema.apply(nullToUndefined),
      }),
      textur: imageSchema(TEXTURE_IMAGE_WIDTHS).nullable(),
    }),
  })
  .transform(({ data: { navigation, footer, doctolib, ...rest } }) => ({
    navigation: navigation.navigationItems.flatMap(({ id, link }) =>
      link ? [{ id, link }] : [],
    ),
    doctolibLink: doctolib?.doctolibLink,
    footer: {
      ...footer,
      navigationItems: footer.navigationItems.flatMap(({ id, link }) =>
        link ? [{ id, link }] : [],
      ),
    },
    ...rest,
  }));

export type GlobalsQuery = z.infer<typeof GlobalsQuerySchema>;
