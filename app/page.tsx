import Link from 'next/link'
import { ArrowRight, Code2, Github } from 'lucide-react'
import { FeaturesSection } from '@/components/landing/features-section'
import { ChangelogModal } from '@/components/design/changelog-modal'
import { ThemeToggle } from '@/components/design/theme-toggle'
import { LandingMobileMenu } from '@/components/landing/mobile-menu'

const palette = [
  '#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc',
  '#818cf8', '#6366f1', '#4f46e5', '#4338ca',
  '#3730a3', '#312e81', '#1e1b4b',
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="text-sm font-semibold tracking-tight">Chroma</span>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#export" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Export
            </a>
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
            <Link
              href="/design"
              className="rounded-md bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
            >
              Open app
            </Link>
          </nav>

          {/* Mobile nav */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <LandingMobileMenu />
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 sm:pt-36">
          <div className="flex flex-col items-start gap-6 sm:gap-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-foreground/30" />
              Design systems, simplified
            </div>

            <h1 className="max-w-2xl text-3xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
              Generate color palettes
              <br />
              <span className="text-muted-foreground">ready to ship.</span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              Pick a color, get a full design-system-grade palette with proper contrast ratios —
              exported as CSS variables, Tailwind config, or design tokens.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/design"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                Start generating
                <ArrowRight className="size-3.5" />
              </Link>
              <span className="text-xs text-muted-foreground">Free · No sign-up</span>
            </div>
          </div>

          {/* App preview mockup */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-border shadow-sm sm:mt-20">
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-3">
              <span className="size-2.5 rounded-full bg-foreground/10" />
              <span className="size-2.5 rounded-full bg-foreground/10" />
              <span className="size-2.5 rounded-full bg-foreground/10" />
              <span className="ml-4 rounded bg-background px-3 py-0.5 text-xs text-muted-foreground">
                chroma.design/design
              </span>
            </div>

            <div className="grid grid-cols-1 gap-0 md:grid-cols-[280px_1fr]">
              {/* Left sidebar */}
              <div className="hidden border-r border-border p-6 md:block">
                <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Base color
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl shadow" style={{ backgroundColor: '#6366f1' }} />
                  <div>
                    <p className="text-sm font-medium">Indigo</p>
                    <p className="font-mono text-xs text-muted-foreground">#6366F1</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { label: 'Algorithm', value: 'Tailwind CSS' },
                    { label: 'Shades', value: '11' },
                    { label: 'Contrast', value: '0.00' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="rounded border border-border bg-muted px-2 py-0.5 text-xs">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Palette display */}
              <div className="p-6">
                <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Generated palette
                </p>
                <div className="flex gap-1 overflow-hidden rounded-xl">
                  {palette.map((color, i) => (
                    <div
                      key={i}
                      className="h-14 flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="mt-3 hidden gap-1 sm:flex">
                  {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].map((shade, i) => (
                    <div key={shade} className="flex-1 text-center font-mono text-[10px] text-muted-foreground">
                      {shade}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features — animated client component */}
        <FeaturesSection />

        {/* Export formats */}
        <section id="export" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-32">
          <div className="grid items-start gap-16 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Export
              </p>
              <h2 className="mb-4 text-3xl font-semibold tracking-tight">
                Ship-ready code,
                <br />
                <span className="text-muted-foreground">your format.</span>
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                Whether you're building with vanilla CSS, Tailwind v3, Tailwind v4, or
                a design token pipeline — Chroma outputs exactly what you need.
              </p>
              <div className="flex flex-wrap gap-2">
                {['CSS Variables', 'Tailwind v3', 'Tailwind v4', 'Design Tokens', 'HEX', 'OKLCH', 'HSL', 'RGBA'].map((tag) => (
                  <span key={tag} className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Code snippet */}
            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <Code2 className="size-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">CSS Variables</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-xs leading-7">
                <span className="text-muted-foreground">:root {'{'}</span>{'\n'}
                {'  '}<span className="text-muted-foreground">--indigo-50: </span><span> #eef2ff</span>{';\n'}
                {'  '}<span className="text-muted-foreground">--indigo-100:</span><span> #e0e7ff</span>{';\n'}
                {'  '}<span className="text-muted-foreground">--indigo-200:</span><span> #c7d2fe</span>{';\n'}
                {'  '}<span className="text-muted-foreground">--indigo-500:</span><span> #6366f1</span>{';\n'}
                {'  '}<span className="text-muted-foreground">--indigo-900:</span><span> #312e81</span>{';\n'}
                <span className="text-muted-foreground">{'}'}</span>
              </pre>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-32">
          <div className="rounded-2xl border border-border p-8 text-center sm:p-16">
            <h2 className="mb-4 text-3xl font-semibold tracking-tight">
              Start building your palette
            </h2>
            <p className="mb-8 text-sm text-muted-foreground">
              No account needed. Open the tool and start generating in seconds.
            </p>
            <Link
              href="/design"
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
            >
              Open Chroma
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="text-sm font-semibold">Chroma</span>
          <p className="text-xs text-muted-foreground">Design system generator</p>
        </div>
      </footer>
    </div>
  )
}
