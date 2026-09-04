import { test } from '@playwright/test'
import {
  disableAnalyticsConsent,
  mockCalculatePrice,
  mockCoefficients,
  mockJsonRoute,
  mockMaterials,
  screenshotForViewports,
  type ScreenshotDevice,
} from './helpers'
import type { Page } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
  await mockJsonRoute(page, '**/coefficients', mockCoefficients)
  await mockJsonRoute(page, '**/materials?process=cnc-milling', mockMaterials)
  await mockJsonRoute(page, '**/calculate-price', mockCalculatePrice)
  await mockJsonRoute(page, '**/files/2', { filename: 'part.pdf' })
})

async function waitForCalcPage(page: Page, device: ScreenshotDevice) {
  await page.locator('.calc-page').waitFor({ state: 'visible' })
  if (device === 'mobile') {
    await page.locator('.calc-submit--mobile').waitFor({ state: 'visible' })
    return
  }
  await page.locator('.calc-submit--desktop').waitFor({ state: 'visible' })
}

screenshotForViewports('milling page', 'milling-page', async (page, device) => {
  await page.goto('/milling')
  await waitForCalcPage(page, device)
})
