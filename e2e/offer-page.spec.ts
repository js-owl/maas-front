import { test } from '@playwright/test'
import { disableAnalyticsConsent, screenshotForViewports } from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
})

screenshotForViewports('offer page', 'offer-page', async (page) => {
  await page.goto('/offer-client')
  await page.locator('.footer-offer-page').waitFor({ state: 'visible' })
})
