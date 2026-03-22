'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ColorShade } from '@/lib/color-utils'

interface PaletteDisplayProps {
  colorName: string
  shades: ColorShade[]
  baseShadeIndex?: number
}

export function PaletteDisplay({ colorName, shades, baseShadeIndex = 4 }: PaletteDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  const textColor = (l: number) => (l > 55 ? 'text-gray-900/80' : 'text-white/80')

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Palette</p>
          <h3 className="mt-0.5 text-lg font-semibold tracking-tight">{colorName}</h3>
        </div>
        <span className="text-xs text-muted-foreground">{shades.length} shades</span>
      </div>

      {/* Strip */}
      <div className="overflow-hidden rounded-2xl">
        <div className="flex">
          {shades.map((shade, i) => (
            <button
              key={shade.name}
              onClick={() => copy(shade.hex, i)}
              className={cn(
                'group relative flex-1 transition-all duration-200 hover:flex-[2]',
                i === baseShadeIndex && 'ring-2 ring-inset ring-white/25'
              )}
              style={{ backgroundColor: shade.hex }}
            >
              <div className="flex h-20 flex-col items-center justify-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                <span className={cn('text-[10px] font-medium', textColor(shade.hsl.l))}>{shade.name}</span>
                <span className={cn('font-mono text-[9px] uppercase', textColor(shade.hsl.l))}>{shade.hex}</span>
              </div>
              {copiedIndex === i && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Check className={cn('size-4', textColor(shade.hsl.l))} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-2 lg:grid-cols-11">
        {shades.map((shade, i) => (
          <button
            key={shade.name}
            onClick={() => copy(shade.hex, i)}
            className={cn(
              'group relative overflow-hidden rounded-xl border border-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
              i === baseShadeIndex && 'ring-2 ring-foreground/30 ring-offset-1'
            )}
          >
            <div className="aspect-square w-full" style={{ backgroundColor: shade.hex }} />
            <div className="flex flex-col items-center gap-0.5 p-1.5">
              <span className="text-[10px] font-medium">{shade.name}</span>
              <span className="font-mono text-[9px] text-muted-foreground">{shade.hex.toUpperCase()}</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              {copiedIndex === i
                ? <Check className="size-4 text-white" />
                : <Copy className="size-4 text-white" />
              }
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
