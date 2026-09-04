import { test } from '@playwright/test'
import {
  enableAuthSession,
  mockCalculatePrice,
  mockCoefficients,
  mockJsonRoute,
  mockMaterials,
  screenshotForViewports,
} from './helpers'

const KIT_ID = 16
const ORDER_ID = 101

const mockOrder = {
  ...mockCalculatePrice,
  order_id: ORDER_ID,
  order_code: '3000.012.00.111.001.0000/01',
  order_name: 'Втулка',
  file_id: null,
  document_ids: [],
  quantity: 8,
}

const mockKit = {
  kit_id: KIT_ID,
  kit_name: 'Наименование заказа',
  order_ids: [ORDER_ID],
  user_id: 1,
  quantity: 1,
  status: 'processing',
  status_name: 'processing',
  created_at: '2026-02-07T00:00:00Z',
  updated_at: '2026-02-07T00:00:00Z',
  bitrix_deal_id: 0,
  location: 'location_1',
  kit_price: 10528,
  delivery_price: 0,
  total_kit_price: 10528,
}

test.beforeEach(async ({ page }) => {
  await enableAuthSession(page)
  await mockJsonRoute(page, '**/materials**', mockMaterials)
  await mockJsonRoute(page, '**/coefficients', mockCoefficients)
  await mockJsonRoute(page, '**/other_services', {
    other_services: [{ id: '101', label: 'Механообработка', service: 'cnc-milling' }],
  })
  await mockJsonRoute(page, `**/api/v3/orders/${ORDER_ID}`, mockOrder)
  await mockJsonRoute(page, `**/api/v3/kits/${KIT_ID}`, mockKit)
})

screenshotForViewports('personal calc', 'personal-calc-page', async (page, device) => {
  await page.goto(`/personal/calc?kitId=${KIT_ID}&orderId=${ORDER_ID}`)
  await page.locator('.personal-calc-container').waitFor({ state: 'visible' })

  if (device === 'mobile') {
    await page.locator('.calc-toolbar-mobile').waitFor({ state: 'visible' })
    await page.locator('.summary-actions-mobile').waitFor({ state: 'visible' })
    return
  }

  await page.locator('.toolbar-row--desktop').waitFor({ state: 'visible' })
  await page.locator('.summary-actions--desktop').waitFor({ state: 'visible' })
})
