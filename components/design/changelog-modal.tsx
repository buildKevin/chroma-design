'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

// ── Changelog data ────────────────────────────────────────────────────────────
// Add new entries at the TOP. Latest version = CHANGELOG[0].

const LATEST_VERSION = '0.4'

type EntryType = 'New' | 'Improved' | 'Fixed'

interface Release {
  version: string
  date: string
  entries: { type: EntryType; text: string }[]
}

const CHANGELOG: Release[] = [
  {
    version: '0.4',
    date: 'March 2026',
    entries: [
      { type: 'New',      text: 'Icons tab — browse 400+ icons across Lucide, Heroicons, Phosphor, Tabler and Radix' },
      { type: 'New',      text: 'Copy SVG for Figma — paste any icon directly onto the Figma canvas at the right color' },
      { type: 'New',      text: 'Copy JSX in one click — grabs the ready-to-use <Icon> snippet' },
    ],
  },
  {
    version: '0.3',
    date: 'March 2026',
    entries: [
      { type: 'New',      text: 'Motion tab — spring physics editor with interactive 2D canvas and CSS/Tailwind export' },
      { type: 'New',      text: 'Figma export — copy the full palette as SVG swatches, paste with Ctrl+V into Figma' },
      { type: 'Improved', text: 'Feature cards on landing page now have animated illustrations' },
    ],
  },
  {
    version: '0.2',
    date: 'February 2026',
    entries: [
      { type: 'New',      text: 'Typography tab — pair heading and body fonts from Google Fonts with live preview' },
      { type: 'New',      text: 'Tailwind v4 export format added alongside v3, CSS and design tokens' },
      { type: 'Improved', text: 'Share button — current palette URL is copied to clipboard in one click' },
    ],
  },
  {
    version: '0.1',
    date: 'January 2026',
    entries: [
      { type: 'New', text: 'Color palette generation with Tailwind, Material and Custom algorithms' },
      { type: 'New', text: 'Adjustable shade count (3–15) and contrast shift' },
      { type: 'New', text: 'Export as CSS variables, Tailwind config, or JSON design tokens' },
      { type: 'New', text: 'Spacebar shortcut to shuffle to a random vibrant color' },
    ],
  },
]

// ── Tag styles ─────────────────────────────────────────────────────────────────

const TAG: Record<EntryType, string> = {
  New:      'bg-foreground/8 text-foreground',
  Improved: 'bg-foreground/6 text-muted-foreground',
  Fixed:    'bg-foreground/6 text-muted-foreground',
}

// ── Component ─────────────────────────────────────────────────────────────────

const SEEN_KEY = 'chroma_seen_version'

export function ChangelogModal() {
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem(SEEN_KEY)
    if (seen !== LATEST_VERSION) setHasUnread(true)
  }, [])

  const markSeen = () => {
    localStorage.setItem(SEEN_KEY, LATEST_VERSION)
    setHasUnread(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          onClick={markSeen}
          className="relative flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Sparkles className="size-3.5" />
          What's new
          {hasUnread && (
            <span className="absolute -right-1.5 -top-1 size-1.5 rounded-full bg-foreground" />
          )}
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-w-md gap-0 overflow-hidden p-0"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <DialogTitle className="text-base">Changelog</DialogTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">What's been added to Chroma</p>
          </div>
          <span className="rounded-md border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
            v{LATEST_VERSION}
          </span>
        </div>

        {/* Entries */}
        <div className="max-h-[460px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {CHANGELOG.map((release, ri) => (
            <div key={release.version} className={cn('px-6 py-5', ri < CHANGELOG.length - 1 && 'border-b border-border')}>
              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-sm font-semibold">v{release.version}</span>
                <span className="text-xs text-muted-foreground">{release.date}</span>
              </div>
              <ul className="space-y-2.5">
                {release.entries.map((entry, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className={cn('mt-px shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight', TAG[entry.type])}>
                      {entry.type}
                    </span>
                    <span className="text-sm leading-snug text-muted-foreground">{entry.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
