import { expect, test, type Page, type Route } from '@playwright/test'

export type ScreenshotDevice = 'mobile' | 'tablet' | 'desktop'

export const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 1024, height: 1366 },
  desktop: { width: 1620, height: 720 },
} as const

export const MOBILE_VIEWPORT = VIEWPORTS.mobile
export const TABLET_VIEWPORT = VIEWPORTS.tablet
export const DESKTOP_VIEWPORT = VIEWPORTS.desktop

export const mockCoefficients = {
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

export const mockMaterials = {
  materials: [
    { id: '1', label: 'Алюминий Д16Т', family: 'Алюминий' },
    { id: '2', label: 'Сталь 45', family: 'Сталь' },
  ],
}

export const mockCalculatePrice = {
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

export const mockLegalProfile = {
  id: 1,
  username: 'legal@example.com',
  email: 'legal@example.com',
  email_verified: true,
  is_admin: false,
  phone_number: '+7',
  personal_phone_number: '+7',
  full_name: '',
  last_name: '',
  first_name: '',
  patronymic: '',
  user_type: 'legal',
  city: '',
  postal: '',
  region: '',
  city_name: '',
  street: '',
  building: '',
  office: '',
  payment_bank_name: '',
  payment_inn: '',
  payment_kpp: '',
  payment_bik: '',
  payment_cor_account: '',
  payment_account: '',
  payment_company_name: '',
  company_email: 'a@a.ru',
}

export async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  })
}

export async function stubUnhandledApi(page: Page) {
  await page.route('**/api/v3/**', (route) => fulfillJson(route, {}))
}

export async function disableAnalyticsConsent(page: Page) {
  await stubUnhandledApi(page)
  await page.addInitScript(() => {
    localStorage.setItem('analytics_consent', 'false')
  })
}

export async function enableAuthSession(page: Page) {
  await stubUnhandledApi(page)
  await page.route('**/api/v3/profile', (route) => {
    if (route.request().method() !== 'GET') {
      route.continue()
      return
    }
    return fulfillJson(route, mockLegalProfile)
  })
  await page.addInitScript(() => {
    localStorage.setItem('analytics_consent', 'false')
    localStorage.setItem('token-persistence', 'session')
    localStorage.removeItem('profile-store')
    localStorage.removeItem('material:allMaterials')
    sessionStorage.setItem('token-store', 'e2e-test-token')
  })
}

export async function mockJsonRoute(page: Page, url: string, body: unknown) {
  await page.route(url, (route) => fulfillJson(route, body))
}

export async function waitForPageScreenshot(page: Page) {
  const loadingMask = page.locator('.el-loading-mask')
  if (await loadingMask.count()) {
    await loadingMask.waitFor({ state: 'hidden' }).catch(() => undefined)
  }
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
}

export async function expectPageScreenshot(page: Page, name: string) {
  await waitForPageScreenshot(page)
  await expect(page).toHaveScreenshot(name, { fullPage: true })
}

export const expectDesktopScreenshot = expectPageScreenshot

export async function waitForDevicePage(
  page: Page,
  pageClass: string,
  device: ScreenshotDevice,
) {
  if (device === 'mobile') {
    await page.locator(`.${pageClass}--mobile`).waitFor({ state: 'visible' })
    return
  }

  if (device === 'tablet') {
    await page.locator(`.${pageClass}.content-page--tablet`).waitFor({ state: 'visible' })
    return
  }

  await page
    .locator(`.${pageClass}:not(.${pageClass}--mobile):not(.content-page--tablet)`)
    .waitFor({ state: 'visible' })
}

export async function waitForCalcPage(page: Page, device: ScreenshotDevice) {
  await page.locator('.calc-page').waitFor({ state: 'visible' })
  if (device === 'mobile') {
    await page.locator('.calc-submit--mobile').waitFor({ state: 'visible' })
    return
  }
  await page.locator('.calc-submit--desktop').waitFor({ state: 'visible' })
}

export function screenshotForViewports(
  title: string,
  screenshotBase: string,
  run: (page: Page, device: ScreenshotDevice) => Promise<void>,
) {
  for (const device of ['mobile', 'tablet', 'desktop'] as const) {
    test.describe(device, () => {
      test.use({ viewport: VIEWPORTS[device] })
      test(`${title} ${device} screenshot`, async ({ page }) => {
        await run(page, device)
        await expectPageScreenshot(page, `${screenshotBase}-${device}.png`)
      })
    })
  }
}
