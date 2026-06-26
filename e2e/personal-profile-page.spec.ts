import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 375, height: 812 } })

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

test('personal profile legal mobile screenshot', async ({ page }) => {
  await page.route('**/api/v3/profile', (route) => {
    if (route.request().method() !== 'GET') {
      route.continue()
      return
    }

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockLegalProfile),
    })
  })

  await page.goto('/personal/profile')
  await page.locator('.personal-profile-page').waitFor({ state: 'visible' })
  await page.locator('.profile-legal').waitFor({ state: 'visible' })
  await page.locator('.profile-footer-mobile').waitFor({ state: 'visible' })
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)

  await expect(page).toHaveScreenshot('personal-profile-page-legal-mobile.png', { fullPage: true })
})

test('personal profile individual mobile screenshot', async ({ page }) => {
  await page.route('**/api/v3/profile', (route) => {
    if (route.request().method() !== 'GET') {
      route.continue()
      return
    }

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockIndividualProfile),
    })
  })

  await page.goto('/personal/profile')
  await page.locator('.personal-profile-page').waitFor({ state: 'visible' })
  await page.locator('.profile-card--individual').waitFor({ state: 'visible' })
  await page.locator('.profile-footer-mobile').waitFor({ state: 'visible' })
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)

  await expect(page).toHaveScreenshot('personal-profile-page-individual-mobile.png', { fullPage: true })
})
