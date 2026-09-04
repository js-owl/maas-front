import { test } from '@playwright/test'
import {
  disableAnalyticsConsent,
  screenshotForViewports,
  waitForDevicePage,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
})

screenshotForViewports('uslugi mech page', 'uslugi-mech-page', async (page, device) => {
  await page.goto('/mechanical')
  await waitForDevicePage(page, 'uslugi-mech-page', device)
})
