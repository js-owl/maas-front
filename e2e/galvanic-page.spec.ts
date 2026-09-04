import { test, type Page } from '@playwright/test'
import {
  disableAnalyticsConsent,
  mockCalculatePrice,
  mockCoefficients,
  mockJsonRoute,
  screenshotForViewports,
  type ScreenshotDevice,
} from './helpers'

const mockOperations = {
  values: [
    {
      id: 'zinc',
      group: 'Цинкование',
      path: ['Цинк'],
      label: 'Цинкование',
      max_part_size_label: '500x500x500',
      max_weight_kg: 50,
    },
  ],
}

const mockFamilies = {
  values: [
    { id: 'steel', label: 'Сталь' },
    { id: 'alum', label: 'Алюминий' },
  ],
}

test.beforeEach(async ({ page }) => {
  await disableAnalyticsConsent(page)
  await mockJsonRoute(page, '**/coefficients', mockCoefficients)
  await mockJsonRoute(page, '**/operations_available**', mockOperations)
  await mockJsonRoute(page, '**/electroplating_material_families**', mockFamilies)
  await mockJsonRoute(page, '**/calculate-price', {
    ...mockCalculatePrice,
    service_id: 'electroplating_auto',
  })
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

screenshotForViewports('galvanic page', 'galvanic-page', async (page, device) => {
  await page.goto('/galvanic')
  await waitForCalcPage(page, device)
})
