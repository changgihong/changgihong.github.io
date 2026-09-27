import { AnimatedBackground } from '@/components/ui/animated-background'
import { formatTastingDate } from '@/lib/wine-date'
import type { WineListItem } from '@/lib/wine'
import Link from 'next/link'

export function WineList({
  notes,
  heading: Heading = 'h2',
}: {
  notes: WineListItem[]
  heading?: 'h2' | 'h4'
}) {
  if (notes.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        아직 기록한 테이스팅 노트가 없습니다.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <AnimatedBackground
        enableHover
        className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
        transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
      >
        {notes.map((note) => (
          <Link
            key={note.slug}
            href={`/wine/${note.slug}`}
            data-id={note.slug}
            className="-mx-3 min-w-0 rounded-xl px-3 py-3 break-words"
          >
            <div className="flex flex-col gap-2">
              <Heading className="text-base font-normal dark:text-zinc-100">
                {note.title}
              </Heading>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {note.description}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                <span>
                  시음{' '}
                  <time dateTime={note.tastedAt}>
                    {formatTastingDate(note.tastedAt)}
                  </time>
                </span>
                {note.rating !== undefined && (
                  <span className="tabular-nums">
                    내 평점 {note.rating.toFixed(1)} / 5
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </AnimatedBackground>
    </div>
  )
}
