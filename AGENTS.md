# Lungenfachaerzte — TanStack Start + Craft CMS

## Project overview

Medical practice website for Lungenfachaerzte. Headless CMS architecture:

- **Frontend**: TanStack Start (React 19, SSR, Netlify deployment)
- **CMS**: Craft CMS 5 in headless mode — GraphQL API, no template rendering
- **Package manager**: pnpm
- **Styling**: Tailwind CSS v4 (Vite plugin, no config file)

## Scaffold command

```bash
npx @tanstack/cli@latest create lungenfachaerzte --agent --tailwind --add-ons tanstack-query,netlify
```

Run from parent directory. Files were moved into `webapp/`. pnpm used instead of npm.

Intent was wired with:

```bash
npx @tanstack/intent@latest install
npx @tanstack/intent@latest list
```

## Stack & integrations

| Layer         | Package                                | Notes                                     |
| ------------- | -------------------------------------- | ----------------------------------------- |
| Framework     | `@tanstack/react-start`                | SSR, server functions, file-based routing |
| Router        | `@tanstack/react-router`               | File router, loaderDeps, search params    |
| Data fetching | `@tanstack/react-query`                | Client-side cache layer                   |
| Styling       | `tailwindcss` v4 + `@tailwindcss/vite` | No `tailwind.config.*` file               |
| CMS           | Craft CMS 5 (headless)                 | GraphQL API, live preview                 |
| Deployment    | Netlify                                | `@netlify/vite-plugin-tanstack-start`     |
| Devtools      | `@tanstack/devtools-vite`              | Must be FIRST plugin in vite.config.ts    |

## Environment variables

Copy `.env.example` to `.env` and fill in values before starting.

| Variable        | Description                                                                       |
| --------------- | --------------------------------------------------------------------------------- |
| `CRAFT_URL`     | Craft CMS backend URL, no trailing slash (e.g. `https://api.lungenfachaerzte.de`) |
| `GRAPHQL_TOKEN` | Bearer token for the public GraphQL schema                                        |

`GRAPHQL_TOKEN` is accessed only inside `createServerFn` (in `src/serverFunctions/`) and never sent to the browser.

## Key architecture decisions

### Craft API client

`src/lib/executeCraftQuery.ts` — low-level Craft GraphQL HTTP client (uses `ky` + `neverthrow`).

- Keeps `GRAPHQL_TOKEN` server-only (CRITICAL — only call this inside server function handlers, never in loaders or components directly)
- Accepts an optional `previewToken` for live-preview requests

`src/serverFunctions/get*ServerFn.ts` — one `createServerFn` per page/section. Each validates and parses the response with Zod. Call these from route loaders.

`src/lib/craftPreview.ts` — client-safe `craftPreviewSearchSchema` Zod schema used by route `validateSearch`.

### Query files

`src/queries/<section>.ts` — one file per section/page (e.g. `home.ts`, `team.ts`, `globals.ts`). Each exports query strings and a Zod schema for the response. Run queries against `${CRAFT_URL}/api/graphiql` to verify them.

### Live preview

Craft live-preview passes `?token=<uuid>&x-craft-live-preview=1` to the preview URL.

**Per-route setup** (required for any Craft-powered route):

```ts
import { craftPreviewSearchSchema } from "#/lib/craftPreview";
import { getMyPageServerFn } from "#/serverFunctions/getMyPageServerFn";

export const Route = createFileRoute("/my-path")({
  validateSearch: craftPreviewSearchSchema,
  loaderDeps: ({ search }) => ({
    token: search.token,
    preview: search["x-craft-live-preview"],
  }),
  loader: ({ params, deps }) =>
    getMyPageServerFn({
      data: { slug: params.slug, previewToken: deps.token },
    }),
});
```

**Hot-reload (postMessage)** — `src/components/CraftPreviewListener.tsx` is mounted in the root document. When Craft broadcasts `entry:live-preview:updated` via `postMessage`, it calls `router.invalidate()` to re-run active loaders with the existing token.

Craft control-panel setting — Preview Targets URL template:

```
{siteUrl}/{uri}?token={previewToken}&x-craft-live-preview=1
```

Disable "Auto-refresh" on the preview target to use postMessage instead (requires a Craft module — see below).

**Craft module for postMessage** — you need a small PHP module in the Craft backend that registers JavaScript in the CP to fire the `postMessage` on `beforeUpdateIframe`. Reference: https://aaronmbushnell.com/hot-reloading-content-in-craft-cms-live-preview/ and https://craftcms.com/docs/5.x/extend/module-guide.html

### Routing strategy

Pages in Craft can live under arbitrary URIs. Two recommended patterns:

1. **Section-specific routes** — `/blog`, `/blog/$slug` (explicit, best performance)
2. **Catch-all route** — `/src/routes/$.tsx` queries Craft by URI and renders the appropriate section component (mirrors the Next.js starter's `[...slug]` approach)

### Data fetching guideline

```
Craft data → executeCraftQuery (inside createServerFn) → route loader → component via useLoaderData()
TanStack Query → client-side cache for interactive/user-specific data only (e.g. globals used across many components)
```

## Deployment — Netlify

Netlify adapter is pre-configured in `vite.config.ts` via `@netlify/vite-plugin-tanstack-start`.

```bash
pnpm build
npx netlify deploy --prod
```

Set environment variables in Netlify dashboard → Site → Environment Variables:

- `CRAFT_URL`
- `GRAPHQL_TOKEN`
- `BASE_URL` (set to the Netlify production URL)

`netlify.toml` is included and controls the build command. Do not add a `[build] publish` that points to a static directory — SSR requires Netlify Functions.

## Known gotchas

- **Tailwind v4**: no `tailwind.config.ts` — CSS is in `src/styles/main.css` only. Use `@source` directives or `content` globs inside the CSS file if classes are not detected.
- **pnpm build scripts**: `pnpm approve-builds` may be needed for `@parcel/watcher` and `sharp` if asset transforms are added.
- **Craft GraphQL path**: the default API path is `/api`. This must match `cms/config/routes.php` → `'api' => 'graphql/api'`.
- **CORS**: Craft headless mode only serves CP, action, and asset requests. The GraphQL endpoint must allow the frontend origin. Set `allowedOrigins` in `cms/config/app.web.php` or use a proxy.
- **Preview tokens**: preview tokens are scoped to a specific entry draft and expire. They are not the same as the static `GRAPHQL_TOKEN`.
- **loaderDeps and staleTime**: preview requests intentionally bypass cache. The loader will re-fetch whenever `deps.token` changes. Do not set a `staleTime` on routes that support preview.

<!-- intent-skills:start -->

# Skill mappings — when working in these areas, load the linked skill file into context.

skills:

- task: "fetching data from Craft CMS, calling server-only APIs, using createServerFn"
  load: "node_modules/@tanstack/react-start/skills/react-start/SKILL.md"

- task: "fetching data from Craft CMS, calling server-only APIs, using createServerFn"
  load: "node_modules/.pnpm/@tanstack+start-client-core@1.167.16/node_modules/@tanstack/start-client-core/skills/start-core/server-functions/SKILL.md"

  # To load this skill, run: npx @tanstack/intent@latest list | grep server-functions

- task: "creating or editing routes, file-based routing, createFileRoute"
  load: "node_modules/@tanstack/router-plugin/skills/router-plugin/SKILL.md"

- task: "route data loading, loaders, loaderDeps, staleTime, invalidating"

  # To load this skill, run: npx @tanstack/intent@latest list | grep data-loading

  load: "node_modules/.pnpm/@tanstack+router-core@1.168.14/node_modules/@tanstack/router-core/skills/router-core/data-loading/SKILL.md"

- task: "search params, URL query params, validateSearch, Craft live-preview token"

  # To load this skill, run: npx @tanstack/intent@latest list | grep search-params

  load: "node_modules/.pnpm/@tanstack+router-core@1.168.14/node_modules/@tanstack/router-core/skills/router-core/search-params/SKILL.md"

- task: "deploying to Netlify, SSR, static prerendering, selective SSR"

  # To load this skill, run: npx @tanstack/intent@latest list | grep deployment

  load: "node_modules/.pnpm/@tanstack+start-client-core@1.167.16/node_modules/@tanstack/start-client-core/skills/start-core/deployment/SKILL.md"

- task: "adding API routes, server-side HTTP handlers, REST endpoints"

  # To load this skill, run: npx @tanstack/intent@latest list | grep server-routes

  load: "node_modules/.pnpm/@tanstack+start-client-core@1.167.16/node_modules/@tanstack/start-client-core/skills/start-core/server-routes/SKILL.md"

- task: "server/client boundary, isomorphic code, environment variables, VITE\_ prefix"

  # To load this skill, run: npx @tanstack/intent@latest list | grep execution-model

  load: "node_modules/.pnpm/@tanstack+start-client-core@1.167.16/node_modules/@tanstack/start-client-core/skills/start-core/execution-model/SKILL.md"

- task: "authentication, route guards, beforeLoad redirects" # To load this skill, run: npx @tanstack/intent@latest list | grep auth-and-guards
load: "node_modules/.pnpm/@tanstack+router-core@1.168.14/node_modules/@tanstack/router-core/skills/router-core/auth-and-guards/SKILL.md"
<!-- intent-skills:end -->
