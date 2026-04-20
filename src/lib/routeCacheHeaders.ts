const PREVIEW_HEADERS: Record<string, string> = {
  "Cache-Control": "private, no-store",
};

const PUBLIC_PAGE_HEADERS: Record<string, string> = {
  "Netlify-CDN-Cache-Control":
    "public, max-age=604800, stale-while-revalidate=604800",
  "Cache-Control": "public, max-age=0, must-revalidate",
};

export function routeCacheHeaders(isPreview: boolean): Record<string, string> {
  return isPreview ? PREVIEW_HEADERS : PUBLIC_PAGE_HEADERS;
}
