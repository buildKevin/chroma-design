'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  generateCSS,
  generateTailwindConfig,
  generateTokens,
  generateFigmaSwatchSVG,
  type ColorShade,
} from '@/lib/color-utils'
import {
  generateTypographyCSS,
  generateTypographyTailwind,
  generateTypographyTailwind4,
  type FontConfig,
} from './typography-picker'

interface CodeOutputProps {
  colorName: string
  shades: ColorShade[]
  fonts?: FontConfig
  activeSection?: 'colors' | 'typography'
}

type ColorFormat = 'HEX' | 'RGBA' | 'HSL' | 'OKLCH'

const FORMAT_TABS = ['css', 'tailwind', 'tailwind4', 'tokens'] as const
const FORMAT_TABS_COLORS = ['css', 'tailwind', 'tailwind4', 'tokens', 'figma'] as const
const FORMAT_LABELS: Record<string, string> = {
  css: 'CSS',
  tailwind: 'Tailwind',
  tailwind4: 'Tailwind 4',
  tokens: 'Tokens',
  figma: 'Figma',
}

export function CodeOutput({
  colorName,
  shades,
  fonts = { heading: 'Inter', body: 'Inter' },
  activeSection = 'colors',
}: CodeOutputProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('css')
  const [colorFormat, setColorFormat] = useState<ColorFormat>('HEX')

  const getCode = () => {
    if (activeSection === 'typography') {
      switch (activeTab) {
        case 'css':      return generateTypographyCSS(fonts)
        case 'tailwind': return generateTypographyTailwind(fonts)
        case 'tailwind4':return generateTypographyTailwind4(fonts)
        case 'tokens':   return `{\n  "typography": {\n    "fontFamily": {\n      "heading": "${fonts.heading}",\n      "body": "${fonts.body}"\n    }\n  }\n}`
        default:         return ''
      }
    }
    switch (activeTab) {
      case 'css':      return generateCSS(colorName, shades)
      case 'tailwind': return generateTailwindConfig(colorName, shades)
      case 'tailwind4':return `/* Tailwind CSS v4 */\n@theme {\n${shades.map((s) => `  --color-${colorName.toLowerCase()}-${s.name}: ${s.hex};`).join('\n')}\n}`
      case 'tokens':   return generateTokens(colorName, shades)
      case 'figma':    return generateFigmaSwatchSVG(colorName, shades)
      default:         return ''
    }
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(getCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-0">
      {/* Tab bar */}
      <div className="flex flex-col gap-0 border-b border-border sm:flex-row sm:items-center sm:justify-between">
        <div className="flex overflow-x-auto">
          {(activeSection === 'colors' ? FORMAT_TABS_COLORS : FORMAT_TABS).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'relative shrink-0 px-3 py-2.5 text-xs font-medium transition-colors sm:px-4',
                activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {FORMAT_LABELS[tab]}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-border px-2 py-1.5 sm:border-t-0 sm:pr-1">
          {activeSection === 'colors' && (
            <div className="flex gap-0.5">
              {(['HEX', 'RGBA', 'HSL', 'OKLCH'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setColorFormat(fmt)}
                  className={cn(
                    'rounded-md px-2 py-1 text-[10px] font-medium transition-colors',
                    colorFormat === fmt
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {fmt}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={copyCode}
            className="ml-auto flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code block / Figma preview */}
      {activeTab === 'figma' ? (
        <div className="rounded-b-2xl bg-muted/30 p-6 space-y-3">
          <div className="overflow-x-auto rounded-xl border border-border bg-white p-4">
            <div dangerouslySetInnerHTML={{ __html: generateFigmaSwatchSVG(colorName, shades) }} />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Click <span className="font-medium text-foreground">Copy</span>, ouvre Figma, puis <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">Ctrl+V</kbd> — les swatches apparaissent directement sur le canvas.
          </p>
        </div>
      ) : (
        <pre className="max-h-60 overflow-auto rounded-b-2xl bg-muted/30 p-5 font-mono text-xs leading-6 text-foreground/80">
          <code>{getCode()}</code>
        </pre>
      )}
    </div>
  )
}
