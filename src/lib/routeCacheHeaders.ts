const PREVIEW_HEADERS: Record<string, string> = {
  "Cache-Control": "private, no-store",
};

const PUBLIC_PAGE_HEADERS: Record<string, string> = {
  // Cache indefinitely on Netlify's CDN — invalidation is handled exclusively by the purge-on-publish webhook from Craft. No stale-while-revalidate:
  // SWR would cause background revalidations that reset Age to 0 needlessly.
  "Netlify-CDN-Cache-Control": "public, max-age=31536000, durable",
  // max-age=5: keeps page in memory cache long enough for Chrome cross-document view transitions (which need the old page frozen during new-page load).
  // must-revalidate is intentionally omitted — it causes Chrome to bypass the transition. Netlify CDN is controlled by the header above; this controls only the browser cache.
  "Cache-Control": "public, max-age=5",
};

export function routeCacheHeaders(isPreview: boolean): Record<string, string> {
  return isPreview ? PREVIEW_HEADERS : PUBLIC_PAGE_HEADERS;
}
