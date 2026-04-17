import { z } from "zod";

// ---------------------------------------------------------------------------
// Live-preview search-param schema
// All Craft-powered routes that support live preview should include this in
// their `validateSearch`. Using plain Zod – no adapter needed here since
// these are optional strings with fallbacks.
// ---------------------------------------------------------------------------

export const craftPreviewSearchSchema = z.object({
  /**
   * Craft live-preview token passed by the CP when opening a preview URL.
   * Format: ?token=<uuid>
   */
  token: z.string().optional(),
  /**
   * Craft appends this flag to the preview URL to signal that the page is
   * running inside the live-preview iframe.
   * Format: ?x-craft-live-preview=1
   */
  "x-craft-live-preview": z.string().optional(),
});

export type CraftPreviewSearch = z.infer<typeof craftPreviewSearchSchema>;

/** Returns true when a set of parsed search params is a Craft preview request. */
export function isCraftPreview(search: CraftPreviewSearch): boolean {
  return Boolean(search.token && search["x-craft-live-preview"]);
}
