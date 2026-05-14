import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const baseUrl: string =
          (import.meta.env.VITE_BASE_URL as string | undefined) ??
          "https://www.lungenfachaerzte.de";

        const body = [
          "# https://www.robotstxt.org/robotstxt.html",
          "User-agent: *",
          "Disallow:",
          "",
          `Sitemap: ${baseUrl}/sitemap.xml`,
        ].join("\n");

        return new Response(body, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      },
    },
  },
});
