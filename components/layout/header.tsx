'use client'
import { TextEffect } from '@/components/ui/text-effect'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn('mb-8 flex shrink-0 items-center justify-between', className)}
    >
      <div>
        <Link href="/" className="font-medium text-black dark:text-white">
          개발자 홍창기
        </Link>
        <TextEffect
          as="p"
          preset="fade"
          per="char"
          className="text-zinc-600 dark:text-zinc-500"
          delay={0.5}
        >
          Web Developer
        </TextEffect>
      </div>
    </header>
  )
}
