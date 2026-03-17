# Chroma — Design System Generator

Generate production-ready color palettes and typography systems in seconds. Export as CSS variables, Tailwind config, or design tokens.

![Chroma](public/placeholder.svg)

## Features

- **Color palette generation** — Pick a base color and get a full perceptually balanced palette using Tailwind CSS, Material Design, or custom algorithms
- **Multiple naming patterns** — Tailwind (50–950), numeric (100–1100), or semantic (lightest–darkest)
- **Contrast shift** — Fine-tune lightness distribution across the palette
- **Typography system** — Pair heading and body fonts from 18 curated Google Fonts with a live preview
- **Multi-format export** — CSS custom properties, Tailwind v3 config, Tailwind v4 `@theme`, or JSON design tokens
- **Color formats** — Export in HEX, RGBA, HSL, or OKLCH
- **Spacebar shortcut** — Hit `Space` to instantly generate a random vibrant color
- **WCAG contrast checks** — AA and AAA compliance indicators built in
- **Copy in one click** — Click any shade to copy its hex value

## Tech Stack

- **Framework** — [Next.js](https://nextjs.org/) 16 (App Router)
- **Language** — TypeScript 5
- **Styling** — [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Components** — [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **Icons** — [Lucide React](https://lucide.dev/)
- **Package Manager** — pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
git clone https://github.com/buildKevin/chroma-design.git
cd chroma-design
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
chroma-design/
├── app/
│   ├── design/
│   │   └── page.tsx           # Design tool page
│   ├── layout.tsx
│   ├── page.tsx               # Landing page
│   └── globals.css
├── components/
│   ├── design/
│   │   ├── header.tsx
│   │   ├── color-picker.tsx
│   │   ├── palette-display.tsx
│   │   ├── code-output.tsx
│   │   └── typography-picker.tsx
│   ├── landing/
│   │   └── features-section.tsx
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── color-utils.ts         # Palette generation & color conversions
│   └── utils.ts
└── public/
```

## Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/design` | Design tool |

## Color System

Palettes are generated using the OKLCH color space for perceptual uniformity. The `generateTailwindPalette` function creates shades by adjusting lightness while preserving chroma and hue.

```ts
import { generateTailwindPalette } from '@/lib/color-utils'

const palette = generateTailwindPalette('#6366f1', 11, 0)
// Returns 11 shades from lightest to darkest
```

## Export Formats

**CSS Variables**
```css
:root {
  --indigo-50: #eef2ff;
  --indigo-500: #6366f1;
  --indigo-900: #312e81;
}
```

**Tailwind v4**
```css
@theme {
  --color-indigo-50: #eef2ff;
  --color-indigo-500: #6366f1;
  --color-indigo-900: #312e81;
}
```

**Design Tokens (JSON)**
```json
{
  "indigo": {
    "50":  { "value": "#eef2ff", "type": "color" },
    "500": { "value": "#6366f1", "type": "color" },
    "900": { "value": "#312e81", "type": "color" }
  }
}
```

## License

MIT
