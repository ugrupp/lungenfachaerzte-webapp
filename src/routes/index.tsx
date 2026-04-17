import { createFileRoute } from '@tanstack/react-router'
import { craftPreviewSearchSchema } from '#/lib/craft'
import { fetchCraft } from '#/lib/craft.rpc'
import { HOME_QUERY } from '#/queries/craft'

export const Route = createFileRoute('/')({
  validateSearch: craftPreviewSearchSchema,
  loaderDeps: ({ search }) => ({
    token: search.token,
    preview: search['x-craft-live-preview'],
  }),
  loader: async ({ deps }) => {
    const data = await fetchCraft({
      data: {
        query: HOME_QUERY,
        previewToken: deps.token,
      },
    })
    return { ...data, _isPreview: !!deps.token }
  },
  headers: ({ loaderData }) => {
    if (loaderData._isPreview) {
      return { 'Cache-Control': 'private, no-store' }
    }
    return {
      'Netlify-CDN-Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    }
  },
  component: HomePage,
})

function HomePage() {
  const data = Route.useLoaderData()
  const entry = (data as any)?.entry

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
          {entry?.title}
        </h1>
        {entry?.text?.html && (
          <div
            className="prose max-w-2xl text-[var(--sea-ink-soft)]"
            dangerouslySetInnerHTML={{ __html: entry.text.html }}
          />
        )}
      </section>
    </main>
  )
}
