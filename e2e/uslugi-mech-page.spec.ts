import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 375, height: 812 } })

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('analytics_consent', 'false')
  })
})

test('uslugi mech page mobile screenshot', async ({ page }) => {
  await page.goto('/mechanical')
  await page.locator('.uslugi-mech-page--mobile').waitFor({ state: 'visible' })
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)

  await expect(page).toHaveScreenshot('uslugi-mech-page-mobile.png', { fullPage: true })
})
