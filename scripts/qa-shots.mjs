// v12 before/after screenshot rig — 1440px, both themes, ELEMENT shots.
// usage: node shoot.mjs <label>
import { chromium } from '/Users/marco/websites/apr70-website/v10/cms/node_modules/@playwright/test/index.mjs'
import { mkdirSync } from 'node:fs'

const label = process.argv[2] || 'before'
const OUT = '/Users/marco/Desktop/screens/v12'
mkdirSync(OUT, { recursive: true })

const targets = [
  { name: 'filmstrip-movement', url: 'http://localhost:4321/work/the-movement',
    el: 'section.v9-section[aria-label^="Development frames"]' },
  { name: 'filmstrip-movement-map', url: 'http://localhost:4321/work/the-movement',
    el: 'section.v9-section[aria-label^="Development frames"]',
    prep: async (p) => { await p.locator('.fs__btn[aria-label="Next frame"]').click({ timeout: 5000 }); await p.waitForTimeout(900) } },
  { name: 'filmstrip-ldv', url: 'http://localhost:4321/work/la-dolce-vita',
    el: 'section.v9-section[aria-label^="Development frames"]' },
  { name: 'hero-caption-seagate', url: 'http://localhost:4321/work/sea-gate',
    el: 'section.v9-photofold' },
  { name: 'slate-rows', url: 'http://localhost:4321/slate',
    el: '.v9-slatelist, [class*="slatelist"], main' },
]

const browser = await chromium.launch()
for (const theme of ['dark', 'light']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1400 } })
  await ctx.addInitScript((t) => localStorage.setItem('apr70-theme', t), theme)
  const page = await ctx.newPage()
  for (const t of targets) {
    try {
      await page.goto(t.url, { waitUntil: 'networkidle', timeout: 30000 })
      await page.waitForTimeout(600)
      let loc = page.locator(t.el).first()
      await loc.waitFor({ timeout: 8000 })
      await loc.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await page.waitForTimeout(1200) // hydrate client:visible islands
      if (t.prep) await t.prep(page)
      loc = page.locator(t.el).first()
      // wait until every visible img inside has pixels
      await loc.evaluate(async (el) => {
        const imgs = [...el.querySelectorAll('img')]
        await Promise.all(imgs.map((im) => im.complete && im.naturalWidth ? 0 : new Promise((r) => { im.onload = r; im.onerror = r; setTimeout(r, 4000) })))
      })
      await page.waitForTimeout(500)
      const file = `${OUT}/${label}-${t.name}-${theme}.png`
      await loc.screenshot({ path: file, animations: 'disabled' })
      console.log('shot', file)
    } catch (e) {
      console.error('FAIL', t.name, theme, e.message.split('\n')[0])
    }
  }
  await ctx.close()
}
await browser.close()
