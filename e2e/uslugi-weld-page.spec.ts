import { test } from '@playwright/test'
import {
  disableAnalyticsConsent,
  screenshotForViewports,
  waitForDevicePage,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
})

screenshotForViewports('uslugi weld page', 'uslugi-weld-page', async (page, device) => {
  await page.goto('/weld')
  await waitForDevicePage(page, 'uslugi-weld-page', device)
})
