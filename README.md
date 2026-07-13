# Lungenfachärzte in der Bertoldstrasse — Frontend

[![Netlify Status](https://api.netlify.com/api/v1/badges/91a9135d-4e8f-40ec-8b4b-bae274514b62/deploy-status)](https://app.netlify.com/projects/lungenfachaerzte/deploys)

[www.lungenfachaerzte.de](https://lungenfachaerzte.de/)

- ➡️ **Frontend** — TanStack Start (React 19, SSR) deployed to Netlify
- [**CMS**](https://github.com/ugrupp/lungenfachaerzte-cms) — Craft CMS 5 in headless mode, GraphQL API

## Stack

| Layer      | Technology                                         |
| ---------- | -------------------------------------------------- |
| Framework  | TanStack Start + TanStack Router (file-based, SSR) |
| Data       | TanStack Query + server functions                  |
| Styling    | Tailwind CSS v4 (Vite plugin, no config file)      |
| CMS        | Craft CMS 5 — GraphQL                              |
| Deployment | Netlify (`@netlify/vite-plugin-tanstack-start`)    |
| Animation  | Motion (motion/react)                              |

## Prerequisites

- Node.js ≥ 24
- pnpm
- Running Craft CMS instance (local or remote)

## Setup

```bash
# Install dependencies
pnpm install

# Copy env file and fill in values
cp .env.example .env
```

| Variable        | Description                                |
| --------------- | ------------------------------------------ |
| `CRAFT_URL`     | Craft CMS backend URL, no trailing slash   |
| `GRAPHQL_TOKEN` | Bearer token for the public GraphQL schema |

`GRAPHQL_TOKEN` is server-only. It is accessed exclusively inside server functions and never exposed to the browser.

## Development

```bash
pnpm dev        # dev server on http://localhost:3000
pnpm typecheck  # TypeScript check
pnpm lint       # ESLint
pnpm test       # Vitest
```

## Production build

```bash
pnpm build
```

Deploy to Netlify:

```bash
npx netlify deploy --prod
```

Set `CRAFT_URL` and `GRAPHQL_TOKEN` as environment variables in the Netlify dashboard.

## Project structure

```
src/
  routes/           # File-based routes (TanStack Router)
    __root.tsx        # Root layout — Header, Contact footer, preview listener
    index.tsx         # Home (/)
    kontakt.tsx       # Contact page (/kontakt)
    schwerpunkte.tsx  # Specialties (/schwerpunkte)
    team.tsx          # Team (/team)
  serverFunctions/  # createServerFn wrappers — all Craft API calls live here
  queries/          # GraphQL query strings
  components/       # React components
  lib/              # Utilities (image helpers, SEO, link, text …)
  styles/           # Global CSS + Tailwind v4 source
```

## Craft CMS integration

All Craft data fetching happens through `src/serverFunctions/`. Server functions keep `GRAPHQL_TOKEN` server-only and accept an optional `previewToken` for live-preview requests.

GraphQL queries are defined in `src/queries/`. Test and iterate them against `${CRAFT_URL}/api/graphiql`.

### Live preview

Routes that support Craft live preview use `craftPreviewSearchSchema` as `validateSearch` and pass `deps.token` to the server function. See `AGENTS.md` for the full setup guide.

Craft preview target URL template:

```
{siteUrl}/{uri}?token={previewToken}&x-craft-live-preview=1
```

## Continuous deployment

The repository is connected to Netlify. Every push to the main branch triggers an automatic production deploy — no manual `netlify deploy` step needed.

## Sitemap

Sitemap requests (`/sitemap*`) are proxied to Craft via `netlify.toml`.

## Notes

- Tailwind v4 — no `tailwind.config.ts`. All CSS in `src/styles/`.
- SVGs imported as React components via `vite-plugin-svgr` using the `?react` suffix.
- `NODE_OPTIONS=--use-system-ca` is set in the dev script for corporate CA trust chains.
