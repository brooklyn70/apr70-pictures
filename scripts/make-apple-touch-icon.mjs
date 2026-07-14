// Render the amber APR 70 favicon SVG to a 180x180 PNG (the Apple touch icon).
// iOS ignores SVG touch icons, so the mark ships as a PNG built from the same
// source of truth. Run from anywhere: node scripts/make-apple-touch-icon.mjs
// Output lands in cms/media/; the media row + Site Settings selection live in
// Payload (mediaKind=favicon).
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const { chromium } = await import(path.join(ROOT, 'cms/node_modules/@playwright/test/index.mjs'))

const svg = readFileSync(path.join(ROOT, 'cms/media/apr70_favicon_amber_bg_black_text_bold.svg'), 'utf8')
const out = path.join(ROOT, 'cms/media/apr70_apple_touch_icon.png')
const html = `<!doctype html><html><head><style>*{margin:0;padding:0}svg{display:block;width:180px;height:180px}</style></head><body>${svg}</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(300)
await page.screenshot({ path: out })
await browser.close()
console.log('wrote', out)
