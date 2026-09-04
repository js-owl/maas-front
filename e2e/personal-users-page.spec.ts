import { test } from '@playwright/test'
import {
  enableAuthSession,
  mockJsonRoute,
  mockMaterials,
  screenshotForViewports,
} from './helpers'

const mockUsers = [
  {
    id: 1,
    username: 'legal@example.com',
    email: 'legal@example.com',
    full_name: 'ООО Пример',
    user_type: 'legal',
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 2,
    username: 'user@example.com',
    email: 'user@example.com',
    full_name: 'Иван Иванов',
    user_type: 'individual',
    created_at: '2026-02-01T00:00:00Z',
  },
]

test.beforeEach(async ({ page }) => {
  await enableAuthSession(page)
  await mockJsonRoute(page, '**/materials**', mockMaterials)
  await mockJsonRoute(page, '**/api/v3/users', mockUsers)
})

screenshotForViewports('personal users', 'personal-users-page', async (page) => {
  await page.goto('/personal/users')
  await page.getByRole('heading', { name: 'Пользователи' }).waitFor({ state: 'visible' })
  await page.locator('.el-table').waitFor({ state: 'visible' })
  await page.getByText('legal@example.com').first().waitFor({ state: 'visible' })
})
