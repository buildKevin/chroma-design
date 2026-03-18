'use client'

import Link from 'next/link'
import { ArrowLeft, Github } from 'lucide-react'
import { ChangelogModal } from '@/components/design/changelog-modal'
import { ThemeToggle } from '@/components/design/theme-toggle'

export function DesignHeader() {
  return (
    <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </Link>
          <span className="h-4 w-px bg-border" />
          <span className="text-sm font-semibold tracking-tight">Chroma</span>
        </div>

        <nav className="flex items-center gap-6">
          <ThemeToggle />
          <ChangelogModal />
          <a
            href="https://github.com/buildKevin/chroma-design"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="size-3.5" />
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
