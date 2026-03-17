# Kigen - Design System Generator

## Project Overview

Kigen is a SaaS application for generating complete design systems with colors, variables, and styles. Users can create custom color palettes, typography systems, and export code snippets.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS 4.2.0
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Project Structure

```
saas-design/
├── app/
│   ├── design/
│   │   └── page.tsx           # Main design generator page
│   ├── layout.tsx              # Root layout with fonts
│   ├── page.tsx                # Redirects to /design
│   └── globals.css             # Global styles + CSS variables (OKLCH)
├── components/
│   ├── design/
│   │   ├── header.tsx          # App header with navigation
│   │   ├── color-picker.tsx    # Color selection component
│   │   ├── palette-display.tsx # Visual palette display
│   │   ├── code-output.tsx     # Code export (CSS, Tailwind, Tokens)
│   │   └── typography-picker.tsx # Font selection & preview
│   ├── ui/                     # shadcn/ui components
│   └── theme-provider.tsx      # Theme/dark mode provider
├── lib/
│   ├── color-utils.ts          # Color generation & conversion utilities
│   └── utils.ts                # General utilities (cn helper)
├── public/                     # Static assets
├── components.json              # shadcn/ui configuration
├── next.config.mjs             # Next.js config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

## Key Features

### Color System
- **Base Color Picker**: Choose a starting color
- **Palette Generation**: Auto-generate 3-15 shades
- **Algorithms**: Tailwind CSS, Material Design, Custom
- **Naming Patterns**: Tailwind (50-950), Numeric (100-1100), Semantic
- **Contrast Shift**: Adjust lightness distribution
- **Random Color**: Spacebar shortcut for quick generation

### Typography
- **Font Selection**: Separate heading and body fonts
- **Preview**: Live typography preview with selected colors

### Export Formats
- CSS Custom Properties
- Tailwind Config
- Design Tokens (JSON)

## Important Patterns

### Color Utilities (lib/color-utils.ts)
- `generateTailwindPalette()`: Create shade palettes from base color
- `generateRandomColor()`: Generate vibrant random colors
- `hexToRgb()`, `rgbToHsl()`, etc.: Color space conversions
- `getColorName()`: Detect color category from hue

### Styling with OKLCH
The app uses OKLCH color space for CSS variables (defined in globals.css):
```css
--primary: oklch(0.65 0.2 350);
```

### Component Conventions
- Client components marked with `'use client'`
- Use `cn()` utility from `@/lib/utils` for conditional classes
- shadcn/ui components in `@/components/ui`

## Running the Project

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Page Routes

| Route | Description |
|-------|-------------|
| `/` | Redirects to `/design` |
| `/design` | Main design generator interface |

## Configuration Notes

- TypeScript build errors are ignored in next.config.mjs
- Images are unoptimized (static hosting compatible)
- Path aliases: `@/*` maps to root directory

## UI Components Available

All shadcn/ui components are installed:
- Button, Slider, Select, Tabs
- Dialog, Dropdown Menu, Popover, Toast
- Accordion, Checkbox, Switch, Radio Group
- And many more...
