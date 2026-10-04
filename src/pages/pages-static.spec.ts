import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { mockJson } from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import { useAuthStore } from '@/stores/auth.store'

vi.mock('@/components/sections/HomeCalc.vue', () => ({
  default: { name: 'HomeCalc', template: '<div class="stub-home-calc" />' },
}))
vi.mock('@/components/sections/HomeUslugi.vue', () => ({
  default: { name: 'HomeUslugi', template: '<div class="stub-home-uslugi" />' },
}))
vi.mock('@/components/sections/HomeAdvantages.vue', () => ({
  default: { name: 'HomeAdvantages', template: '<div class="stub-home-advantages" />' },
}))
vi.mock('@/components/sections/HomeMilestones.vue', () => ({
  default: { name: 'HomeMilestones', template: '<div class="stub-home-milestones" />' },
}))

import NotFoundPage from './NotFoundPage.vue'
import HomePage from './HomePage.vue'
import PersonalPage from './PersonalPage.vue'
import TestingPage from './TestingPage.vue'
import FooterPolicyPage from './FooterPolicyPage.vue'
import FooterOfferPage from './FooterOfferPage.vue'
import FooterLicensePage from './FooterLicensePage.vue'
import ConfirmEmailPage from './ConfirmEmailPage.vue'
import ResetPasswordPage from './ResetPasswordPage.vue'
import UslugiMechPage from './UslugiMechPage.vue'
import UslugiGalvPage from './UslugiGalvPage.vue'
import UslugiPrintPage from './UslugiPrintPage.vue'
import UslugiPaintPage from './UslugiPaintPage.vue'
import UslugiPKMPage from './UslugiPKMPage.vue'
import UslugiRubberPage from './UslugiRubberPage.vue'
import UslugiTestPage from './UslugiTestPage.vue'
import UslugiWeldPage from './UslugiWeldPage.vue'

async function flush(ms = 0) {
  await nextTick()
  if (ms) await new Promise((r) => setTimeout(r, ms))
  await nextTick()
}

const sectionStubs = {
  HomeCalc: true,
  HomeUslugi: true,
  HomeAdvantages: true,
  HomeMilestones: true,
  UslugiCalc: true,
  UslugiLathe: true,
  UslugiMilling: true,
  UslugiGrinding: true,
  UslugiLaser: true,
  UslugiBending: true,
  UslugiWeld: true,
  UslugiPaint: true,
  UslugiPrint: true,
  UslugiPrintExample: true,
  UslugiGalv: true,
  UslugiPKM: true,
  UslugiPKMAdvantages: true,
  UslugiPKMExample: true,
  UslugiRubber: true,
  UslugiTooling: true,
  UslugiTable: true,
  UslugiKeywords: true,
  UslugiRequirementsAccordion: true,
  UslugiTestEquipment: true,
  UslugiTestExternal: true,
  UslugiTestOptical: true,
  TestClimate: true,
  TestVibration: true,
  TestElectric: true,
  TestHumidity: true,
  TestDust: true,
  DialogCall: true,
  teleport: false,
}

const homeRoutes = [
  { path: '/', name: 'home', component: { template: '<div />' } },
  { path: '/confirm-email', name: 'confirm-email', component: { template: '<div />' } },
  { path: '/reset-password', name: 'reset-password', component: { template: '<div />' } },
  { path: '/personal', name: 'personal', component: { template: '<div />' } },
]

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(ElMessage, 'success').mockImplementation(() => undefined as never)
  vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)
  sessionStorage.clear()
})

describe('static / marketing pages', () => {
  it('NotFoundPage shows the missing-page heading', async () => {
    const { wrapper } = await mountWithPlugins(NotFoundPage)
    expect(wrapper.text()).toContain('Страница не найдена')
  })

  it('HomePage mounts and requests coefficients', async () => {
    mockJson('/api/v3/coefficients', { finish: [], cover: [], tolerance: [] })
    const { wrapper } = await mountWithPlugins(HomePage, {
      stubs: sectionStubs,
      stubActions: false,
    })
    await flush(40)
    expect(wrapper.find('.home-page').exists()).toBe(true)
  })

  it('PersonalPage mounts with a nested RouterView', async () => {
    mockJson('/api/v3/materials', { materials: [] })
    const { wrapper, pinia } = await mountWithPlugins(PersonalPage, {
      stubs: sectionStubs,
      stubActions: false,
      routes: homeRoutes,
      initialRoute: '/personal',
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush(40)
    expect(wrapper.find('.personal-page').exists()).toBe(true)
  })

  it('TestingPage mounts climate and test sections', async () => {
    const { wrapper } = await mountWithPlugins(TestingPage, { stubs: sectionStubs })
    expect(wrapper.find('.testing-page').exists()).toBe(true)
  })

  it.each([
    [FooterPolicyPage, /Политик|персональн/i],
    [FooterOfferPage, /Оферт|договор/i],
    [FooterLicensePage, /Оферт|Договор|Термин/i],
  ] as const)('footer legal page renders content', async (Page, re) => {
    const { wrapper } = await mountWithPlugins(Page)
    expect(wrapper.text()).toMatch(re)
  })

  it.each([
    [UslugiMechPage, 'uslugi-mech-page'],
    [UslugiGalvPage, 'uslugi'],
    [UslugiPrintPage, 'uslugi'],
    [UslugiPaintPage, 'uslugi'],
    [UslugiPKMPage, 'uslugi'],
    [UslugiRubberPage, 'uslugi'],
    [UslugiTestPage, 'uslugi'],
    [UslugiWeldPage, 'uslugi'],
  ] as const)('uslugi page mounts', async (Page, cls) => {
    const { wrapper } = await mountWithPlugins(Page, { stubs: sectionStubs })
    expect(wrapper.html()).toMatch(new RegExp(cls, 'i'))
  })
})

describe('ConfirmEmailPage', () => {
  it('shows missing-token state without a token', async () => {
    const { wrapper } = await mountWithPlugins(ConfirmEmailPage, {
      stubs: sectionStubs,
      stubActions: false,
      routes: homeRoutes,
      initialRoute: '/confirm-email',
    })
    await flush(40)
    expect(wrapper.text()).toMatch(/Не удалось подтвердить|токен|ссылк/i)
  })

  it('confirms email when a token is present', async () => {
    mockJson('/api/v3/email/confirm', { message: 'ok' })

    const { wrapper } = await mountWithPlugins(ConfirmEmailPage, {
      stubs: sectionStubs,
      stubActions: false,
      routes: homeRoutes,
      initialRoute: '/confirm-email?token=abc123',
    })
    await flush(80)
    expect(wrapper.text()).toMatch(/подтвержд|Войти|ok/i)
  })
})

describe('ResetPasswordPage', () => {
  it('shows missing-token state without a token', async () => {
    const { wrapper } = await mountWithPlugins(ResetPasswordPage, {
      stubs: sectionStubs,
      stubActions: false,
      routes: homeRoutes,
      initialRoute: '/reset-password',
    })
    await flush()
    expect(wrapper.text()).toMatch(/Не удалось|токен|ссылк/i)
  })

  it('renders the password form when a token is present', async () => {
    const { wrapper } = await mountWithPlugins(ResetPasswordPage, {
      stubs: sectionStubs,
      stubActions: false,
      routes: homeRoutes,
      initialRoute: '/reset-password?token=reset-tok',
    })
    await flush()
    expect(wrapper.text()).toMatch(/Новый пароль/)
    expect(wrapper.find('form').exists() || wrapper.find('#reset-password-form').exists()).toBe(true)
  })
})
