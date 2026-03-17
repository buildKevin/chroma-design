// Color utility functions for generating palettes

// Generate a random vibrant color
export function generateRandomColor(): string {
  // Use HSL to ensure vibrant colors
  const h = Math.floor(Math.random() * 360)
  const s = 60 + Math.floor(Math.random() * 30) // 60-90% saturation
  const l = 45 + Math.floor(Math.random() * 20) // 45-65% lightness
  const rgb = hslToRgb(h, s, l)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360
  s /= 100
  l /= 100

  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

export interface ColorShade {
  name: string
  hex: string
  rgb: RGB
  hsl: HSL
}

// Generate Tailwind-style color palette
export function generateTailwindPalette(
  baseHex: string,
  shadeCount: number = 11,
  contrastShift: number = 0
): ColorShade[] {
  const rgb = hexToRgb(baseHex)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  // Tailwind naming pattern
  const tailwindNames = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
  
  // Generate shades based on count
  const shades: ColorShade[] = []
  const usedNames = tailwindNames.slice(0, shadeCount)

  for (let i = 0; i < shadeCount; i++) {
    // Calculate lightness - from light (95%) to dark (5%)
    const progress = i / (shadeCount - 1)
    let lightness = 97 - progress * 92 // Range from 97% to 5%
    
    // Apply contrast shift
    lightness = lightness + contrastShift * (0.5 - progress) * 20
    lightness = Math.max(5, Math.min(97, lightness))

    // Slightly adjust saturation for extremes
    let saturation = hsl.s
    if (lightness > 90) {
      saturation = Math.max(10, saturation * 0.6)
    } else if (lightness < 15) {
      saturation = Math.max(10, saturation * 0.7)
    }

    const newRgb = hslToRgb(hsl.h, saturation, lightness)
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b)

    shades.push({
      name: usedNames[i] || String((i + 1) * 100),
      hex: newHex.toUpperCase(),
      rgb: newRgb,
      hsl: newHsl,
    })
  }

  return shades
}

// Get color name from hex (simplified version)
export function getColorName(hex: string): string {
  const rgb = hexToRgb(hex)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  
  const { h, s, l } = hsl

  if (s < 10) {
    if (l < 20) return 'Black'
    if (l > 80) return 'White'
    return 'Gray'
  }

  if (h < 15 || h >= 345) return 'Red'
  if (h < 45) return 'Orange'
  if (h < 70) return 'Yellow'
  if (h < 150) return 'Green'
  if (h < 210) return 'Cyan'
  if (h < 270) return 'Blue'
  if (h < 330) return 'Magenta'
  return 'Pink'
}

// Generate CSS output
export function generateCSS(colorName: string, shades: ColorShade[]): string {
  const lines = shades.map(
    (shade) => `  --${colorName.toLowerCase()}-${shade.name}: ${shade.hex};`
  )
  return `:root {\n${lines.join('\n')}\n}`
}

// Generate Tailwind config output
export function generateTailwindConfig(colorName: string, shades: ColorShade[]): string {
  const colors = shades
    .map((shade) => `      '${shade.name}': '${shade.hex}',`)
    .join('\n')
  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        '${colorName.toLowerCase()}': {
${colors}
        },
      },
    },
  },
}`
}

// Generate design tokens output
export function generateTokens(colorName: string, shades: ColorShade[]): string {
  const tokens = shades.reduce((acc, shade) => {
    acc[`${colorName.toLowerCase()}-${shade.name}`] = {
      value: shade.hex,
      type: 'color',
    }
    return acc
  }, {} as Record<string, { value: string; type: string }>)
  return JSON.stringify({ color: tokens }, null, 2)
}
