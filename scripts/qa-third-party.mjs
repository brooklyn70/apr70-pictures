import { chromium } from '/Users/marco/websites/apr70-website/v10/cms/node_modules/@playwright/test/index.mjs'
const pages = ['/', '/slate', '/work/the-movement', '/work/sea-gate', '/craft', '/methods', '/contact', '/212', '/310', '/nrc']
const browser = await chromium.launch()
const page = await browser.newPage()
const external = new Set()
page.on('request', (r) => { const u = new URL(r.url()); if (!['localhost', '127.0.0.1'].includes(u.hostname)) external.add(u.host + u.pathname) })
for (const p of pages) {
  await page.goto('http://localhost:4321' + p, { waitUntil: 'networkidle', timeout: 30000 })
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(800)
}
await browser.close()
console.log(external.size === 0 ? 'ZERO third-party requests across ' + pages.length + ' pages' : [...external].join('\n'))
