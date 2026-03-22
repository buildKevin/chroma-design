'use client'

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Minus, Plus, Shuffle, Link, Check } from 'lucide-react'
import { DesignHeader } from '@/components/design/header'
import { ColorPicker } from '@/components/design/color-picker'
import { PaletteDisplay } from '@/components/design/palette-display'
import { CodeOutput } from '@/components/design/code-output'
import { TypographyPicker, type FontConfig } from '@/components/design/typography-picker'
import { MotionPicker } from '@/components/design/motion-picker'
import { IconPicker } from '@/components/design/icon-picker'
import { generateTailwindPalette, getColorName, generateRandomColor } from '@/lib/color-utils'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { id: 'colors',     label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'motion',     label: 'Motion' },
  { id: 'icons',      label: 'Icons' },
] as const

const ALGORITHMS = [
  { value: 'tailwind',  label: 'Tailwind CSS' },
  { value: 'material',  label: 'Material' },
  { value: 'custom',    label: 'Custom' },
]

const NAMINGS = [
  { value: 'tailwind',  label: '50 – 950' },
  { value: 'numeric',   label: '100 – 1100' },
  { value: 'semantic',  label: 'Semantic' },
]

function DesignPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  // Read initial state from URL params (fallback to defaults)
  const [section, setSection]        = useState<'colors' | 'typography' | 'motion' | 'icons'>('colors')
  const [baseColor, setBaseColor]    = useState(() => {
    const c = searchParams.get('color')
    return c ? `#${c}` : '#6366f1'
  })
  const [algorithm, setAlgorithm]    = useState(() => searchParams.get('algo')    ?? 'tailwind')
  const [namingPattern, setNaming]   = useState(() => searchParams.get('naming')  ?? 'tailwind')
  const [contrastShift, setContrast] = useState(() => parseFloat(searchParams.get('contrast') ?? '0'))
  const [shadeCount, setShadeCount]  = useState(() => parseInt(searchParams.get('shades')   ?? '11'))
  const [fonts, setFonts]            = useState<FontConfig>(() => ({
    heading: searchParams.get('fh') ?? 'Inter',
    body:    searchParams.get('fb') ?? 'Inter',
  }))
  const [shuffling, setShuffling]    = useState(false)
  const [copied, setCopied]          = useState(false)

  // Sync state → URL (replaceState, no history entries)
  useEffect(() => {
    const p = new URLSearchParams({
      color:    baseColor.replace('#', ''),
      algo:     algorithm,
      naming:   namingPattern,
      contrast: contrastShift.toFixed(2),
      shades:   String(shadeCount),
      fh:       fonts.heading,
      fb:       fonts.body,
    })
    router.replace(`/design?${p.toString()}`, { scroll: false })
  }, [baseColor, algorithm, namingPattern, contrastShift, shadeCount, fonts, router])

  const shareUrl = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shuffle = useCallback(() => {
    setShuffling(true)
    setBaseColor(generateRandomColor())
    setTimeout(() => setShuffling(false), 300)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault()
        shuffle()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shuffle])

  const palette = useMemo(
    () => generateTailwindPalette(baseColor, shadeCount, contrastShift),
    [baseColor, shadeCount, contrastShift]
  )

  const colorName = useMemo(() => {
    const base = getColorName(baseColor)
    const map: Record<string, string> = {
      Pink: 'French Rose', Red: 'Crimson', Orange: 'Tangerine', Yellow: 'Gold',
      Green: 'Emerald', Cyan: 'Teal', Blue: 'Sapphire', Magenta: 'Orchid',
      Gray: 'Slate', White: 'Snow', Black: 'Obsidian',
    }
    return map[base] ?? base
  }, [baseColor])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DesignHeader />

      <main className="mx-auto max-w-5xl px-4 pt-20 pb-16 sm:px-6 sm:pt-24 sm:pb-24">

        {/* ── Color identity row ───────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'size-10 shrink-0 rounded-2xl shadow-md transition-all duration-300 sm:size-12',
                shuffling && 'scale-90'
              )}
              style={{
                backgroundColor: baseColor,
                boxShadow: `0 8px 24px ${baseColor}40`,
              }}
            />
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Base color</p>
              <div className="flex items-baseline gap-2">
                <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">{colorName}</h1>
                <span className="shrink-0 font-mono text-sm text-muted-foreground">{baseColor.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={shareUrl}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground sm:px-4"
            >
              {copied ? <Check className="size-3.5" /> : <Link className="size-3.5" />}
              <span className="hidden xs:inline">{copied ? 'Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={shuffle}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground sm:px-4"
            >
              <Shuffle className={cn('size-3.5', shuffling && 'animate-spin')} />
              Shuffle
              <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] sm:inline">Space</kbd>
            </button>
          </div>
        </div>

        {/* ── Section tabs ─────────────────────────────────────── */}
        <div className="-mx-4 mb-6 flex gap-0 overflow-x-auto border-b border-border px-4 sm:mx-0 sm:mb-8 sm:px-0">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={cn(
                'relative px-4 py-2.5 text-sm font-medium transition-colors',
                section === id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
              {section === id && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground" />
              )}
            </button>
          ))}
        </div>

        {/* ── Colors tab ───────────────────────────────────────── */}
        {section === 'colors' && (
          <div className="space-y-3 sm:space-y-4">

            {/* Controls */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 sm:gap-4 md:grid-cols-4">

              {/* Color picker */}
              <div className="rounded-2xl border border-border p-5">
                <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">Color</p>
                <ColorPicker color={baseColor} onChange={setBaseColor} />
              </div>

              {/* Algorithm + Naming */}
              <div className="rounded-2xl border border-border p-5">
                <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">Algorithm</p>
                <div className="flex flex-col gap-1">
                  {ALGORITHMS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setAlgorithm(value)}
                      className={cn(
                        'rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        algorithm === value
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Naming */}
              <div className="rounded-2xl border border-border p-5">
                <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">Naming</p>
                <div className="flex flex-col gap-1">
                  {NAMINGS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setNaming(value)}
                      className={cn(
                        'rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        namingPattern === value
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contrast + Shades */}
              <div className="rounded-2xl border border-border p-5 flex flex-col gap-6">
                {/* Contrast */}
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Contrast</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-2xl font-light tabular-nums">{contrastShift.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={-1}
                    max={1}
                    step={0.01}
                    value={contrastShift}
                    onChange={(e) => setContrast(parseFloat(e.target.value))}
                    className="w-full accent-foreground"
                  />
                </div>

                {/* Shades */}
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Shades</p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setShadeCount(c => Math.max(3, c - 1))}
                      disabled={shadeCount <= 3}
                      className="flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted disabled:opacity-30"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="font-mono text-2xl font-light tabular-nums">{shadeCount}</span>
                    <button
                      onClick={() => setShadeCount(c => Math.min(15, c + 1))}
                      disabled={shadeCount >= 15}
                      className="flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted disabled:opacity-30"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Palette */}
            <div className="rounded-2xl border border-border p-4 sm:p-6">
              <PaletteDisplay
                colorName={colorName}
                shades={palette}
                baseShadeIndex={Math.floor(shadeCount / 2)}
              />
            </div>

            {/* Code */}
            <div className="rounded-2xl border border-border overflow-hidden">
              <CodeOutput
                colorName={colorName}
                shades={palette}
                fonts={fonts}
                activeSection="colors"
              />
            </div>
          </div>
        )}

        {/* ── Motion tab ───────────────────────────────────────── */}
        {section === 'motion' && (
          <div className="rounded-2xl border border-border p-4 sm:p-6">
            <MotionPicker primaryColor={baseColor} />
          </div>
        )}

        {/* ── Icons tab ────────────────────────────────────────── */}
        {section === 'icons' && (
          <div className="rounded-2xl border border-border p-4 sm:p-6">
            <IconPicker primaryColor={baseColor} />
          </div>
        )}

        {/* ── Typography tab ───────────────────────────────────── */}
        {section === 'typography' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border p-4 sm:p-6">
              <TypographyPicker fonts={fonts} onChange={setFonts} primaryColor={baseColor} />
            </div>
            <div className="rounded-2xl border border-border overflow-hidden">
              <CodeOutput
                colorName={colorName}
                shades={palette}
                fonts={fonts}
                activeSection="typography"
              />
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default function DesignPageWrapper() {
  return (
    <Suspense>
      <DesignPage />
    </Suspense>
  )
}
