import { test } from '@playwright/test'
import {
  disableAnalyticsConsent,
  screenshotForViewports,
  waitForDevicePage,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
})

screenshotForViewports('uslugi pkm page', 'uslugi-pkm-page', async (page, device) => {
  await page.goto('/pkm')
  await waitForDevicePage(page, 'uslugi-pkm-page', device)
})
