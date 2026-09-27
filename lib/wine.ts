import { wine } from '#site/content'

export type WineNote = (typeof wine)[number]
export type WineListItem = Pick<
  WineNote,
  'slug' | 'title' | 'description' | 'tastedAt' | 'rating'
>

export function getWineNotes(): WineNote[] {
  return wine
    .filter((note) => !note.draft)
    .sort(
      (a, b) =>
        new Date(b.tastedAt).getTime() - new Date(a.tastedAt).getTime() ||
        a.slug.localeCompare(b.slug),
    )
}

export function getWineNoteBySlug(slug: string): WineNote | undefined {
  return getWineNotes().find((note) => note.slug === slug)
}

export function getWineListItems(): WineListItem[] {
  return getWineNotes().map(
    ({ slug, title, description, tastedAt, rating }) => ({
      slug,
      title,
      description,
      tastedAt,
      rating,
    }),
  )
}
