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
    social {
      twitter {
        title
        description
        image {
          url
        }
      }
      facebook {
        title
        image {
          url
        }
      }
    }
  }
`;

const SocialImageSchema = z.object({
  url: z.string(),
});

const SocialDataSchema = z.object({
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  image: SocialImageSchema.nullable().optional(),
});

export const SeoSchema = z.object({
  title: z.string(),
  description: z.string(),
  advanced: z.object({
    canonical: z.string().nullable(),
    robots: z.array(z.string()),
  }),
  social: z.object({
    twitter: SocialDataSchema.optional(),
    facebook: SocialDataSchema.optional(),
  }),
});

export type Seo = z.infer<typeof SeoSchema>;

export function seoToHead(seo: Seo | null | undefined, uri?: string) {
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

  // Open Graph tags
  meta.push(
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "de_DE" },
    {
      property: "og:site_name",
      content: "Lungenfachärzte in der Bertoldstrasse",
    },
  );
  const normalizedUri = uri === "__home__" ? "/" : uri;
  const baseUrl: string =
    (import.meta.env.VITE_BASE_URL as string | undefined) ??
    "https://www.lungenfachaerzte.de";
  const absoluteUrl = normalizedUri
    ? new URL(normalizedUri, baseUrl).toString()
    : undefined;
  if (absoluteUrl) {
    meta.push({ property: "og:url", content: absoluteUrl });
  }

  // Twitter Card tags
  if (seo.social.twitter) {
    const tw = seo.social.twitter;
    if (tw.image?.url) {
      meta.push(
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: tw.image.url },
      );
    }
    if (absoluteUrl) meta.push({ name: "twitter:url", content: absoluteUrl });
    if (tw.title) meta.push({ name: "twitter:title", content: tw.title });
    if (tw.description)
      meta.push({ name: "twitter:description", content: tw.description });
  }
  if (seo.social.facebook) {
    const fb = seo.social.facebook;
    if (fb.title) meta.push({ property: "og:title", content: fb.title });
    if (fb.image?.url)
      meta.push({ property: "og:image", content: fb.image.url });
  }

  return { meta, links };
}
