import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 375, height: 812 } })

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('analytics_consent', 'false')
  })
})

test('uslugi weld page mobile screenshot', async ({ page }) => {
  await page.goto('/weld')
  await page.locator('.uslugi-weld-page--mobile').waitFor({ state: 'visible' })
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)

  await expect(page).toHaveScreenshot('uslugi-weld-page-mobile.png', { fullPage: true })
})
