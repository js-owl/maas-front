import { test } from '@playwright/test'
import {
  enableAuthSession,
  mockJsonRoute,
  mockMaterials,
  screenshotForViewports,
} from './helpers'

const KIT_ID = 16

const mockSummary = {
  kit_id: KIT_ID,
  kit_name: 'Наименование заказа',
  kit_quantity: 1,
  orders: [
    {
      order_id: 101,
      order_name: 'Втулка',
      order_code: '3000.012.00.111.001.0000/01',
      quantity: 1,
      unit_price: 440,
      total_price: 440,
      taxes: 88,
      total_kit_price_with_taxes: 528,
    },
    {
      order_id: 102,
      order_name: 'Крестовина',
      order_code: '3000.012.00.111.002.0000/02',
      quantity: 1,
      unit_price: 1666.67,
      total_price: 1666.67,
      taxes: 333.33,
      total_kit_price_with_taxes: 2000,
    },
  ],
  total_kit_price_with_taxes: 2528,
}

test.beforeEach(async ({ page }) => {
  await enableAuthSession(page)
  await mockJsonRoute(page, '**/materials**', mockMaterials)
  await mockJsonRoute(page, `**/api/v3/kits/${KIT_ID}/calculation_summary`, mockSummary)
})

screenshotForViewports('personal calcs', 'personal-calcs-page', async (page) => {
  await page.goto(`/personal/calcs?kitId=${KIT_ID}`)
  await page.locator('.personal-calcs').waitFor({ state: 'visible' })
  await page.locator('.calcs-table').waitFor({ state: 'visible' })
  await page.locator('.order-code').first().waitFor({ state: 'visible' })
})
