'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

function scrollToTop() {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

/** 모바일에서 SPA 이동 후 scrollHeight가 줄지 않는 현상 완화 */
function refreshViewportLayout() {
  window.dispatchEvent(new Event('resize'))
  if (window.visualViewport) {
    window.visualViewport.dispatchEvent(new Event('resize'))
  }

  const html = document.documentElement
  const body = document.body
  html.style.height = 'auto'
  body.style.height = 'auto'
  void html.offsetHeight
  html.style.height = ''
  body.style.height = ''
}

function resetPageScrollAndLayout() {
  scrollToTop()
  refreshViewportLayout()
}

export function ScrollOnNavigate() {
  const pathname = usePathname()

  useEffect(() => {
    resetPageScrollAndLayout()
    requestAnimationFrame(resetPageScrollAndLayout)
    const timeoutId = window.setTimeout(resetPageScrollAndLayout, 0)

    return () => window.clearTimeout(timeoutId)
  }, [pathname])

  return null
}
