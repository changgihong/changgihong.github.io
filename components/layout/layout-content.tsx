'use client'

import { usePathname } from 'next/navigation'

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // SPA 이동 후 이전 페이지 높이가 문서에 남는 모바일 Safari 이슈 완화
  return (
    <div key={pathname} className="min-w-0">
      {children}
    </div>
  )
}
