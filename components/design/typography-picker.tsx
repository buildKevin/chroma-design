'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface FontConfig {
  heading: string
  body: string
}

interface TypographyPickerProps {
  fonts: FontConfig
  onChange: (fonts: FontConfig) => void
  primaryColor: string
}

const GOOGLE_FONTS = [
  { name: 'Inter', category: 'sans-serif' },
  { name: 'Geist', category: 'sans-serif' },
  { name: 'Poppins', category: 'sans-serif' },
  { name: 'Plus Jakarta Sans', category: 'sans-serif' },
  { name: 'DM Sans', category: 'sans-serif' },
  { name: 'Outfit', category: 'sans-serif' },
  { name: 'Space Grotesk', category: 'sans-serif' },
  { name: 'Manrope', category: 'sans-serif' },
  { name: 'Sora', category: 'sans-serif' },
  { name: 'Satoshi', category: 'sans-serif' },
  { name: 'Playfair Display', category: 'serif' },
  { name: 'Lora', category: 'serif' },
  { name: 'Merriweather', category: 'serif' },
  { name: 'Libre Baskerville', category: 'serif' },
  { name: 'Source Serif Pro', category: 'serif' },
  { name: 'JetBrains Mono', category: 'monospace' },
  { name: 'Fira Code', category: 'monospace' },
  { name: 'IBM Plex Mono', category: 'monospace' },
]

// Load Google Font dynamically
function loadGoogleFont(fontName: string) {
  const fontId = `google-font-${fontName.replace(/ /g, '-')}`
  if (document.getElementById(fontId)) return

  const link = document.createElement('link')
  link.id = fontId
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`
  document.head.appendChild(link)
}

export function TypographyPicker({
  fonts,
  onChange,
  primaryColor,
}: TypographyPickerProps) {
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light')

  // Load fonts when they change
  useEffect(() => {
    loadGoogleFont(fonts.heading)
    loadGoogleFont(fonts.body)
  }, [fonts.heading, fonts.body])

  // Preload all fonts on mount
  useEffect(() => {
    GOOGLE_FONTS.forEach((font) => loadGoogleFont(font.name))
  }, [])

  const getFontFamily = (fontName: string) => {
    const font = GOOGLE_FONTS.find((f) => f.name === fontName)
    return `"${fontName}", ${font?.category || 'sans-serif'}`
  }

  return (
    <div className="space-y-6">
      {/* Font Selectors */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Heading Font
          </label>
          <Select
            value={fonts.heading}
            onValueChange={(v) => onChange({ ...fonts, heading: v })}
          >
            <SelectTrigger className="w-full bg-muted/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {GOOGLE_FONTS.map((font) => (
                <SelectItem key={font.name} value={font.name}>
                  <span style={{ fontFamily: getFontFamily(font.name) }}>
                    {font.name}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {font.category}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Body Font
          </label>
          <Select
            value={fonts.body}
            onValueChange={(v) => onChange({ ...fonts, body: v })}
          >
            <SelectTrigger className="w-full bg-muted/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {GOOGLE_FONTS.map((font) => (
                <SelectItem key={font.name} value={font.name}>
                  <span style={{ fontFamily: getFontFamily(font.name) }}>
                    {font.name}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {font.category}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Preview Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Preview
        </span>
        <div className="flex items-center gap-1 rounded-full bg-muted/50 p-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 gap-1.5 rounded-full px-3 text-xs',
              previewMode === 'light' && 'bg-background shadow-sm'
            )}
            onClick={() => setPreviewMode('light')}
          >
            <Sun className="size-3.5" />
            Light
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 gap-1.5 rounded-full px-3 text-xs',
              previewMode === 'dark' && 'bg-background shadow-sm'
            )}
            onClick={() => setPreviewMode('dark')}
          >
            <Moon className="size-3.5" />
            Dark
          </Button>
        </div>
      </div>

      {/* Preview Card */}
      <div
        className={cn(
          'overflow-hidden rounded-xl border transition-colors',
          previewMode === 'dark'
            ? 'border-neutral-800 bg-neutral-950'
            : 'border-neutral-200 bg-white'
        )}
      >
        {/* Header Preview */}
        <div
          className={cn(
            'border-b px-6 py-4',
            previewMode === 'dark'
              ? 'border-neutral-800'
              : 'border-neutral-100'
          )}
        >
          <div className="flex items-center justify-between">
            <h3
              className={cn(
                'text-lg font-semibold',
                previewMode === 'dark' ? 'text-white' : 'text-neutral-900'
              )}
              style={{ fontFamily: getFontFamily(fonts.heading) }}
            >
              Your Brand
            </h3>
            <div className="flex gap-4">
              {['Home', 'About', 'Contact'].map((item) => (
                <span
                  key={item}
                  className={cn(
                    'text-sm',
                    previewMode === 'dark'
                      ? 'text-neutral-400'
                      : 'text-neutral-600'
                  )}
                  style={{ fontFamily: getFontFamily(fonts.body) }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-6">
          <h1
            className={cn(
              'mb-3 text-3xl font-bold tracking-tight',
              previewMode === 'dark' ? 'text-white' : 'text-neutral-900'
            )}
            style={{ fontFamily: getFontFamily(fonts.heading) }}
          >
            Build something amazing
          </h1>
          <p
            className={cn(
              'mb-4 text-base leading-relaxed',
              previewMode === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            )}
            style={{ fontFamily: getFontFamily(fonts.body) }}
          >
            Create beautiful, accessible designs with a consistent type system.
            Your brand deserves typography that speaks volumes.
          </p>
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
              style={{
                backgroundColor: primaryColor,
                fontFamily: getFontFamily(fonts.body),
              }}
            >
              Get Started
            </button>
            <button
              className={cn(
                'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                previewMode === 'dark'
                  ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                  : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              )}
              style={{ fontFamily: getFontFamily(fonts.body) }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Type Scale Preview */}
        <div
          className={cn(
            'border-t px-6 py-4',
            previewMode === 'dark' ? 'border-neutral-800' : 'border-neutral-100'
          )}
        >
          <div className="space-y-2">
            {[
              { label: 'Display', size: 'text-4xl', weight: 'font-bold' },
              { label: 'H1', size: 'text-2xl', weight: 'font-semibold' },
              { label: 'H2', size: 'text-xl', weight: 'font-semibold' },
              { label: 'Body', size: 'text-base', weight: 'font-normal' },
              { label: 'Small', size: 'text-sm', weight: 'font-normal' },
            ].map((item) => (
              <div key={item.label} className="flex items-baseline gap-4">
                <span
                  className={cn(
                    'w-16 text-xs uppercase tracking-wide',
                    previewMode === 'dark'
                      ? 'text-neutral-500'
                      : 'text-neutral-400'
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    item.size,
                    item.weight,
                    previewMode === 'dark' ? 'text-white' : 'text-neutral-900'
                  )}
                  style={{
                    fontFamily: getFontFamily(
                      item.label === 'Body' || item.label === 'Small'
                        ? fonts.body
                        : fonts.heading
                    ),
                  }}
                >
                  {item.label === 'Body' || item.label === 'Small'
                    ? 'The quick brown fox jumps'
                    : fonts.heading}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateTypographyCSS(fonts: FontConfig): string {
  const headingFont = GOOGLE_FONTS.find((f) => f.name === fonts.heading)
  const bodyFont = GOOGLE_FONTS.find((f) => f.name === fonts.body)

  return `/* Typography - Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=${fonts.heading.replace(/ /g, '+')}:wght@400;500;600;700&family=${fonts.body.replace(/ /g, '+')}:wght@400;500;600&display=swap');

:root {
  --font-heading: "${fonts.heading}", ${headingFont?.category || 'sans-serif'};
  --font-body: "${fonts.body}", ${bodyFont?.category || 'sans-serif'};
}

/* Usage */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

body, p, span, a {
  font-family: var(--font-body);
}
`
}

export function generateTypographyTailwind(fonts: FontConfig): string {
  const headingFont = GOOGLE_FONTS.find((f) => f.name === fonts.heading)
  const bodyFont = GOOGLE_FONTS.find((f) => f.name === fonts.body)

  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        heading: ['"${fonts.heading}"', '${headingFont?.category || 'sans-serif'}'],
        body: ['"${fonts.body}"', '${bodyFont?.category || 'sans-serif'}'],
      },
    },
  },
}`
}

export function generateTypographyTailwind4(fonts: FontConfig): string {
  const headingFont = GOOGLE_FONTS.find((f) => f.name === fonts.heading)
  const bodyFont = GOOGLE_FONTS.find((f) => f.name === fonts.body)

  return `/* globals.css - Tailwind CSS v4 */
@import url('https://fonts.googleapis.com/css2?family=${fonts.heading.replace(/ /g, '+')}:wght@400;500;600;700&family=${fonts.body.replace(/ /g, '+')}:wght@400;500;600&display=swap');

@theme inline {
  --font-heading: "${fonts.heading}", ${headingFont?.category || 'sans-serif'};
  --font-body: "${fonts.body}", ${bodyFont?.category || 'sans-serif'};
}

/* Usage: font-heading, font-body */`
}
