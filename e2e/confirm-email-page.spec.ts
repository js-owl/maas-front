import { test } from '@playwright/test'
import { disableAnalyticsConsent, screenshotForViewports } from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
})

screenshotForViewports('confirm email page', 'confirm-email-page', async (page) => {
  await page.goto('/confirm-email')
  await page.locator('.confirm-email-card').waitFor({ state: 'visible' })
})
