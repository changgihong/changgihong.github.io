import { MDXContent } from '@/components/mdx-content'
import { createPageMetadata } from '@/lib/page-metadata'
import { getWineNoteBySlug, getWineNotes } from '@/lib/wine'
import { formatTastingDate } from '@/lib/wine-date'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type WineNotePageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getWineNotes().map((note) => ({ slug: note.slug }))
}

export async function generateMetadata({
  params,
}: WineNotePageProps): Promise<Metadata> {
  const { slug } = await params
  const note = getWineNoteBySlug(slug)
  if (!note) return {}

  return createPageMetadata({
    title: note.title,
    description: note.description,
    path: `/wine/${note.slug}`,
    type: 'article',
  })
}

export default async function WineNotePage({ params }: WineNotePageProps) {
  const { slug } = await params
  const note = getWineNoteBySlug(slug)
  if (!note) notFound()

  const facts = [
    { label: '생산자', value: note.producer },
    { label: '빈티지', value: note.vintage },
    { label: '국가', value: note.country },
    { label: '지역', value: note.region },
    {
      label: '디켄팅',
      value:
        note.decanted === undefined
          ? undefined
          : note.decanted
            ? '사용'
            : '사용하지 않음',
    },
  ].filter((fact) => fact.value !== undefined)

  return (
    <main className="pb-20">
      <Link
        href="/wine"
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        {'<'} Wine
      </Link>
      <article className="mt-6">
        <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-800">
          <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
            {note.earlyRecord ? '초기 시음 기록' : 'Tasting Note'}
          </p>
          <h1 className="text-xl font-semibold break-words text-zinc-900 dark:text-zinc-100">
            {note.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
            <span>
              시음{' '}
              <time dateTime={note.tastedAt}>
                {formatTastingDate(note.tastedAt)}
              </time>
            </span>
            {note.rating !== undefined && (
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-700 tabular-nums dark:bg-zinc-900 dark:text-zinc-300">
                {note.earlyRecord ? '당시 평점' : '내 평점'}{' '}
                {note.rating.toFixed(1)} / 5
              </span>
            )}
          </div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
            {note.description}
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {facts.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                  {label}
                </dt>
                <dd className="mt-1 break-words text-zinc-700 dark:text-zinc-300">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </header>
        <div className="prose prose-gray dark:prose-invert prose-h2:mt-8 prose-h2:text-lg prose-h2:font-medium max-w-none break-words">
          <MDXContent code={note.body} />
        </div>
      </article>
    </main>
  )
}
