import type { AnyRouteMatch } from "@tanstack/react-router";
import { z } from "zod";

// GraphQL fragment — spread this on any seo field.
// Requires ethercreative/craft-seo plugin.
export const SEO_FRAGMENT = /* GraphQL */ `
  fragment SeoFields on Ether_SeoData {
    title
    description
    advanced {
      canonical
      robots
    }
  }
`;

export const SeoSchema = z.object({
  title: z.string(),
  description: z.string(),
  advanced: z.object({
    canonical: z.string().nullable(),
    robots: z.array(z.string()),
  }),
});

export type Seo = z.infer<typeof SeoSchema>;

/**
 * Converts a Craft SEO field value into the meta/links shape
 * expected by TanStack Router's `head()` return value.
 *
 * Social tags are intentionally omitted.
 */
export function seoToHead(seo: Seo | null | undefined) {
  if (!seo) return { meta: [], links: [] };

  const meta: AnyRouteMatch["meta"] = [];
  const links: AnyRouteMatch["links"] = [];

  if (seo.title) meta.push({ title: seo.title });
  if (seo.description)
    meta.push({ name: "description", content: seo.description });
  if (seo.advanced.robots.length > 0)
    meta.push({ name: "robots", content: seo.advanced.robots.join(", ") });
  if (seo.advanced.canonical)
    links.push({ rel: "canonical", href: seo.advanced.canonical });

  return { meta, links };
}
