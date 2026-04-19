import { z } from "zod";

/**
 * GraphQL fragment for a Craft linkit field.
 * In Craft, link fields are often named `linkit` because `link` is reserved.
 * Always alias the field to `link` in your query: `link: linkit { ...LinkFields }`
 */
export const LINK_FRAGMENT = /* GraphQL */ `
  fragment LinkFields on LinkData {
    id
    type
    value
    label
    defaultLabel
    target
  }
`;

/**
 * Linkit plugin types that point to internal Craft elements.
 * All other types ("url", "email", "phone", …) are treated as external.
 */
const INTERNAL_LINK_TYPES = new Set(["entry", "asset", "category", "user"]);

/**
 * Zod schema for a Craft link field value.
 *
 * - Internal links (entries, assets, …): `value` is normalized to a
 *   root-relative pathname, `isExternal` is `false`.
 * - External links (plain URL, email, phone, …): `value` is kept as-is,
 *   `isExternal` is `true`.
 */
export const LinkSchema = z
  .object({
    id: z.string().nullable(),
    type: z.string(),
    value: z.string(),
    label: z.string().nullable(),
    defaultLabel: z.string(),
    target: z
      .string()
      .nullable()
      .transform((x) => x ?? undefined),
  })
  .transform(({ type, value: href, ...rest }) => {
    const isExternal = !INTERNAL_LINK_TYPES.has(type);
    if (!isExternal) {
      try {
        href = new URL(href).pathname;
      } catch {
        // already a relative path
      }
    }
    return { ...rest, type, href, isExternal };
  });

export type CraftLink = z.infer<typeof LinkSchema>;

/** Build a plain CraftLink from just the required fields. */
export function makeCraftLink(
  href: string,
  overrides?: Partial<Omit<CraftLink, "href">>,
): CraftLink {
  return {
    id: null,
    type: "url",
    label: null,
    defaultLabel: href,
    target: undefined,
    isExternal: href.startsWith("http") || href.startsWith("mailto:"),
    ...overrides,
    href,
  };
}
