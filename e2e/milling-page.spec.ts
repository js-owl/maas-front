import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 1620, height: 720 } })

const mockCoefficients = {
  finish: [
    { id: '1', label: 'Ra 0.8' },
    { id: '2', label: 'Ra 1.6' },
    { id: '3', label: 'Ra 6.3' },
  ],
  cover: [
    { id: '1', label: 'Без покрытия' },
    { id: '2', label: 'Анодирование' },
    { id: '3', label: 'Покраска' },
  ],
  tolerance: [
    { id: '1', label: 'h7' },
    { id: '4', label: 'h12' },
  ],
}

const mockMaterials = {
  materials: [
    { id: '1', label: 'Алюминий Д16Т', family: 'Алюминий' },
    { id: '2', label: 'Сталь 45', family: 'Сталь' },
  ],
}

const mockCalculatePrice = {
  order_id: 0,
  user_id: 0,
  service_id: 'cnc-milling',
  document_ids: [],
  file_id: 2,
  quantity: 1,
  length: 120,
  width: 30,
  height: 30,
  material_id: '1',
  material_form: 'sheet',
  tolerance_id: '4',
  finish_id: '3',
  cover_id: ['1'],
  n_dimensions: 55,
  k_otk: '1.0',
  k_cert: ['a', 'f'],
  status: 'CALCULATED',
  mat_volume: 0.1,
  detail_price: 15000,
  detail_price_one: 15000,
  detail_time: 2.5,
  total_price: 15000,
  mat_weight: 0.5,
  mat_price: 3000,
  work_price: 12000,
  k_quantity: 1,
  total_time: 2.5,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  message: '',
  manufacturing_cycle: 5,
  suitable_machines: [],
  calc_ids: [],
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('analytics_consent', 'false')
  })

  await page.route('**/coefficients', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockCoefficients),
    })
  )

  await page.route('**/materials?process=cnc-milling', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockMaterials),
    })
  )

  await page.route('**/calculate-price', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockCalculatePrice),
    })
  )

  await page.route('**/files/2', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ filename: 'part.pdf' }),
    })
  )
})

test('milling page desktop screenshot', async ({ page }) => {
  await page.goto('/milling')
  await page.locator('.milling-page').waitFor({ state: 'visible' })
  await page.locator('.el-loading-mask').waitFor({ state: 'hidden' })
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)

  await expect(page).toHaveScreenshot('milling-page-desktop.png', { fullPage: true })
})
