import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import parse from "html-react-parser";
import type { ReactNode } from "react";

import { CraftPreviewListener } from "../components/CraftPreviewListener";
import Footer from "../components/Footer";
import Header from "../components/Header";

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
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
});

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>
      <body>
        <CraftPreviewListener />
        <Header />

        {children}

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
    staleTime: 1000 * 60 * 60,
  });

  return (
    <main>
      {data?.text?.html ? (
        <div className="richtext">{parse(data.text.html)}</div>
      ) : (
        <h1>404 — Seite nicht gefunden</h1>
      )}
    </main>
  );
}
