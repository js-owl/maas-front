import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 375, height: 812 } })

const KIT_ID = 16

const mockMaterials = {
  materials: [
    { id: '1', label: 'Алюминий Д16Т', family: 'Алюминий' },
    { id: '2', label: 'Сталь 45', family: 'Сталь' },
  ],
}

const mockKit = {
  kit_id: KIT_ID,
  kit_name: 'Наименование заказа',
  order_ids: [101, 102, 103, 104, 105],
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

const mockLocations = {
  locations: [
    { id: 'location_1', label: 'АО "ДМЗ"' },
    { id: 'location_2', label: 'АО "КТ-Спектр"' },
    { id: 'location_3', label: 'ЦКП' },
  ],
}

const mockOrderDetails = [
  {
    order_id: 101,
    order_code: '3000.012.00.111.001.0000/01',
    order_name: 'Втулка',
    total_price: 528,
    quantity: 1,
    status: 'pending',
    service_id: 'cnc-milling',
    material_id: '1',
    material_form: 'rod',
    cover_id: [],
    k_otk: '1',
    k_cert: [],
    length: 10,
    width: 10,
    height: 10,
    document_ids: [],
    user_id: 1,
    mat_volume: 0,
    detail_price: 528,
    detail_price_one: 528,
    detail_time: 0,
    mat_weight: 0,
    mat_price: 0,
    work_price: 0,
    k_quantity: 1,
    total_time: 0,
    created_at: '2026-02-07T00:00:00Z',
    updated_at: '2026-02-07T00:00:00Z',
    message: '',
    manufacturing_cycle: 0,
    suitable_machines: [],
    calc_ids: [],
  },
  {
    order_id: 102,
    order_code: '3000.012.00.111.002.0000/02',
    order_name: 'Крестовина',
    total_price: 2000,
    quantity: 1,
    status: 'pending',
    service_id: 'cnc-milling',
    material_id: '1',
    material_form: 'rod',
    cover_id: [],
    k_otk: '1',
    k_cert: [],
    length: 10,
    width: 10,
    height: 10,
    document_ids: [],
    user_id: 1,
    mat_volume: 0,
    detail_price: 2000,
    detail_price_one: 2000,
    detail_time: 0,
    mat_weight: 0,
    mat_price: 0,
    work_price: 0,
    k_quantity: 1,
    total_time: 0,
    created_at: '2026-02-07T00:00:00Z',
    updated_at: '2026-02-07T00:00:00Z',
    message: '',
    manufacturing_cycle: 0,
    suitable_machines: [],
    calc_ids: [],
  },
  {
    order_id: 103,
    order_code: '3000.012.00.111.002.0000/03',
    order_name: 'Винт',
    total_price: 3500,
    quantity: 1,
    status: 'pending',
    service_id: 'cnc-milling',
    material_id: '1',
    material_form: 'rod',
    cover_id: [],
    k_otk: '1',
    k_cert: [],
    length: 10,
    width: 10,
    height: 10,
    document_ids: [],
    user_id: 1,
    mat_volume: 0,
    detail_price: 3500,
    detail_price_one: 3500,
    detail_time: 0,
    mat_weight: 0,
    mat_price: 0,
    work_price: 0,
    k_quantity: 1,
    total_time: 0,
    created_at: '2026-02-07T00:00:00Z',
    updated_at: '2026-02-07T00:00:00Z',
    message: '',
    manufacturing_cycle: 0,
    suitable_machines: [],
    calc_ids: [],
  },
  {
    order_id: 104,
    order_code: '3000.012.00.111.002.0000/04',
    order_name: 'Фланец',
    total_price: 2700,
    quantity: 1,
    status: 'pending',
    service_id: 'cnc-milling',
    material_id: '1',
    material_form: 'rod',
    cover_id: [],
    k_otk: '1',
    k_cert: [],
    length: 10,
    width: 10,
    height: 10,
    document_ids: [],
    user_id: 1,
    mat_volume: 0,
    detail_price: 2700,
    detail_price_one: 2700,
    detail_time: 0,
    mat_weight: 0,
    mat_price: 0,
    work_price: 0,
    k_quantity: 1,
    total_time: 0,
    created_at: '2026-02-07T00:00:00Z',
    updated_at: '2026-02-07T00:00:00Z',
    message: '',
    manufacturing_cycle: 0,
    suitable_machines: [],
    calc_ids: [],
  },
  {
    order_id: 105,
    order_code: '3000.012.00.111.002.0000/05',
    order_name: 'Дорн',
    total_price: 1800,
    quantity: 1,
    status: 'pending',
    service_id: 'cnc-milling',
    material_id: '1',
    material_form: 'rod',
    cover_id: [],
    k_otk: '1',
    k_cert: [],
    length: 10,
    width: 10,
    height: 10,
    document_ids: [],
    user_id: 1,
    mat_volume: 0,
    detail_price: 1800,
    detail_price_one: 1800,
    detail_time: 0,
    mat_weight: 0,
    mat_price: 0,
    work_price: 0,
    k_quantity: 1,
    total_time: 0,
    created_at: '2026-02-07T00:00:00Z',
    updated_at: '2026-02-07T00:00:00Z',
    message: '',
    manufacturing_cycle: 0,
    suitable_machines: [],
    calc_ids: [],
  },
]

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('analytics_consent', 'false')
    localStorage.setItem('token-persistence', 'session')
    localStorage.removeItem('profile-store')
    localStorage.removeItem('material:allMaterials')
    sessionStorage.setItem('token-store', 'e2e-test-token')
  })

  await page.route('**/materials**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockMaterials),
    })
  )

  await page.route(`**/api/v3/kits/${KIT_ID}`, (route) => {
    if (route.request().method() !== 'GET') {
      route.continue()
      return
    }

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockKit),
    })
  })

  await page.route('**/api/v3/locations', (route) => {
    if (route.request().method() !== 'GET') {
      route.continue()
      return
    }

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockLocations),
    })
  })

  for (const order of mockOrderDetails) {
    await page.route(`**/api/v3/orders/${order.order_id}`, (route) => {
      if (route.request().method() !== 'GET') {
        route.continue()
        return
      }

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(order),
      })
    })
  }
})

test('personal order mobile screenshot', async ({ page }) => {
  await page.goto(`/personal/order?kitId=${KIT_ID}`)
  await page.locator('.personal-order').waitFor({ state: 'visible' })
  await page.locator('.order-toolbar-mobile').waitFor({ state: 'visible' })
  await page.locator('.order-details-mobile').waitFor({ state: 'visible' })
  await page.locator('.order-details-mobile__row').first().waitFor({ state: 'visible' })
  await page.locator('.summary-card').waitFor({ state: 'visible' })
  await page.locator('.summary-actions-mobile').waitFor({ state: 'visible' })
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)

  await expect(page).toHaveScreenshot('personal-order-page-mobile.png', { fullPage: true })
})
