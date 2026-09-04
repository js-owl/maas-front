import { test, type Page } from '@playwright/test'
import {
  disableAnalyticsConsent,
  mockCalculatePrice,
  mockCoefficients,
  mockJsonRoute,
  mockMaterials,
  screenshotForViewports,
  type ScreenshotDevice,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
  await mockJsonRoute(page, '**/coefficients', mockCoefficients)
  await mockJsonRoute(page, '**/materials?process=cnc-milling', mockMaterials)
  await mockJsonRoute(page, '**/other_services', {
    other_services: [
      { id: '101', label: 'Механообработка', service: 'cnc-milling' },
      { id: '102', label: '3D-печать', service: 'printing' },
    ],
  })
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

screenshotForViewports('other page', 'other-page', async (page, device) => {
  await page.goto('/other')
  await waitForCalcPage(page, device)
})
