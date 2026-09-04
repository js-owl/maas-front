import { test } from '@playwright/test'
import {
  disableAnalyticsConsent,
  screenshotForViewports,
  waitForDevicePage,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
})

screenshotForViewports('uslugi print page', 'uslugi-print-page', async (page, device) => {
  await page.goto('/print')
  await waitForDevicePage(page, 'uslugi-print-page', device)
})
