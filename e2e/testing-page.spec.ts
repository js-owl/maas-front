import { test } from '@playwright/test'
import {
  disableAnalyticsConsent,
  screenshotForViewports,
  waitForDevicePage,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
})

screenshotForViewports('testing page', 'testing-page', async (page, device) => {
  await page.goto('/testing')
  await waitForDevicePage(page, 'testing-page', device)
})
