'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Spring physics ─────────────────────────────────────────────── */
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

function settleFrame(frames: number[], threshold = 0.003): number {
  for (let i = frames.length - 1; i > 10; i--) {
    if (Math.abs(frames[i] - 1) > threshold) return Math.min(i + 8, frames.length - 1)
  }
  return 30
}

function toKeyframesCSS(name: string, frames: number[], distance = 200): string {
  const end = settleFrame(frames)
  const sampled = frames.slice(0, end + 1).filter((_, i) => i % 3 === 0)
  sampled.push(frames[end] ?? 1)
  const lines = sampled.map((v, i) => {
    const pct = ((i / (sampled.length - 1)) * 100).toFixed(1)
    return `  ${pct}% { transform: translateX(${(v * distance).toFixed(1)}px); }`
  })
  return `@keyframes ${name} {\n${lines.join('\n')}\n}`
}

function toCubicBezier(stiffness: number, damping: number): string {
  const overshoot = Math.max(0, 1 - damping / 40) * 1.4
  const y1 = parseFloat((1 + overshoot).toFixed(3))
  const x1 = parseFloat((0.22 + (1 - stiffness / 400) * 0.2).toFixed(3))
  return `cubic-bezier(${x1}, ${y1}, 0.58, 1)`
}

/* ── Constants ──────────────────────────────────────────────────── */
const SIZE = 200

const PRESETS = [
  { name: 'Snappy',  x: 0.10, y: 0.30 },
  { name: 'Spring',  x: 0.28, y: 0.18 },
  { name: 'Bouncy',  x: 0.32, y: 0.04 },
  { name: 'Smooth',  x: 0.62, y: 0.78 },
  { name: 'Elastic', x: 0.20, y: 0.02 },
  { name: 'Gentle',  x: 0.80, y: 0.88 },
]

function paramsFromXY(nx: number, ny: number) {
  const stiffness = Math.round(400 - nx * 370)
  const damping   = Math.round(8   + ny * 52)
  const duration  = Math.round(150 + nx * 1250)
  return { stiffness, damping, duration }
}

const CODE_TABS = ['CSS', 'Transition', 'Tailwind'] as const
type CodeTab = (typeof CODE_TABS)[number]

function buildCode(tab: CodeTab, stiffness: number, damping: number, duration: number, frames: number[]) {
  if (tab === 'CSS') {
    return toKeyframesCSS('spring', frames) +
      `\n\n.element {\n  animation: spring ${duration}ms linear forwards;\n}`
  }
  const cb = toCubicBezier(stiffness, damping)
  if (tab === 'Transition') {
    return `.element {\n  transition: transform ${duration}ms ${cb};\n}`
  }
  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      transitionTimingFunction: {\n        spring: '${cb}',\n      },\n      transitionDuration: {\n        spring: '${duration}ms',\n      },\n    },\n  },\n}\n\n// Usage\n// className="transition-[transform] duration-spring ease-spring"`
}

/* ── Component ──────────────────────────────────────────────────── */
interface MotionPickerProps {
  primaryColor?: string
}

export function MotionPicker({ primaryColor = '#6366f1' }: MotionPickerProps) {
  const canvasRef  = useRef<SVGSVGElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const [pos, setPos]             = useState({ x: 0.28, y: 0.18 })
  const [dragging, setDragging]   = useState(false)
  const [activeTab, setActiveTab] = useState<CodeTab>('CSS')
  const [copied, setCopied]       = useState(false)
  const [playing, setPlaying]     = useState(true)

  const { stiffness, damping, duration } = paramsFromXY(pos.x, pos.y)
  const frames = simulateSpring(stiffness, damping)
  const code   = buildCode(activeTab, stiffness, damping, duration, frames)

  /* ── rAF preview ────────────────────────────────────────────────  */
  useEffect(() => {
    const el = previewRef.current
    if (!el || !playing) {
      if (el) el.style.transform = 'translateX(0px)'
      return
    }

    let raf: number
    let cancelled = false
    const DIST = 120

    const run = () => {
      if (cancelled) return
      let i = 0
      const end = settleFrame(frames) + 4
      const tick = () => {
        if (cancelled) return
        if (i > end) {
          el.style.transform = `translateX(${DIST}px)`
          setTimeout(() => {
            if (!cancelled) {
              el.style.transform = 'translateX(0px)'
              setTimeout(() => { if (!cancelled) run() }, 60)
            }
          }, 800)
          return
        }
        el.style.transform = `translateX(${(frames[i] ?? 1) * DIST}px)`
        i++
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    run()
    return () => { cancelled = true; cancelAnimationFrame(raf) }
  }, [stiffness, damping, playing])

  /* ── Canvas drag ────────────────────────────────────────────────  */
  const getNorm = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0.5, y: 0.5 }
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top)  / rect.height)),
    }
  }, [])

  const onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault()
    setDragging(true)
    setPos(getNorm(e.clientX, e.clientY))
    const move = (e: MouseEvent) => setPos(getNorm(e.clientX, e.clientY))
    const up   = () => { setDragging(false); window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  /* ── Curve ──────────────────────────────────────────────────────  */
  const end    = settleFrame(frames)
  const CW = SIZE
  const CH = 80
  const PAD = 10
  const vMin   = Math.min(0, ...frames.slice(0, end + 1))
  const vMax   = Math.max(1.05, ...frames.slice(0, end + 1))
  const vRange = vMax - vMin
  const toX    = (i: number) => (i / end) * CW
  const toY    = (v: number) => PAD + (1 - (v - vMin) / vRange) * (CH - PAD * 2)
  const curvePoints = frames.slice(0, end + 1).map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')
  const targetY = toY(1)

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">

      {/* ── Top row: canvas + right panel ───────────────────────── */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">

        {/* 2D Canvas */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/20">
          {/* Axis labels */}
          <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-between px-3">
            <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground/40">Fast</span>
            <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground/40">Slow</span>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-2 flex flex-col justify-between py-8">
            <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground/40">Bouncy</span>
            <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground/40">Smooth</span>
          </div>

          <svg
            ref={canvasRef}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="block w-full cursor-crosshair touch-none select-none"
            style={{ aspectRatio: '1' }}
            onMouseDown={onMouseDown}
          >
            {/* Grid */}
            {[0.25, 0.5, 0.75].map((t) => (
              <g key={t}>
                <line x1={t * SIZE} y1={0} x2={t * SIZE} y2={SIZE} stroke="currentColor" strokeOpacity={0.06} strokeWidth={1} />
                <line x1={0} y1={t * SIZE} x2={SIZE} y2={t * SIZE} stroke="currentColor" strokeOpacity={0.06} strokeWidth={1} />
              </g>
            ))}
            {/* Crosshair */}
            <line x1={pos.x * SIZE} y1={0} x2={pos.x * SIZE} y2={SIZE} stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} strokeDasharray="3 3" />
            <line x1={0} y1={pos.y * SIZE} x2={SIZE} y2={pos.y * SIZE} stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} strokeDasharray="3 3" />
            {/* Preset dots */}
            {PRESETS.map((p) => (
              <circle key={p.name} cx={p.x * SIZE} cy={p.y * SIZE} r={3} fill="currentColor" fillOpacity={0.15} />
            ))}
            {/* Handle */}
            <circle cx={pos.x * SIZE} cy={pos.y * SIZE} r={dragging ? 11 : 9} fill={primaryColor} opacity={0.15} style={{ transition: 'r 0.1s' }} />
            <circle cx={pos.x * SIZE} cy={pos.y * SIZE} r={dragging ? 7 : 6} fill={primaryColor} style={{ transition: 'r 0.1s' }} />
            <circle cx={pos.x * SIZE} cy={pos.y * SIZE} r={2.5} fill="white" opacity={0.8} />
          </svg>
        </div>

        {/* Right: presets + curve + preview */}
        <div className="flex flex-col gap-3">

          {/* Presets */}
          <div className="flex flex-wrap gap-1.5">
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

          {/* Curve */}
          <div className="overflow-hidden rounded-2xl border border-border bg-muted/20 px-3 pb-2 pt-3">
            <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full overflow-visible">
              <line x1={0} y1={toY(0)} x2={CW} y2={toY(0)} stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
              <line x1={0} y1={targetY} x2={CW} y2={targetY} stroke={primaryColor} strokeOpacity={0.3} strokeWidth={1} strokeDasharray="4 3" />
              <polyline
                points={`0,${toY(0)} ${curvePoints} ${toX(end)},${toY(0)}`}
                fill={primaryColor} fillOpacity={0.07} stroke="none"
              />
              <polyline
                points={curvePoints}
                fill="none"
                stroke={primaryColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx={toX(end)} cy={toY(frames[end] ?? 1)} r={2.5} fill={primaryColor} />
            </svg>
            <div className="mt-0.5 flex justify-between">
              <span className="text-[9px] text-muted-foreground/40">0ms</span>
              <span className="text-[9px] text-muted-foreground/40">{duration}ms</span>
            </div>
          </div>

          {/* Preview */}
          <div className="relative flex flex-1 items-center rounded-2xl border border-border bg-muted/20 px-4" style={{ minHeight: 80 }}>
            <div ref={previewRef} className="size-8 rounded-xl" style={{ backgroundColor: primaryColor }} />
            <button
              onClick={() => setPlaying(p => !p)}
              className="absolute bottom-2.5 right-3 text-[10px] font-medium text-muted-foreground hover:text-foreground"
            >
              {playing ? 'Pause' : 'Play'}
            </button>
          </div>

        </div>
      </div>

      {/* ── Code ────────────────────────────────────────────────── */}
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
                {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground" />}
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
