'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

function scrollToTop() {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

/** 모바일에서 dvh가 커진 뒤 SPA 이동 시 문서 높이가 줄지 않는 현상 완화 */
function refreshViewportLayout() {
  window.dispatchEvent(new Event('resize'))
  if (window.visualViewport) {
    window.visualViewport.dispatchEvent(new Event('resize'))
  }
}

export function ScrollOnNavigate() {
  const pathname = usePathname()
  const isPopStateRef = useRef(false)

  useEffect(() => {
    const onPopState = () => {
      isPopStateRef.current = true
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (isPopStateRef.current) {
      isPopStateRef.current = false
      return
    }

    scrollToTop()
    refreshViewportLayout()
    requestAnimationFrame(() => {
      scrollToTop()
      refreshViewportLayout()
    })
  }, [pathname])

  return null
}
