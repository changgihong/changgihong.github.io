import { WineList } from '@/components/widget/wine-list'
import { createPageMetadata } from '@/lib/page-metadata'
import { getWineListItems } from '@/lib/wine'

export const metadata = createPageMetadata({
  title: 'Wine',
  description:
    '마신 와인의 향과 맛, 시간에 따른 변화와 음식 궁합을 기록합니다.',
  path: '/wine',
})

export default function WineIndexPage() {
  return (
    <main className="pb-20">
      <h1 className="text-xl font-semibold">Wine</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Tasting Notes · 마신 와인의 향과 맛, 함께한 음식을 기록합니다.
      </p>
      <div className="mt-8">
        <WineList notes={getWineListItems()} />
      </div>
    </main>
  )
}
