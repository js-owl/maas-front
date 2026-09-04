import { test } from '@playwright/test'
import { disableAnalyticsConsent, screenshotForViewports } from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
})

screenshotForViewports('license page', 'license-page', async (page) => {
  await page.goto('/license')
  await page.locator('.footer-license-page').waitFor({ state: 'visible' })
})
