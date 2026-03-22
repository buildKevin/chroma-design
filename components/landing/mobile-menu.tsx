'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, Github, Sparkles } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ChangelogModal } from '@/components/design/changelog-modal'

export function LandingMobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center justify-center text-muted-foreground hover:text-foreground">
          <Menu className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 p-0">
        <nav className="flex flex-col gap-1 p-4 pt-12">
          <a
            href="#features"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#export"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Export
          </a>
          <a
            href="https://github.com/buildKevin/chroma-design"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Github className="size-3.5" />
            GitHub
          </a>
          <div className="my-2 h-px bg-border" />
          <Link
            href="/design"
            onClick={() => setOpen(false)}
            className="rounded-lg bg-foreground px-3 py-2.5 text-center text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Open app
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
