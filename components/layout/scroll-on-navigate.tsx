'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

function scrollToTop() {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
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
    requestAnimationFrame(scrollToTop)
  }, [pathname])

  return null
}
