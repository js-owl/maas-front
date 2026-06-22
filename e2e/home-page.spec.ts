import { test, expect } from '@playwright/test'

const mockCoefficients = {
  finish: [{ id: '1', label: 'Ra 1.6' }],
  cover: [{ id: '1', label: 'Без покрытия' }],
  tolerance: [{ id: '1', label: 'h7' }],
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('analytics_consent', 'false')
  })

  await page.route('**/coefficients', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockCoefficients),
    })
  )
})

test('home page desktop screenshot', async ({ page }) => {
  await page.goto('/')
  await page.locator('.home-page').waitFor({ state: 'visible' })
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)

  await expect(page).toHaveScreenshot('home-page-desktop.png', { fullPage: true })
})
