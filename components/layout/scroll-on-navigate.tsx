'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

function refreshViewportLayout() {
  window.dispatchEvent(new Event('resize'))
  if (window.visualViewport) {
    window.visualViewport.dispatchEvent(new Event('resize'))
  }
}

/** iOS Safari: SPA 이동 후 scrollHeight가 줄지 않는 현상 완화 */
function resetPageScrollAndLayout() {
  scrollToTop()

  const shell = document.getElementById('site-shell')
  if (shell) {
    shell.style.minHeight = '0'
    shell.style.height = 'auto'
    void shell.offsetHeight
    shell.style.minHeight = ''
    shell.style.height = ''
  }

  const html = document.documentElement
  const body = document.body
  html.style.height = 'auto'
  body.style.height = 'auto'

  const prevOverflow = body.style.overflow
  body.style.overflow = 'hidden'
  void body.offsetHeight
  body.style.overflow = prevOverflow

  html.style.height = ''
  body.style.height = ''

  refreshViewportLayout()
}

export function ScrollOnNavigate() {
  const pathname = usePathname()

  useEffect(() => {
    resetPageScrollAndLayout()

    const rafId = requestAnimationFrame(resetPageScrollAndLayout)
    const timeout0 = window.setTimeout(resetPageScrollAndLayout, 0)
    const timeout100 = window.setTimeout(resetPageScrollAndLayout, 100)
    const timeout300 = window.setTimeout(resetPageScrollAndLayout, 300)

    return () => {
      cancelAnimationFrame(rafId)
      window.clearTimeout(timeout0)
      window.clearTimeout(timeout100)
      window.clearTimeout(timeout300)
    }
  }, [pathname])

  return null
}
