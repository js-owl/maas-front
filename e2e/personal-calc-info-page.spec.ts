import { test } from '@playwright/test'
import {
  enableAuthSession,
  mockJsonRoute,
  mockMaterials,
  screenshotForViewports,
} from './helpers'

const KIT_ID = 16
const ORDER_ID = 101

const mockOrder = {
  order_id: ORDER_ID,
  order_code: '3000.012.00.111.001.0000/01',
  order_name: 'Втулка',
  total_price: 528,
  quantity: 1,
  status: 'pending',
  service_id: 'cnc-milling',
  material_id: '1',
  length: 10,
  width: 10,
  height: 10,
  mat_volume: 0.000001,
  mat_weight: 0.5,
  total_time: 2.5,
  detail_price_calculation: {
    material_price: 3000,
    salary_fund_with_taxes: 12000,
    price_special_equipment: 0,
    detail_price_one: 15000,
    taxes: 3000,
    detail_price_one_with_taxes: 18000,
  },
  total_price_breakdown: {
    mat_price: 3000,
    price_per_kg: 6000,
    dop_mat_price: 0,
    price_of_hour_with_others: 4800,
    work_price: 12000,
    dop_salary: 0,
    insurance_price: 0,
    overhead_expenses: 0,
    administrative_expenses: 0,
  },
}

test.beforeEach(async ({ page }) => {
  await enableAuthSession(page)
  await mockJsonRoute(page, '**/materials**', mockMaterials)
  await mockJsonRoute(page, `**/api/v3/orders/${ORDER_ID}`, mockOrder)
})

screenshotForViewports('personal calc info', 'personal-calc-info-page', async (page) => {
  await page.goto(`/personal/calc-info?kitId=${KIT_ID}&orderId=${ORDER_ID}`)
  await page.locator('.calc-info-page').waitFor({ state: 'visible' })
  await page.locator('.calc-info-container').waitFor({ state: 'visible' })
})
