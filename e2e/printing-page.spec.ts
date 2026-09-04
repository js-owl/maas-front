import { test, type Page } from '@playwright/test'
import {
  disableAnalyticsConsent,
  mockCalculatePrice,
  mockCoefficients,
  mockJsonRoute,
  screenshotForViewports,
  type ScreenshotDevice,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
  await mockJsonRoute(page, '**/coefficients', mockCoefficients)
  await mockJsonRoute(page, '**/materials?process=printing', {
    materials: [
      { id: 'plastic_PA11', label: 'PA11', family: 'Пластик' },
      { id: '1', label: 'Алюминий Д16Т', family: 'Алюминий' },
    ],
  })
  await mockJsonRoute(page, '**/calculate-price', {
    ...mockCalculatePrice,
    service_id: 'printing',
    file_id: 1,
    material_id: 'plastic_PA11',
    material_form: 'powder',
  })
  await mockJsonRoute(page, '**/files/1', { filename: 'part.pdf' })
})

async function waitForCalcPage(page: Page, device: ScreenshotDevice) {
  await page.locator('.calc-page').waitFor({ state: 'visible' })
  if (device === 'mobile') {
    await page.locator('.calc-submit--mobile').waitFor({ state: 'visible' })
    return
  }
  await page.locator('.calc-submit--desktop').waitFor({ state: 'visible' })
}

screenshotForViewports('printing page', 'printing-page', async (page, device) => {
  await page.goto('/printing')
  await waitForCalcPage(page, device)
})
