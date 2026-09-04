import { test } from '@playwright/test'
import {
  disableAnalyticsConsent,
  screenshotForViewports,
  waitForDevicePage,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
})

screenshotForViewports('uslugi paint page', 'uslugi-paint-page', async (page, device) => {
  await page.goto('/painting')
  await waitForDevicePage(page, 'uslugi-paint-page', device)
})
