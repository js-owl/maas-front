import { test } from '@playwright/test'
import { disableAnalyticsConsent, screenshotForViewports } from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
})

screenshotForViewports('policy page', 'policy-page', async (page) => {
  await page.goto('/policy')
  await page.locator('.footer-policy-page').waitFor({ state: 'visible' })
})
