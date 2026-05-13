import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";

import { CraftPreviewListener } from "../components/CraftPreviewListener";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { isContactPagePath } from "../lib/contact";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import { getErrorPageServerFn } from "../serverFunctions/getErrorPageServerFn";

import appCss from "../styles/main.css?url";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Lungenfachärzte in der Bertoldstrasse",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/android-chrome-192x192.png",
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
});

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isContactPage = isContactPagePath(pathname);

  return (
    <html lang="de">
      <head>
        <HeadContent />
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prerender: [
                {
                  where: { href_matches: "/*" },
                  eagerness: "moderate",
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <CraftPreviewListener />

        <a href="#start" className="sr-only">
          Zum Content springen
        </a>
        <a href="#navigation" className="sr-only">
          Zur Navigation springen
        </a>

        {!isContactPage && <Header />}

        <main id="start" className="relative">
          {children}
        </main>

        <Footer />

        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundPage() {
  const { data } = useSuspenseQuery({
    queryKey: ["errorpage"],
    queryFn: () => getErrorPageServerFn(),
  });

  return (
    <main>
      {data?.text?.__html ? (
        <div className="richtext" dangerouslySetInnerHTML={data.text} />
      ) : (
        <h1>404 — Seite nicht gefunden</h1>
      )}
    </main>
  );
}
