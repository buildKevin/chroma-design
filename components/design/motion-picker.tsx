'use client'

import { useState, useRef, useCallback, useEffect, useId } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Spring physics ─────────────────────────────────────────────────
   Simulates a damped harmonic oscillator from 0 → 1.
   Returns position samples at 60fps.
──────────────────────────────────────────────────────────────────── */
function simulateSpring(stiffness: number, damping: number, frames = 120): number[] {
  const dt = 1 / 60
  let pos = 0, vel = 0
  const out: number[] = [0]
  for (let i = 1; i < frames; i++) {
    const acc = -stiffness * (pos - 1) - damping * vel
    vel += acc * dt
    pos += vel * dt
    out.push(pos)
  }
  return out
}

// Find the frame where the spring has settled within threshold
function settleFrame(frames: number[], threshold = 0.003): number {
  for (let i = frames.length - 1; i > 10; i--) {
    if (Math.abs(frames[i] - 1) > threshold) return Math.min(i + 8, frames.length - 1)
  }
  return 30
}

// Generate CSS @keyframes string from spring frames
function toKeyframesCSS(name: string, frames: number[], distance = 200): string {
  const end = settleFrame(frames)
  const sampled = frames.slice(0, end + 1).filter((_, i, a) => i % 3 === 0 || i === a.length - 1)
  const lines = sampled.map((v, i) => {
    const pct = ((i / (sampled.length - 1)) * 100).toFixed(1)
    return `  ${pct}% { transform: translateX(${(v * distance).toFixed(2)}px); }`
  })
  lines.push(`  100% { transform: translateX(${distance}px); }`)
  return `@keyframes ${name} {\n${lines.join('\n')}\n}`
}

// Approximate cubic-bezier for CSS transition (good enough for low bounce)
function toCubicBezier(stiffness: number, damping: number): string {
  const overshoot = Math.max(0, 1 - damping / 40) * 1.4
  const y1 = parseFloat((1 + overshoot).toFixed(3))
  const x1 = parseFloat((0.22 + (1 - stiffness / 400) * 0.2).toFixed(3))
  return `cubic-bezier(${x1}, ${y1}, 0.58, 1)`
}

/* ── Canvas dimensions ──────────────────────────────────────────── */
const SIZE = 200

/* ── Presets ────────────────────────────────────────────────────── */
const PRESETS = [
  { name: 'Snappy',   x: 0.10, y: 0.30 },
  { name: 'Spring',   x: 0.28, y: 0.18 },
  { name: 'Bouncy',   x: 0.32, y: 0.04 },
  { name: 'Smooth',   x: 0.62, y: 0.78 },
  { name: 'Elastic',  x: 0.20, y: 0.02 },
  { name: 'Gentle',   x: 0.80, y: 0.88 },
]

/* ── Param mapping ──────────────────────────────────────────────── */
// x ∈ [0,1]: left = fast/stiff, right = slow/relaxed
// y ∈ [0,1]: top = bouncy (low damping), bottom = smooth (high damping)
function paramsFromXY(nx: number, ny: number) {
  const stiffness = Math.round(400 - nx * 370)        // 400 → 30
  const damping   = Math.round(8   + ny * 52)          // 8  → 60
  const duration  = Math.round(150 + nx * 1250)        // 150ms → 1400ms
  return { stiffness, damping, duration }
}

/* ── Code tabs ──────────────────────────────────────────────────── */
const CODE_TABS = ['CSS', 'Transition', 'Tailwind'] as const
type CodeTab = (typeof CODE_TABS)[number]

function buildCode(tab: CodeTab, stiffness: number, damping: number, duration: number, frames: number[]) {
  if (tab === 'CSS') {
    return (
      toKeyframesCSS('spring', frames) +
      `\n\n.element {\n  animation: spring ${duration}ms linear forwards;\n}`
    )
  }
  if (tab === 'Transition') {
    const cb = toCubicBezier(stiffness, damping)
    return `.element {\n  transition: transform ${duration}ms ${cb};\n}`
  }
  // Tailwind
  const cb = toCubicBezier(stiffness, damping)
  return (
    `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      transitionTimingFunction: {\n        spring: '${cb}',\n      },\n      transitionDuration: {\n        spring: '${duration}ms',\n      },\n    },\n  },\n}\n\n// Usage\n// <div className="transition-[transform] duration-spring ease-spring" />`
  )
}

/* ── Component ──────────────────────────────────────────────────── */
export function MotionPicker() {
  const uid        = useId().replace(/:/g, '')
  const canvasRef  = useRef<SVGSVGElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const styleRef   = useRef<HTMLStyleElement | null>(null)

  const [pos, setPos]          = useState({ x: 0.28, y: 0.18 }) // normalised 0-1
  const [dragging, setDragging]= useState(false)
  const [activeTab, setActiveTab] = useState<CodeTab>('CSS')
  const [copied, setCopied]    = useState(false)
  const [playing, setPlaying]  = useState(true)

  const { stiffness, damping, duration } = paramsFromXY(pos.x, pos.y)
  const frames = simulateSpring(stiffness, damping)
  const code   = buildCode(activeTab, stiffness, damping, duration, frames)

  /* ── Inject + restart preview animation ───────────────────────── */
  useEffect(() => {
    if (!previewRef.current) return

    const animName = `spring_${uid}`
    const css = toKeyframesCSS(animName, frames, 160)

    if (!styleRef.current) {
      styleRef.current = document.createElement('style')
      document.head.appendChild(styleRef.current)
    }
    styleRef.current.textContent = css

    const el = previewRef.current
    el.style.animation = 'none'
    void el.offsetWidth // force reflow
    if (playing) {
      el.style.animation = `${animName} ${duration}ms linear infinite alternate`
    }
  }, [stiffness, damping, duration, playing, uid])

  useEffect(() => () => { styleRef.current?.remove() }, [])

  /* ── Canvas drag ───────────────────────────────────────────────── */
  const getNorm = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return pos
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left)  / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top)   / rect.height)),
    }
  }, [pos])

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    setPos(getNorm(e.clientX, e.clientY))
  }
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return
    setPos(getNorm(e.clientX, e.clientY))
  }
  const onPointerUp = () => setDragging(false)

  /* ── Curve path (position over time) ──────────────────────────── */
  const end = settleFrame(frames)
  const curvePoints = frames.slice(0, end + 1).map((v, i) => {
    const px = (i / end) * SIZE
    const py = SIZE - v * SIZE * 0.7 - SIZE * 0.1
    return `${px.toFixed(1)},${py.toFixed(1)}`
  }).join(' ')

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">

      {/* ── Presets ─────────────────────────────────────────────── */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const active = Math.abs(pos.x - p.x) < 0.03 && Math.abs(pos.y - p.y) < 0.03
            return (
              <button
                key={p.name}
                onClick={() => setPos({ x: p.x, y: p.y })}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                )}
              >
                {p.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Main controls ───────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* 2D Canvas */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Control</p>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/20">
            {/* Axis labels */}
            <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-between px-3">
              <span className="text-[9px] font-medium text-muted-foreground/50">FAST</span>
              <span className="text-[9px] font-medium text-muted-foreground/50">SLOW</span>
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-2 flex flex-col justify-between py-6">
              <span className="text-[9px] font-medium text-muted-foreground/50">BOUNCY</span>
              <span className="text-[9px] font-medium text-muted-foreground/50">SMOOTH</span>
            </div>

            <svg
              ref={canvasRef}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="block w-full cursor-crosshair touch-none select-none"
              style={{ aspectRatio: '1' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              {/* Grid */}
              {[0.25, 0.5, 0.75].map((t) => (
                <g key={t}>
                  <line x1={t * SIZE} y1={0} x2={t * SIZE} y2={SIZE}
                    stroke="currentColor" strokeOpacity={0.06} strokeWidth={1} />
                  <line x1={0} y1={t * SIZE} x2={SIZE} y2={t * SIZE}
                    stroke="currentColor" strokeOpacity={0.06} strokeWidth={1} />
                </g>
              ))}

              {/* Crosshair lines from point to axes */}
              <line x1={pos.x * SIZE} y1={0} x2={pos.x * SIZE} y2={SIZE}
                stroke="currentColor" strokeOpacity={0.12} strokeWidth={1} strokeDasharray="3 3" />
              <line x1={0} y1={pos.y * SIZE} x2={SIZE} y2={pos.y * SIZE}
                stroke="currentColor" strokeOpacity={0.12} strokeWidth={1} strokeDasharray="3 3" />

              {/* Preset dots */}
              {PRESETS.map((p) => (
                <circle key={p.name}
                  cx={p.x * SIZE} cy={p.y * SIZE} r={3}
                  fill="currentColor" fillOpacity={0.18}
                />
              ))}

              {/* Draggable point */}
              <circle
                cx={pos.x * SIZE}
                cy={pos.y * SIZE}
                r={dragging ? 10 : 8}
                fill="hsl(var(--foreground))"
                style={{ transition: dragging ? 'none' : 'r 0.15s' }}
              />
              <circle
                cx={pos.x * SIZE}
                cy={pos.y * SIZE}
                r={dragging ? 4 : 3}
                fill="hsl(var(--background))"
                style={{ transition: dragging ? 'none' : 'r 0.15s' }}
              />
            </svg>
          </div>

          {/* Values */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: 'Stiffness', value: stiffness },
              { label: 'Damping',   value: damping },
              { label: 'Duration',  value: `${duration}ms` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-muted/60 px-2 py-1.5 text-center">
                <p className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
                <p className="font-mono text-xs">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Curve preview + live preview */}
        <div className="flex flex-col gap-4">

          {/* Spring curve */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">Curve</p>
            <div className="overflow-hidden rounded-2xl border border-border bg-muted/20 p-3">
              <svg viewBox={`0 0 ${SIZE} ${SIZE * 0.55}`} className="w-full">
                {/* Axes */}
                <line x1={0} y1={SIZE * 0.55 - 1} x2={SIZE} y2={SIZE * 0.55 - 1}
                  stroke="currentColor" strokeOpacity={0.12} strokeWidth={1} />
                {/* y = 1 line */}
                <line x1={0} y1={SIZE * 0.55 - SIZE * 0.7 - SIZE * 0.1}
                  x2={SIZE} y2={SIZE * 0.55 - SIZE * 0.7 - SIZE * 0.1}
                  stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} strokeDasharray="4 3" />
                {/* Curve */}
                <polyline
                  points={curvePoints}
                  fill="none"
                  stroke="hsl(var(--foreground))"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.85}
                />
              </svg>
              <div className="mt-1 flex justify-between px-0.5">
                <span className="text-[9px] text-muted-foreground/50">0ms</span>
                <span className="text-[9px] text-muted-foreground/50">{duration}ms</span>
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Preview</p>
              <button
                onClick={() => setPlaying(p => !p)}
                className="text-[10px] font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                {playing ? 'Pause' : 'Play'}
              </button>
            </div>
            <div className="flex h-16 items-center overflow-hidden rounded-2xl border border-border bg-muted/20 px-4">
              <div
                ref={previewRef}
                className="size-7 rounded-lg bg-foreground"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── Code output ─────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-border">
        <div className="flex items-center justify-between border-b border-border">
          <div className="flex">
            {CODE_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'relative px-4 py-2.5 text-xs font-medium transition-colors',
                  activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground" />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={copyCode}
            className="mr-1 flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="max-h-56 overflow-auto bg-muted/30 p-5 font-mono text-xs leading-6 text-foreground/80">
          <code>{code}</code>
        </pre>
      </div>

    </div>
  )
}
