'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { hexToRgb, rgbToHex, rgbToHsl, type RGB } from '@/lib/color-utils'

interface SliderProps {
  value: number
  max?: number
  gradient: string
  label: string
  onChange: (value: number) => void
}

function ColorSlider({ value, max = 255, gradient, label, onChange }: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const pct = (value / max) * 100

  const resolve = useCallback((clientX: number) => {
    if (!trackRef.current) return
    const { left, width } = trackRef.current.getBoundingClientRect()
    onChange(Math.round(Math.max(0, Math.min((clientX - left) / width, 1)) * max))
  }, [onChange, max])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
    resolve(e.clientX)
    const move = (e: MouseEvent) => resolve(e.clientX)
    const up   = () => { setDragging(false); window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true)
    resolve(e.touches[0].clientX)
    const move = (e: TouchEvent) => resolve(e.touches[0].clientX)
    const end  = () => { setDragging(false); window.removeEventListener('touchmove', move); window.removeEventListener('touchend', end) }
    window.addEventListener('touchmove', move)
    window.addEventListener('touchend', end)
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
        <span className="font-mono text-[11px] tabular-nums">{value}</span>
      </div>

      {/*
        Wrapper has vertical padding so the thumb can overflow the track
        without being clipped — no overflow-hidden anywhere.
      */}
      <div
        ref={trackRef}
        className="relative cursor-pointer py-2.5"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {/* Track */}
        <div
          className="h-[6px] w-full rounded-full"
          style={{ background: gradient }}
        />

        {/* Thumb */}
        <div
          className="pointer-events-none absolute top-1/2 rounded-full bg-white"
          style={{
            width: 16,
            height: 16,
            left: `${pct}%`,
            transform: `translate(-50%, -50%) scale(${dragging ? 1.18 : 1})`,
            boxShadow: dragging
              ? '0 0 0 3px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.22)'
              : '0 0 0 1.5px rgba(0,0,0,0.10), 0 1px 5px rgba(0,0,0,0.18)',
            transition: dragging ? 'box-shadow 0.1s' : 'transform 0.15s, box-shadow 0.15s',
          }}
        />
      </div>
    </div>
  )
}

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const rgb = hexToRgb(color)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  const [hexInput, setHexInput] = useState(color.toUpperCase())
  useEffect(() => setHexInput(color.toUpperCase()), [color])

  const handleHex = (raw: string) => {
    const val = raw.startsWith('#') ? raw : `#${raw}`
    setHexInput(val.toUpperCase())
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) onChange(val)
  }

  const handleRgb = (ch: keyof RGB, v: number) =>
    onChange(rgbToHex({ ...rgb, [ch]: v }.r, { ...rgb, [ch]: v }.g, { ...rgb, [ch]: v }.b))

  return (
    <div className="space-y-4">
      {/* Swatch + hex input */}
      <div className="flex items-center gap-3">
        <label className="relative shrink-0 cursor-pointer">
          <div
            className="size-10 rounded-xl border border-black/[0.06] shadow-sm transition-transform hover:scale-105"
            style={{ backgroundColor: color }}
          />
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
        <input
          value={hexInput}
          onChange={(e) => handleHex(e.target.value)}
          onBlur={() => setHexInput(color.toUpperCase())}
          spellCheck={false}
          className="h-9 w-full rounded-lg border border-border bg-transparent px-3 font-mono text-sm outline-none transition-colors focus:border-foreground/40"
          placeholder="#6366F1"
        />
      </div>

      {/* HSL row */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: 'H', value: `${hsl.h}°` },
          { label: 'S', value: `${hsl.s}%` },
          { label: 'L', value: `${hsl.l}%` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg bg-muted/60 px-2 py-1.5 text-center">
            <p className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
            <p className="font-mono text-xs">{value}</p>
          </div>
        ))}
      </div>

      {/* Sliders */}
      <div className="space-y-1">
        <ColorSlider
          label="R"
          value={rgb.r}
          gradient={`linear-gradient(to right, rgb(0,${rgb.g},${rgb.b}), rgb(255,${rgb.g},${rgb.b}))`}
          onChange={(v) => handleRgb('r', v)}
        />
        <ColorSlider
          label="G"
          value={rgb.g}
          gradient={`linear-gradient(to right, rgb(${rgb.r},0,${rgb.b}), rgb(${rgb.r},255,${rgb.b}))`}
          onChange={(v) => handleRgb('g', v)}
        />
        <ColorSlider
          label="B"
          value={rgb.b}
          gradient={`linear-gradient(to right, rgb(${rgb.r},${rgb.g},0), rgb(${rgb.r},${rgb.g},255))`}
          onChange={(v) => handleRgb('b', v)}
        />
      </div>
    </div>
  )
}
