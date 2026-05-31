'use client'

import { WikiGraphCanvas } from '@/components/widget/wiki-graph-canvas'
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTrigger,
} from '@/components/ui/morphing-dialog'
import type { WikiGraph } from '@/lib/wiki-graph'

type WikiGraphDialogProps = {
  graph: WikiGraph
  variant?: 'button' | 'link'
}

const TRIGGER_CLASS = {
  button:
    'shrink-0 rounded-full border border-zinc-300 px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500',
  link: 'text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200',
}

export function WikiGraphDialog({
  graph,
  variant = 'button',
}: WikiGraphDialogProps) {
  return (
    <MorphingDialog
      transition={{ type: 'spring', bounce: 0.05, duration: 0.35 }}
    >
      <MorphingDialogTrigger className={TRIGGER_CLASS[variant]}>
        Graph
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative w-[90vw] max-w-4xl rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
          <WikiGraphCanvas graph={graph} variant="dialog" />
          <MorphingDialogClose className="text-zinc-500 dark:text-zinc-400" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}
