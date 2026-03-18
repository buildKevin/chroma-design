'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

/* ─────────────────────────────────────────────────────────
   1. PALETTE — bars grow one by one with a glow beam
───────────────────────────────────────────────────────── */
const PALETTES = [
  { name: 'Violet',  shades: ['#f5f3ff','#ddd6fe','#a78bfa','#7c3aed','#5b21b6','#4c1d95','#2e1065'] },
  { name: 'Rose',    shades: ['#fff1f2','#fecdd3','#fb7185','#f43f5e','#e11d48','#9f1239','#4c0519'] },
  { name: 'Emerald', shades: ['#ecfdf5','#a7f3d0','#6ee7b7','#34d399','#059669','#065f46','#022c22'] },
  { name: 'Amber',   shades: ['#fffbeb','#fde68a','#fcd34d','#fbbf24','#d97706','#92400e','#451a03'] },
]
const BAR_H = [30, 46, 58, 72, 58, 44, 28]

function PaletteIllustration() {
  const [pi, setPi] = useState(0)
  const [vis, setVis] = useState(Array(7).fill(false) as boolean[])
  const [glowAt, setGlowAt] = useState(-1)

  useEffect(() => {
    let cancel = false
    const cycle = (idx: number) => {
      if (cancel) return
      setVis(Array(7).fill(false))
      setGlowAt(-1)
      for (let i = 0; i < 7; i++) {
        setTimeout(() => {
          if (cancel) return
          setGlowAt(i)
          setVis(p => { const n = [...p]; n[i] = true; return n })
          setTimeout(() => { if (!cancel) setGlowAt(-1) }, 150)
        }, 180 + i * 130)
      }
      setTimeout(() => {
        if (cancel) return
        setVis(Array(7).fill(false))
        setTimeout(() => {
          if (cancel) return
          const next = (idx + 1) % PALETTES.length
          setPi(next)
          cycle(next)
        }, 420)
      }, 180 + 7 * 130 + 2200)
    }
    cycle(0)
    return () => { cancel = true }
  }, [])

  const p = PALETTES[pi]
  return (
    <div className="flex h-full flex-col justify-end gap-2 pb-2">
      <span className="px-1 text-[10px] font-medium text-muted-foreground transition-opacity duration-300">{p.name}</span>
      <div className="flex items-end gap-1 px-1">
        {p.shades.map((color, i) => (
          <div
            key={i}
            className="flex-1 rounded-md"
            style={{
              height: BAR_H[i],
              backgroundColor: color,
              opacity: vis[i] ? 1 : 0,
              transform: `scaleY(${vis[i] ? 1 : 0})`,
              transformOrigin: 'bottom',
              transition: 'opacity 0.22s ease, transform 0.22s ease',
              boxShadow: glowAt === i ? `0 -6px 18px ${color}cc` : 'none',
            }}
          />
        ))}
      </div>
      <div className="flex gap-1 px-1">
        {p.shades.map((color, i) => (
          <div
            key={i}
            className="h-0.5 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: color, opacity: vis[i] ? 0.5 : 0 }}
          />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   2. EXPLORE — orb morphs + spacebar physically presses
───────────────────────────────────────────────────────── */
const ORBS = [
  { hex: '#6366f1', name: 'Indigo' },
  { hex: '#ec4899', name: 'Rose' },
  { hex: '#f59e0b', name: 'Amber' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#3b82f6', name: 'Blue' },
  { hex: '#8b5cf6', name: 'Violet' },
]

function ExploreIllustration() {
  const [idx, setIdx] = useState(0)
  const [pressing, setPressing] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const iv = setInterval(() => {
      setPressing(true)
      setTimeout(() => {
        setPressing(false)
        setFading(true)
        setTimeout(() => {
          setIdx(i => (i + 1) % ORBS.length)
          setFading(false)
        }, 190)
      }, 180)
    }, 2100)
    return () => clearInterval(iv)
  }, [])

  const orb = ORBS[idx]
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center">
        {/* Diffuse glow */}
        <div
          className="absolute rounded-2xl transition-all duration-700"
          style={{
            inset: '-10px',
            backgroundColor: orb.hex,
            opacity: fading ? 0 : 0.18,
            filter: 'blur(14px)',
          }}
        />
        {/* Orb */}
        <div
          className="relative size-14 rounded-2xl transition-all duration-250"
          style={{
            backgroundColor: orb.hex,
            opacity: fading ? 0 : 1,
            transform: fading ? 'scale(0.88)' : 'scale(1)',
            boxShadow: `0 10px 36px ${orb.hex}55`,
          }}
        />
      </div>
      <div
        className="text-center transition-all duration-200"
        style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(4px)' : 'translateY(0)' }}
      >
        <p className="text-xs font-medium">{orb.name}</p>
        <p className="font-mono text-[10px] text-muted-foreground">{orb.hex}</p>
      </div>
      {/* Physical key press */}
      <div
        className="flex select-none items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-[10px] font-medium text-muted-foreground transition-all duration-150"
        style={{
          transform: pressing ? 'translateY(2px)' : 'translateY(0)',
          boxShadow: pressing ? 'none' : '0 2px 0 0 hsl(var(--border))',
        }}
      >
        Space
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   3. TYPOGRAPHY — "Aa" crossfades between font styles
───────────────────────────────────────────────────────── */
const TYPEFACES = [
  { name: 'Inter',             family: 'system-ui, sans-serif',    cat: 'Sans-serif' },
  { name: 'Playfair Display',  family: 'Georgia, serif',           cat: 'Serif' },
  { name: 'Space Mono',        family: '"Courier New", monospace', cat: 'Monospace' },
  { name: 'DM Sans',           family: 'system-ui, sans-serif',    cat: 'Sans-serif' },
  { name: 'Libre Baskerville', family: 'Georgia, serif',           cat: 'Serif' },
]

function TypographyIllustration() {
  const [idx, setIdx] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const iv = setInterval(() => {
      setShow(false)
      setTimeout(() => { setIdx(i => (i + 1) % TYPEFACES.length); setShow(true) }, 270)
    }, 2400)
    return () => clearInterval(iv)
  }, [])

  const tf = TYPEFACES[idx]
  return (
    <div className="flex h-full flex-col justify-center gap-2 px-2">
      <div
        className="transition-all duration-280"
        style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(10px)' }}
      >
        <div className="mb-2 flex items-center gap-1.5">
          <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            {tf.cat}
          </span>
          <span className="text-[10px] text-foreground/70">{tf.name}</span>
        </div>
        <p
          className="text-4xl font-bold leading-none"
          style={{ fontFamily: tf.family, letterSpacing: tf.cat === 'Serif' ? '-0.01em' : '-0.03em' }}
        >
          Aa
        </p>
        <p
          className="mt-2 text-xs leading-relaxed text-muted-foreground"
          style={{ fontFamily: tf.family }}
        >
          The quick brown fox jumps
        </p>
      </div>
      <div className="mt-1 space-y-1.5">
        {[{ w: 'w-4/5' }, { w: 'w-3/5' }, { w: 'w-2/3' }].map((b, i) => (
          <div key={i} className={`${b.w} h-1.5 rounded-full bg-muted-foreground/15`} />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   4. CODE — tabs slide, lines appear, cursor blinks
───────────────────────────────────────────────────────── */
const TABS = ['CSS', 'Tailwind', 'Tokens']
const CODES = [
  [
    { k: '--violet-50:',  v: ' #f5f3ff' },
    { k: '--violet-500:', v: ' #8b5cf6' },
    { k: '--violet-900:', v: ' #4c1d95' },
  ],
  [
    { k: 'violet: {',   v: '' },
    { k: "  500:",      v: " '#8b5cf6'" },
    { k: '}',           v: '' },
  ],
  [
    { k: '"name":',       v: ' "violet"' },
    { k: '"500":',        v: ' "#8b5cf6"' },
    { k: '"type":',       v: ' "color"' },
  ],
]

function CodeIllustration() {
  const [tab, setTab] = useState(0)
  const [lineVis, setLineVis] = useState([false, false, false])
  const [blink, setBlink] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    let cancel = false
    const reveal = () => {
      setLineVis([false, false, false])
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          if (cancel) return
          setLineVis(p => { const n = [...p]; n[i] = true; return n })
        }, 200 + i * 280)
      }
    }
    reveal()
    const iv = setInterval(() => {
      if (cancel) return
      setFading(true)
      setTimeout(() => {
        if (cancel) return
        setTab(t => (t + 1) % TABS.length)
        setFading(false)
        reveal()
      }, 230)
    }, 3000)
    const blinkIv = setInterval(() => setBlink(b => !b), 520)
    return () => { cancel = true; clearInterval(iv); clearInterval(blinkIv) }
  }, [])

  const currentLines = lineVis.filter(Boolean).length
  return (
    <div className="flex h-full flex-col gap-0">
      {/* Tab bar */}
      <div className="relative flex border-b border-border">
        {TABS.map((t, i) => (
          <div
            key={t}
            className="relative px-3 py-1.5 text-[10px] font-medium transition-colors duration-200"
            style={{ color: tab === i ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
          >
            {t}
            {tab === i && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground transition-all duration-300" />
            )}
          </div>
        ))}
      </div>
      {/* Code body */}
      <div
        className="flex-1 rounded-b-lg p-3 font-mono text-[10px] leading-[1.7] transition-opacity duration-200"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <p className="text-muted-foreground">:root {'{'}</p>
        {CODES[tab].map(({ k, v }, i) => (
          <p
            key={i}
            className="ml-3 transition-all duration-250"
            style={{
              opacity: lineVis[i] ? 1 : 0,
              transform: lineVis[i] ? 'translateX(0)' : 'translateX(-8px)',
            }}
          >
            <span className="text-muted-foreground">{k}</span>
            <span className="text-foreground">{v}</span>
            {i === currentLines - 1 && (
              <span
                className="ml-px inline-block h-[11px] w-[1.5px] translate-y-[1px] bg-foreground/70"
                style={{ opacity: blink ? 1 : 0, transition: 'opacity 0.1s' }}
              />
            )}
          </p>
        ))}
        <p className="text-muted-foreground">{'}'}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   5. FIGMA — swatches paste onto a Figma-like canvas
───────────────────────────────────────────────────────── */
const FIGMA_PALETTES = [
  ['#f5f3ff','#ddd6fe','#a78bfa','#7c3aed','#5b21b6','#4c1d95'],
  ['#fff1f2','#fecdd3','#fb7185','#f43f5e','#be123c','#881337'],
  ['#ecfdf5','#a7f3d0','#34d399','#059669','#065f46','#022c22'],
  ['#fffbeb','#fde68a','#fcd34d','#d97706','#92400e','#451a03'],
]

function FigmaIllustration() {
  const [pi, setPi]           = useState(0)
  const [vis, setVis]         = useState<boolean[]>([])
  const [pressing, setPressing] = useState(false)
  const [pasting, setPasting] = useState(false)

  useEffect(() => {
    let cancel = false

    const run = (idx: number) => {
      if (cancel) return
      setVis([])
      setPasting(false)

      // press Ctrl+V key
      setTimeout(() => { if (!cancel) setPressing(true) }, 300)
      setTimeout(() => { if (!cancel) { setPressing(false); setPasting(true) } }, 600)

      // swatches pop in one by one
      const palette = FIGMA_PALETTES[idx]
      palette.forEach((_, i) => {
        setTimeout(() => {
          if (cancel) return
          setVis(p => {
            const n = [...p]
            n[i] = true
            return n
          })
        }, 700 + i * 160)
      })

      // pause then reset
      setTimeout(() => {
        if (cancel) return
        setVis([])
        setPasting(false)
        setTimeout(() => {
          if (cancel) return
          const next = (idx + 1) % FIGMA_PALETTES.length
          setPi(next)
          run(next)
        }, 400)
      }, 700 + FIGMA_PALETTES[idx].length * 160 + 2000)
    }

    run(0)
    return () => { cancel = true }
  }, [])

  const palette = FIGMA_PALETTES[pi]

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      {/* Mini Figma canvas */}
      <div
        className="relative flex items-end gap-1.5 rounded-xl px-4 pt-3 pb-4"
        style={{ backgroundColor: '#1e1e1e', minWidth: 160 }}
      >
        {/* Figma-like selection border when pasting */}
        {pasting && (
          <div
            className="pointer-events-none absolute inset-1 rounded-lg transition-opacity duration-200"
            style={{ border: '1px solid #0d99ff', opacity: vis.length > 0 ? 0 : 0.7 }}
          />
        )}
        {palette.map((color, i) => {
          const isVis = vis[i] === true
          return (
            <div
              key={i}
              className="flex flex-col items-center gap-1"
              style={{
                opacity: isVis ? 1 : 0,
                transform: isVis ? 'scale(1) translateY(0)' : 'scale(0.6) translateY(6px)',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
            >
              <div
                className="rounded-md"
                style={{ width: 20, height: 28, backgroundColor: color }}
              />
              <div
                className="rounded-sm"
                style={{ width: 16, height: 3, backgroundColor: '#3a3a3a' }}
              />
            </div>
          )
        })}
      </div>

      {/* Ctrl+V key */}
      <div
        className="flex select-none items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-[10px] font-medium text-muted-foreground transition-all duration-150"
        style={{
          transform: pressing ? 'translateY(2px)' : 'translateY(0)',
          boxShadow: pressing ? 'none' : '0 2px 0 0 hsl(var(--border))',
        }}
      >
        <span className="opacity-60">⌘</span> V
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   6. COPY — cursor slides across swatches, flashes ✓
───────────────────────────────────────────────────────── */
const SWATCH_STRIP = ['#eef2ff','#c7d2fe','#818cf8','#6366f1','#4338ca','#3730a3','#1e1b4b']

function CopyIllustration() {
  const [active, setActive] = useState(0)
  const [showCheck, setShowCheck] = useState(false)

  useEffect(() => {
    const iv = setInterval(() => {
      setShowCheck(true)
      setTimeout(() => {
        setShowCheck(false)
        setActive(a => (a + 1) % SWATCH_STRIP.length)
      }, 700)
    }, 1300)
    return () => clearInterval(iv)
  }, [])

  const isDark = active >= 4

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      {/* Strip */}
      <div className="flex overflow-hidden rounded-xl border border-border">
        {SWATCH_STRIP.map((color, i) => (
          <div
            key={i}
            className="relative h-10 w-9 transition-all duration-300"
            style={{
              backgroundColor: color,
              transform: active === i ? 'scaleY(1.18)' : 'scaleY(1)',
              transformOrigin: 'center',
            }}
          >
            {active === i && (
              <div
                className="absolute inset-0 flex items-center justify-center transition-all duration-200"
                style={{ opacity: showCheck ? 1 : 0, transform: showCheck ? 'scale(1)' : 'scale(0.6)' }}
              >
                <Check
                  className="size-3 drop-shadow"
                  style={{ color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(30,27,75,0.85)' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info pill */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 shadow-sm transition-all duration-200">
        <div
          className="size-3 rounded-sm transition-colors duration-300"
          style={{ backgroundColor: SWATCH_STRIP[active] }}
        />
        <span className="font-mono text-xs transition-all duration-200">{SWATCH_STRIP[active].toUpperCase()}</span>
        <div
          className="flex size-5 items-center justify-center rounded transition-all duration-200"
          style={{ backgroundColor: showCheck ? `${SWATCH_STRIP[active]}25` : 'transparent' }}
        >
          {showCheck
            ? <Check className="size-3" style={{ color: SWATCH_STRIP[active] }} />
            : <Copy className="size-3 text-muted-foreground" />
          }
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Section wrapper
───────────────────────────────────────────────────────── */
const FEATURES = [
  { title: 'Smart palette generation', desc: 'Tailwind, Material, or custom algorithms. Perceptually balanced shades from any base color.',   Illustration: PaletteIllustration },
  { title: 'Explore instantly',        desc: 'Hit spacebar for a random vibrant color. Adjust contrast shift and shade count on the fly.',      Illustration: ExploreIllustration },
  { title: 'Typography system',        desc: 'Pair heading and body fonts from a curated Google Fonts selection with a live preview.',           Illustration: TypographyIllustration },
  { title: 'Multi-format export',      desc: 'CSS custom properties, Tailwind v3/v4 config, or JSON design tokens — ready to paste.',           Illustration: CodeIllustration },
  { title: 'Export to Figma',           desc: 'Copy your palette as an SVG, paste directly in Figma — color cards appear instantly on the canvas.', Illustration: FigmaIllustration },
  { title: 'Copy in one click',        desc: 'Click any shade to copy its hex value. Export the full palette with a single button.',            Illustration: CopyIllustration },
]

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="features" className="mx-auto max-w-5xl px-6 py-32">
      <div className="mb-16">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Features</p>
        <h2 className="text-3xl font-semibold tracking-tight">Everything you need</h2>
      </div>

      <div ref={ref} className="grid gap-4 md:grid-cols-3">
        {FEATURES.map(({ title, desc, Illustration }, i) => (
          <div
            key={title}
            className="group overflow-hidden rounded-2xl border border-border transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(28px)',
              transition: `opacity 0.55s ease ${i * 85}ms, transform 0.55s ease ${i * 85}ms, box-shadow 0.2s, border-color 0.2s, translate 0.2s`,
            }}
          >
            <div className="h-44 overflow-hidden bg-muted/30 px-4 pt-4">
              <Illustration />
            </div>
            <div className="p-5">
              <h3 className="mb-1.5 text-sm font-medium">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
