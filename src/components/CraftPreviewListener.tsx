import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * CraftPreviewListener — hot-reload support for Craft CMS Live Preview.
 *
 * How it works
 * ------------
 * Craft's control panel opens your front-end URL in an <iframe> with
 * `?token=<uuid>&x-craft-live-preview=1` appended. When the editor changes
 * content, Craft fires:
 *
 *   iframe.contentWindow.postMessage('entry:live-preview:updated', previewUrl)
 *
 * This component listens for that message and calls `router.invalidate()`,
 * which causes TanStack Router to re-run all active loaders — including any
 * route whose loader passes the `token` search param to `fetchCraft`.
 *
 * Prerequisites per route
 * -----------------------
 * Each Craft-powered route must declare the preview search params and include
 * them as loader dependencies so the loader re-runs when they change:
 *
 * ```ts
 * import { craftPreviewSearchSchema } from '#/lib/craftPreview'
 * import { getMyPageServerFn } from '#/serverFunctions/getMyPageServerFn'
 *
 * export const Route = createFileRoute('/my-path')({
 *   validateSearch: craftPreviewSearchSchema,
 *   loaderDeps: ({ search }) => ({
 *     token: search.token,
 *     preview: search['x-craft-live-preview'],
 *   }),
 *   loader: ({ params, deps }) =>
 *     getMyPageServerFn({
 *       data: {
 *         slug: params.slug,
 *         previewToken: deps.token,
 *       },
 *     }),
 * })
 * ```
 *
 * Craft control-panel setup
 * -------------------------
 * In Settings → Sections → [YourSection] → Preview Targets, set the URL to:
 *   {siteUrl}/{uri}?token={previewToken}&x-craft-live-preview=1
 * and disable "Auto-refresh" so Craft broadcasts via postMessage instead of
 * reloading the iframe (requires a Craft module — see AGENTS.md).
 *
 * Place this component inside the root document so it is always mounted:
 *   <CraftPreviewListener />
 */
export function CraftPreviewListener() {
  const router = useRouter();

  useEffect(() => {
    // Only activate inside a Craft live-preview iframe
    const isPreview =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("x-craft-live-preview");

    if (!isPreview) return;

    function handleMessage(event: MessageEvent) {
      if (event.data !== "craft:live-preview:update") return;
      // Re-run all active loaders so the updated draft content is fetched.
      // Loaders that pass the `token` search param will query Craft with
      // X-Craft-Token set, returning the latest draft data.
      router.invalidate();
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  // Renders nothing — side-effect only
  return null;
}
