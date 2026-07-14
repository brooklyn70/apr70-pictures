import { test, expect } from '@playwright/test'

/**
 * CMS smoke test (v12, 2026-07-13). Replaces the Payload scaffold boilerplate,
 * which asserted "Payload Blank Template" and had failed since the root page
 * was renamed. This asserts what the CMS actually is: the internal debug
 * surface at /, the admin at /admin, and a live REST API.
 */
test.describe('CMS', () => {
  test('root debug surface is up and named', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/APR 70 CMS/)
    await expect(page.locator('h1').first()).toContainText('APR 70 CMS')
  })

  test('admin panel responds', async ({ page }) => {
    const res = await page.goto('http://localhost:3000/admin')
    expect(res?.status()).toBeLessThan(400)
  })

  test('REST API serves the site settings', async ({ request }) => {
    const res = await request.get('http://localhost:3000/api/globals/site-settings')
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('brandKit')
  })
})
