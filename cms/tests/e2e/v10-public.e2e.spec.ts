import { test, expect, type Page } from '@playwright/test'

/**
 * v10 public-surface regression (catalog step 7 + brief DoD 14).
 * Targets the ASTRO site (localhost:4321), not the CMS admin.
 *
 * Covers:
 *  - ZERO third-party requests on every key route (the P0 privacy law —
 *    this assertion exists so the Google Fonts leak class of bug cannot
 *    recur silently)
 *  - key routes 200 in v9 chrome; retired routes 301/410
 *  - mode toggle (Marquee Night / House Lights) flips data-theme
 *  - property ring prev/next on /work/<slug>
 *  - Founding Roll fold present with a working form surface
 *  - scrollbars visually hidden while scrolling still works
 *  - Futura Std actually loaded as the display face
 */

const SITE = process.env.PUBLIC_SITE_URL || 'http://localhost:4321'

/* Interactive tests: kill smooth-scroll + reveal transitions, which keep
   elements "unstable" for actionability checks. The site honors
   prefers-reduced-motion, so this is a supported first-party path. */
test.use({ reducedMotion: 'reduce' })

const LIVE_ROUTES = ['/', '/slate', '/craft', '/methods', '/contact', '/work/sea-gate', '/212', '/310', '/nrc']

const FIRST_PARTY = [
  'localhost',
  '127.0.0.1',
  'kimaserver',
  '100.69.2.30',
  'apr70.com',
  'staging.apr70.com',
]

function isFirstParty(url: string): boolean {
  try {
    const host = new URL(url).hostname
    return FIRST_PARTY.some((h) => host === h || host.endsWith(`.${h}`))
  } catch {
    return true // data:, blob:, about: are first-party by nature
  }
}

async function collectThirdParty(page: Page, path: string): Promise<string[]> {
  const offenders: string[] = []
  page.on('request', (req) => {
    if (!isFirstParty(req.url())) offenders.push(req.url())
  })
  await page.goto(`${SITE}${path}`, { waitUntil: 'networkidle' })
  return offenders
}

test.describe('privacy: zero third-party requests', () => {
  for (const path of LIVE_ROUTES) {
    test(`no third-party requests on ${path}`, async ({ page }) => {
      const offenders = await collectThirdParty(page, path)
      expect(offenders, `third-party requests found on ${path}`).toEqual([])
    })
  }
})

test.describe('routes', () => {
  test('live routes return 200', async ({ request }) => {
    for (const path of LIVE_ROUTES) {
      const res = await request.get(`${SITE}${path}`, { maxRedirects: 0 })
      expect(res.status(), path).toBe(200)
    }
  })

  test('retired routes redirect', async ({ request }) => {
    const redirects: Record<string, string> = {
      '/about': '/methods',
      '/jobs': '/contact',
      '/troupe': '/methods',
      '/work': '/slate',
      '/news': '/',
    }
    for (const [from, to] of Object.entries(redirects)) {
      const res = await request.get(`${SITE}${from}`, { maxRedirects: 0 })
      expect([301, 302, 308]).toContain(res.status())
      expect(res.headers()['location']).toBe(to)
    }
  })

  test('room-only routes are gone (410)', async ({ request }) => {
    for (const path of ['/investors', '/pitch']) {
      const res = await request.get(`${SITE}${path}`)
      expect(res.status(), path).toBe(410)
    }
  })

  /* DISPATCH ships parked: the route and the switch exist, the page does not.
     Publishing is Marco's call in Payload (Site Settings → DISPATCH), never a
     side effect of a deploy — so the shipped default must stay 404, and the
     nav must not carry the link. If this fails, someone left it switched on. */
  test('dispatch is parked: 404 and absent from nav + sitemap', async ({ request, page }) => {
    const res = await request.get(`${SITE}/dispatch`, { maxRedirects: 0 })
    expect(res.status()).toBe(404)

    const sitemap = await request.get(`${SITE}/sitemap.xml`)
    expect(await sitemap.text()).not.toContain('/dispatch')

    await page.goto(`${SITE}/`)
    await expect(page.locator('.v9-nav__link[href="/dispatch"]')).toHaveCount(0)
  })

  test('private property leaks nowhere', async ({ request }) => {
    const work = await request.get(`${SITE}/work/mayors`, { maxRedirects: 0 })
    expect([301, 302, 404]).toContain(work.status())
    for (const surface of ['/llms.txt', '/llms-full.txt', '/sitemap.xml']) {
      const res = await request.get(`${SITE}${surface}`)
      expect(await res.text()).not.toContain('mayors')
    }
  })
})

test.describe('chrome', () => {
  test('mode toggle flips data-theme and persists', async ({ page }) => {
    await page.goto(`${SITE}/`)
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important} *{transition:none!important;animation:none!important}' })
    const pill = page.getByRole('button', { name: 'Open display settings' })
    await pill.waitFor({ state: 'visible' })
    await pill.click()
    await page.getByRole('button', { name: /house lights/i }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await page.getByRole('button', { name: 'Open display settings' }).click()
    await page.getByRole('button', { name: /marquee night/i }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  test('property ring: prev/next navigate the slate', async ({ page }) => {
    await page.goto(`${SITE}/work/sea-gate`)
    const next = page.locator('a[rel="next"], a:has-text("Next property")').first()
    await expect(next).toBeVisible()
    const href = await next.getAttribute('href')
    expect(href).toMatch(/^\/work\//)
    await next.click()
    await expect(page).toHaveURL(new RegExp(`${href}$`))
  })

  test('scrollbars hidden, scrolling still works', async ({ page }) => {
    await page.goto(`${SITE}/slate`)
    const sw = await page.evaluate(() => getComputedStyle(document.documentElement).scrollbarWidth)
    expect(sw).toBe('none')
    await page.mouse.wheel(0, 800)
    await page.waitForFunction(() => window.scrollY > 200)
  })

  test('Futura Std is the loaded display face', async ({ page }) => {
    await page.goto(`${SITE}/`)
    await page.evaluate(() => document.fonts.load('16px "Futura Std"'))
    await page.waitForFunction(() => document.fonts.check('16px "Futura Std"'))
    const loaded = await page.evaluate(() => document.fonts.check('16px "Futura Std"'))
    expect(loaded).toBe(true)
    const navFont = await page.evaluate(() => {
      const el = document.querySelector('.v9-nav__link')
      return el ? getComputedStyle(el).fontFamily : ''
    })
    expect(navFont).toContain('Futura Std')
  })
})

test.describe('founding roll', () => {
  test('the fold renders with count and form', async ({ page }) => {
    await page.goto(`${SITE}/contact`)
    await expect(page.getByRole('heading', { name: 'The Founding Roll.' })).toBeVisible()
    const form = page.locator('form[aria-label="Join the Founding Roll"]')
    await expect(form).toBeVisible()
    await expect(form.locator('input[name="name"]')).toBeVisible()
    await expect(form.locator('input[name="email"]')).toBeVisible()
    await expect(form.locator('input[name="consent"]')).toBeVisible()
  })

  test('enrollment end-to-end (test entry, cleaned by teardown)', async ({ page }) => {
    await page.goto(`${SITE}/contact`)
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important} *{transition:none!important;animation:none!important}' })
    const form = page.locator('form[aria-label="Join the Founding Roll"]')
    await form.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1800) // client:visible hydration settle
    await form.locator('input[name="name"]').fill('Playwright QA')
    await form.locator('input[name="email"]').fill('playwright-qa@apr70.test')
    await form.locator('input[name="consent"]').check()
    await form.locator('button[type="submit"]').click()
    await expect(page.locator('.v9-roll__done')).toBeVisible()
    await expect(page.locator('.v9-roll__number')).toContainText(/No\. \d+/)
  })
})
