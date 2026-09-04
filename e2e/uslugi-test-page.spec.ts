import { test } from '@playwright/test'
import {
  disableAnalyticsConsent,
  screenshotForViewports,
  waitForDevicePage,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
})

screenshotForViewports('uslugi test page', 'uslugi-test-page', async (page, device) => {
  await page.goto('/test')
  await waitForDevicePage(page, 'uslugi-test-page', device)
})
