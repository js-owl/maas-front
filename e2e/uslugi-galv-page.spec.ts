import { test } from '@playwright/test'
import {
  disableAnalyticsConsent,
  screenshotForViewports,
  waitForDevicePage,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
})

screenshotForViewports('uslugi galv page', 'uslugi-galv-page', async (page, device) => {
  await page.goto('/galv')
  await waitForDevicePage(page, 'uslugi-galv-page', device)
})
