import { test } from '@playwright/test'
import {
  disableAnalyticsConsent,
  screenshotForViewports,
  waitForDevicePage,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
})

screenshotForViewports('uslugi rubber page', 'uslugi-rubber-page', async (page, device) => {
  await page.goto('/rubber')
  await waitForDevicePage(page, 'uslugi-rubber-page', device)
})
