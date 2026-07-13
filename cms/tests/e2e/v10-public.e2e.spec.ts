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

  /* NOTE: /troupe is NOT in this table any more (v11, 2026-07-13). It was a v10
     retired route (301 → /methods); it is now a real, switch-gated page, and its
     301 was removed so the switch can take effect at all. Its behaviour is
     asserted by the "troupe is dark" test below, which requires a 404 and
     explicitly rejects a 301 — if the redirect ever creeps back, that test fails
     rather than this one silently passing. */
  test('retired routes redirect', async ({ request }) => {
    const redirects: Record<string, string> = {
      '/about': '/methods',
      '/jobs': '/contact',
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

  /* TROUPE (v11) — the radio play page. It ships dark, and it stays dark until BOTH
     the switch is on AND a recording is uploaded. This test guards the shipped
     state; it also guards the thing that matters most about this page, which is
     that /troupe must never be reachable while there is no radio on it. The old
     v4 /troupe was a 301 to /methods — that redirect was REMOVED so the route
     could exist again, so a 301 here now means the redirect crept back and the
     switch can never work. 404 is the only acceptable answer. */
  test('troupe is dark: 404 (not a 301) and absent from nav + sitemap', async ({ request, page }) => {
    const res = await request.get(`${SITE}/troupe`, { maxRedirects: 0 })
    expect(res.status()).toBe(404)

    const sitemap = await request.get(`${SITE}/sitemap.xml`)
    expect(await sitemap.text()).not.toContain('/troupe')

    await page.goto(`${SITE}/`)
    await expect(page.locator('.v9-nav__link[href="/troupe"]')).toHaveCount(0)
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
  /* v11: the floating "Display" pill is gone; the mode switch is a single icon in
     the nav. It names the ACTION, not the state, so in the dark it offers you the
     house lights. Asserted with the OS forced to dark so the starting mode is
     deterministic. */
  test('nav mode toggle flips data-theme and persists', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto(`${SITE}/`)
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important} *{transition:none!important;animation:none!important}' })

    const toggle = page.locator('.mode-toggle')
    await toggle.waitFor({ state: 'visible' })
    await expect(toggle).toHaveAttribute('data-mode', 'dark')

    await toggle.click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await expect(page.locator('.mode-toggle')).toHaveAttribute('data-mode', 'light')

    await page.locator('.mode-toggle').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  /* The pill must stay dead. It was a floating box holding one control, parked on
     top of the artwork on every page; two investors read it, independently, as a
     dev artifact left in production. */
  test('the Display pill is gone', async ({ page }) => {
    await page.goto(`${SITE}/`)
    await expect(page.locator('.tc-pill')).toHaveCount(0)
    await expect(page.locator('.theme-control')).toHaveCount(0)
  })

  /* v11: nine motion pictures, nine frames. The slate used to list them with no
     images at all and the right half of every row empty. */
  test('every slate row carries its frame', async ({ page }) => {
    await page.goto(`${SITE}/slate`)
    const rows = page.locator('.v9-slaterow')
    const n = await rows.count()
    expect(n).toBeGreaterThanOrEqual(9)
    for (let i = 0; i < n; i++) {
      await expect(rows.nth(i).locator('.v9-slaterow__frame img')).toHaveCount(1)
    }
  })

  /* THE BILLING LAW (/nrc): "Every APR 70 feature carries this banner, and its
     home territory, (212) or (310), joins as co-production." Sea Gate and Da Hook
     used to wear "(212) Pictures" on /slate and "New Renaissance Cinema" on /nrc:
     the same picture, two studios, depending which page you opened. Four of five
     investors caught it. It is one string now, from Project.metaLine, and this
     test fails the moment a second source of truth reappears. */
  test('billing blocks agree across every surface', async ({ page }) => {
    const want = /Feature · New Renaissance Cinema with \(212\) Pictures/i
    for (const path of ['/slate', '/nrc']) {
      await page.goto(`${SITE}${path}`)
      const body = await page.locator('body').innerText()
      expect(body, `${path} must bill Sea Gate as a co-production`).toMatch(want)
      expect(body, `${path} must not bill a feature to (212) alone`).not.toMatch(
        /Feature · \(212\) Pictures/i,
      )
    }
  })

  /* The roll counter shipped reading "1 NAME ON THE ROLL". All five investors
     called for its head. It stays hidden below the floor, whatever the CMS
     checkbox says. */
  test('the roll counter is suppressed below the floor', async ({ page }) => {
    await page.goto(`${SITE}/contact`)
    await expect(page.locator('.v9-roll__count')).toHaveCount(0)
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
