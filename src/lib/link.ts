import { z } from "zod";
import { nullToUndefined } from "./helpers";

/**
 * GraphQL fragment for a Craft linkit field.
 * In Craft, link fields are often named `linkit` because `link` is reserved.
 * Always alias the field to `link` in your query: `link: linkit { ...LinkFields }`
 */
export const LINK_FRAGMENT = /* GraphQL */ `
  fragment LinkFields on LinkData {
    url
    label
    defaultLabel
    target
  }
`;

/**
 * Normalized link shape used across UI components.
 */
export const LinkSchema = z
  .object({
    url: z.string(),
    label: z.string().apply(nullToUndefined),
    defaultLabel: z.string(),
    target: z.string().apply(nullToUndefined),
  })
  .transform(({ url, ...rest }) => ({ href: url, ...rest }));

export type Link = z.infer<typeof LinkSchema>;
