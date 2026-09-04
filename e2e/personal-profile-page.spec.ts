import { test, type Page } from '@playwright/test'
import { screenshotForViewports, stubUnhandledApi, type ScreenshotDevice } from './helpers'

const mockMaterials = {
  materials: [
    { id: '1', label: 'Алюминий Д16Т', family: 'Алюминий' },
    { id: '2', label: 'Сталь 45', family: 'Сталь' },
  ],
}

const mockLegalProfile = {
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

const mockIndividualProfile = {
  ...mockLegalProfile,
  username: 'user@example.com',
  email: 'user@example.com',
  user_type: 'individual',
}

test.beforeEach(async ({ page }) => {
  await stubUnhandledApi(page)
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
})

async function mockProfile(page: Page, body: typeof mockLegalProfile) {
  await page.route('**/api/v3/profile', (route) => {
    if (route.request().method() !== 'GET') {
      route.continue()
      return
    }

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    })
  })
}

async function waitForProfile(page: Page, device: ScreenshotDevice, variant: 'legal' | 'individual') {
  await page.locator('.personal-profile-page').waitFor({ state: 'visible' })
  if (variant === 'legal') {
    await page.locator('.profile-legal').waitFor({ state: 'visible' })
  } else {
    await page.locator('.profile-card--individual').waitFor({ state: 'visible' })
  }
  if (device === 'mobile') {
    await page.locator('.profile-footer-mobile').waitFor({ state: 'visible' })
    return
  }
  await page.locator('.profile-footer--desktop').waitFor({ state: 'visible' })
}

screenshotForViewports(
  'personal profile legal',
  'personal-profile-page-legal',
  async (page, device) => {
    await mockProfile(page, mockLegalProfile)
    await page.goto('/personal/profile')
    await waitForProfile(page, device, 'legal')
  },
)

screenshotForViewports(
  'personal profile individual',
  'personal-profile-page-individual',
  async (page, device) => {
    await mockProfile(page, mockIndividualProfile)
    await page.goto('/personal/profile')
    await waitForProfile(page, device, 'individual')
  },
)

