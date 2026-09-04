import { test } from '@playwright/test'
import { disableAnalyticsConsent, screenshotForViewports } from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
})

screenshotForViewports('reset password page', 'reset-password-page', async (page) => {
  await page.goto('/reset-password?token=e2e-reset-token')
  await page.locator('.reset-password-form').waitFor({ state: 'visible' })
})
