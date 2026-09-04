import { test } from '@playwright/test'
import {
  disableAnalyticsConsent,
  mockCoefficients,
  mockJsonRoute,
  screenshotForViewports,
  waitForDevicePage,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
  await mockJsonRoute(page, '**/coefficients', mockCoefficients)
})

screenshotForViewports('home page', 'home-page', async (page, device) => {
  await page.goto('/')
  await waitForDevicePage(page, 'home-page', device)
})
