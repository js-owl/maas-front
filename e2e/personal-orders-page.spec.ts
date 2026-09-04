import { test } from '@playwright/test'
import {
  enableAuthSession,
  fulfillJson,
  mockJsonRoute,
  mockLegalProfile,
  mockMaterials,
  screenshotForViewports,
} from './helpers'

const mockKits = [
  {
    kit_id: 16,
    kit_name: 'Наименование заказа',
    order_ids: [101, 102],
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
  },
]

test.beforeEach(async ({ page }) => {
  await enableAuthSession(page)
  await mockJsonRoute(page, '**/materials**', mockMaterials)
  await page.route('**/api/v3/profile', (route) => {
    if (route.request().method() !== 'GET') {
      route.continue()
      return
    }
    return fulfillJson(route, mockLegalProfile)
  })
  await page.route('**/api/v3/kits', (route) => {
    if (route.request().method() !== 'GET') {
      route.continue()
      return
    }
    return fulfillJson(route, mockKits)
  })
})

screenshotForViewports('personal orders', 'personal-orders-page', async (page, device) => {
  await page.goto('/personal/orders')
  await page.locator('.personal-orders').waitFor({ state: 'visible' })

  if (device === 'mobile') {
    await page.locator('.orders-toolbar-mobile').waitFor({ state: 'visible' })
    await page.locator('.orders-mobile-list').waitFor({ state: 'visible' })
    return
  }

  await page.locator('.orders-toolbar--desktop').waitFor({ state: 'visible' })
  await page.locator('.orders-table--desktop').waitFor({ state: 'visible' })
})
