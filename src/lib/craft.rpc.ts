import { createServerFn } from '@tanstack/react-start'

/** A deeply JSON-serializable value — satisfies TanStack Start's serialization check. */
export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue }

/**
 * Execute a Craft CMS GraphQL query on the server.
 * The GRAPHQL_TOKEN env var never leaves the server boundary.
 * For live preview, pass the token from the URL search params as `previewToken`.
 *
 * @example — in a route loader
 * ```ts
 * import { craftPreviewSearchSchema } from '#/lib/craft'
 * import { fetchCraft } from '#/lib/craft.rpc'
 * import { MY_QUERY } from '#/queries/craft'
 *
 * export const Route = createFileRoute('/my-path')({
 *   validateSearch: craftPreviewSearchSchema,
 *   loaderDeps: ({ search }) => ({
 *     token: search.token,
 *     preview: search['x-craft-live-preview'],
 *   }),
 *   loader: ({ params, deps }) =>
 *     fetchCraft({
 *       data: {
 *         query: MY_QUERY,
 *         variables: { slug: params.slug },
 *         previewToken: deps.token,
 *       },
 *     }),
 * })
 * ```
 */
export const fetchCraft = createServerFn({ method: 'POST' })
  .inputValidator((data: {
  query: string
  variables?: Record<string, string | number | boolean | null | string[]>
  /**
   * Craft live-preview token. When present:
   *  - replaces the static GRAPHQL_TOKEN so draft content is returned
   *  - is also sent as X-Craft-Token so Craft routes to the correct draft
   */
  previewToken?: string
}) => data)
  .handler(async ({ data }) => {
    const apiBase = process.env.CRAFT_URL?.replace(/\/$/, '')
    if (!apiBase) {
      throw new Error('CRAFT_URL environment variable is not set')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    const token = process.env.GRAPHQL_TOKEN
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    if (data.previewToken) {
      // Tells Craft to return draft content for this preview token
      headers['X-Craft-Token'] = data.previewToken
    }

    const response = await fetch(`${apiBase}/api`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: data.query,
        variables: data.variables ?? {},
      }),
    })

    if (!response.ok) {
      throw new Error(`Craft GraphQL HTTP ${response.status}: ${response.statusText}`)
    }

    const result = (await response.json()) as {
      data?: JsonValue
      errors?: Array<{ message: string }>
    }

    if (result.errors?.length) {
      console.error('Craft GraphQL errors:', result.errors)
    }

    return result.data ?? null
  })

