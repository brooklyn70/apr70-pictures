#!/usr/bin/env node
// Generates the placeholder SVG set under web/public/brand/placeholders/.
// Run from web/: `node scripts/gen-placeholders.mjs`
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/brand/placeholders')
mkdirSync(OUT, { recursive: true })

// Brand tokens — kept in sync with web/src/styles/tokens.css.
const TINTS = {
  default: { bg: '#16181C', fg: '#8A8F98', accent: '#C8C8C8' },
  '212':   { bg: '#1A0F05', fg: '#C68A4A', accent: '#E85D04' },
  '310':   { bg: '#021923', fg: '#3FA3B8', accent: '#0077B6' },
  nrc:     { bg: '#00111F', fg: '#7B92AD', accent: '#001F3F' },
}

// Display ratios -> nominal canvas size (viewBox). 1200px on the long edge.
const ASPECTS = {
  '16x9': { w: 1200, h: 675 },
  '4x3':  { w: 1200, h: 900 },
  '1x1':  { w: 1000, h: 1000 },
  '9x16': { w: 675,  h: 1200 },
}

const PERF_BAND = 28        // height of the perforation strip
const PERF_SPACING = 56     // px between hole centers
const PERF_R = 8            // perforation hole radius

function perforationStrip(width, y, tint) {
  const holes = []
  for (let cx = PERF_SPACING / 2; cx < width; cx += PERF_SPACING) {
    holes.push(`<circle cx="${cx.toFixed(1)}" cy="${(y + PERF_BAND / 2).toFixed(1)}" r="${PERF_R}" fill="${tint.bg}"/>`)
  }
  return `<rect x="0" y="${y}" width="${width}" height="${PERF_BAND}" fill="${tint.accent}" opacity="0.85"/>${holes.join('')}`
}

function svg({ aspect, division }) {
  const { w, h } = ASPECTS[aspect]
  const tint = TINTS[division]
  const label = `APR70 / ${division.toUpperCase()} / ${aspect.replace('x', ':')}`
  const cx = w / 2
  const cy = h / 2
  // Type sizes scale with the short edge so labels read at any container size.
  const short = Math.min(w, h)
  const fsLabel = Math.round(short * 0.038)
  const fsMark = Math.round(short * 0.11)
  const ruleY1 = cy - fsMark * 0.55
  const ruleY2 = cy + fsMark * 0.55
  const ruleHalf = short * 0.18

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label} placeholder" preserveAspectRatio="xMidYMid slice">
  <rect width="${w}" height="${h}" fill="${tint.bg}"/>
  ${perforationStrip(w, 0, tint)}
  ${perforationStrip(w, h - PERF_BAND, tint)}
  <g font-family="'Share Tech Mono', ui-monospace, SFMono-Regular, Menlo, monospace" fill="${tint.fg}" text-anchor="middle">
    <line x1="${(cx - ruleHalf).toFixed(1)}" y1="${ruleY1.toFixed(1)}" x2="${(cx + ruleHalf).toFixed(1)}" y2="${ruleY1.toFixed(1)}" stroke="${tint.fg}" stroke-width="1" opacity="0.4"/>
    <text x="${cx}" y="${(cy + fsMark * 0.05).toFixed(1)}" font-size="${fsMark}" font-weight="400" letter-spacing="6" fill="${tint.accent}">APR70</text>
    <line x1="${(cx - ruleHalf).toFixed(1)}" y1="${ruleY2.toFixed(1)}" x2="${(cx + ruleHalf).toFixed(1)}" y2="${ruleY2.toFixed(1)}" stroke="${tint.fg}" stroke-width="1" opacity="0.4"/>
    <text x="${cx}" y="${(cy + fsMark * 1.2).toFixed(1)}" font-size="${fsLabel}" letter-spacing="3" opacity="0.75">${division.toUpperCase()} · ${aspect.replace('x', ':')}</text>
    <text x="${cx}" y="${(cy + fsMark * 1.7).toFixed(1)}" font-size="${Math.round(fsLabel * 0.7)}" letter-spacing="2" opacity="0.5">PLACEHOLDER</text>
  </g>
</svg>`
}

let count = 0
for (const aspect of Object.keys(ASPECTS)) {
  for (const division of Object.keys(TINTS)) {
    const filename = `placeholder-${aspect}-${division}.svg`
    writeFileSync(resolve(OUT, filename), svg({ aspect, division }))
    count++
  }
}
console.log(`Wrote ${count} placeholder SVGs to ${OUT}`)
