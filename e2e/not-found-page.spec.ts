import { test } from '@playwright/test'
import { disableAnalyticsConsent, screenshotForViewports } from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
})

screenshotForViewports('not found page', 'not-found-page', async (page) => {
  await page.goto('/this-page-does-not-exist')
  await page.locator('h1:not(.seo-main-heading)').waitFor({ state: 'visible' })
})
