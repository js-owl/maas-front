import { expect, test, type Page, type Route } from '@playwright/test'

// API response shapes are shared with the vitest suite so a contract change
// only has to be made once. See src/test/fixtures.ts.
export {
  mockAuthResponse,
  mockCalculatePrice,
  mockCoefficients,
  mockIndividualProfile,
  mockKit,
  mockLegalProfile,
  mockMaterials,
  mockOrder,
  mockOtherServices,
} from '../src/test/fixtures'

import { mockLegalProfile } from '../src/test/fixtures'

export type ScreenshotDevice = 'mobile' | 'tablet' | 'desktop'

export const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 1024, height: 1366 },
  desktop: { width: 1620, height: 720 },
} as const

export const MOBILE_VIEWPORT = VIEWPORTS.mobile
export const TABLET_VIEWPORT = VIEWPORTS.tablet
export const DESKTOP_VIEWPORT = VIEWPORTS.desktop

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
