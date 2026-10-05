import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { cachedCalcPages, clearCalcPageCache } from '@/helpers/calc-page-cache'

const { pageStub } = vi.hoisted(() => ({
  pageStub: (name: string) => ({ default: { name, render: () => null } }),
}))

vi.mock('@/pages/HomePage.vue', () => pageStub('HomePage'))
vi.mock('@/pages/NotFoundPage.vue', () => pageStub('NotFoundPage'))
vi.mock('@/pages/UslugiMechPage.vue', () => pageStub('UslugiMechPage'))
vi.mock('@/pages/UslugiPrintPage.vue', () => pageStub('UslugiPrintPage'))
vi.mock('@/pages/UslugiPKMPage.vue', () => pageStub('UslugiPKMPage'))
vi.mock('@/pages/UslugiPaintPage.vue', () => pageStub('UslugiPaintPage'))
vi.mock('@/pages/UslugiTestPage.vue', () => pageStub('UslugiTestPage'))
vi.mock('@/pages/TestingPage.vue', () => pageStub('TestingPage'))
vi.mock('@/pages/UslugiGalvPage.vue', () => pageStub('UslugiGalvPage'))
vi.mock('@/pages/UslugiWeldPage.vue', () => pageStub('UslugiWeldPage'))
vi.mock('@/pages/UslugiRubberPage.vue', () => pageStub('UslugiRubberPage'))
vi.mock('@/pages/CalculateOtherPage2.vue', () => pageStub('CalculateOtherPage2'))
vi.mock('@/pages/CalculateMillingPage2.vue', () => pageStub('CalculateMillingPage2'))
vi.mock('@/pages/CalculateCompositePage.vue', () => pageStub('CalculateCompositePage'))
vi.mock('@/pages/CalculateGalvanicPage.vue', () => pageStub('CalculateGalvanicPage'))
vi.mock('@/pages/CalculatePrintingPage2.vue', () => pageStub('CalculatePrintingPage2'))
vi.mock('@/pages/PersonalPage.vue', () => pageStub('PersonalPage'))
vi.mock('@/components/PersonalProfile.vue', () => pageStub('PersonalProfile'))
vi.mock('@/components/PersonalOrders.vue', () => pageStub('PersonalOrders'))
vi.mock('@/components/PersonalOrder.vue', () => pageStub('PersonalOrder'))
vi.mock('@/components/PersonalOrderDelivery.vue', () => pageStub('PersonalOrderDelivery'))
vi.mock('@/components/PersonalCalcs.vue', () => pageStub('PersonalCalcs'))
vi.mock('@/components/PersonalCalcInfo.vue', () => pageStub('PersonalCalcInfo'))
vi.mock('@/components/PersonalCalc.vue', () => pageStub('PersonalCalc'))
vi.mock('@/components/PersonalUsers.vue', () => pageStub('PersonalUsers'))
vi.mock('@/pages/FooterLicensePage.vue', () => pageStub('FooterLicensePage'))
vi.mock('@/pages/FooterOfferPage.vue', () => pageStub('FooterOfferPage'))
vi.mock('@/pages/FooterPolicyPage.vue', () => pageStub('FooterPolicyPage'))
vi.mock('@/pages/ConfirmEmailPage.vue', () => pageStub('ConfirmEmailPage'))
vi.mock('@/pages/ResetPasswordPage.vue', () => pageStub('ResetPasswordPage'))

const { default: router } = await import('@/router')

const login = () => useAuthStore().setToken('tok', false)

beforeEach(async () => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  setActivePinia(createPinia())
  await router.push('/')
  clearCalcPageCache()
})

describe('route table', () => {
  it('resolves every lazily loaded route component', async () => {
    const loaders = router
      .getRoutes()
      .flatMap((record) => Object.values(record.components ?? {}))
      .filter((component): component is () => Promise<{ default: unknown }> =>
        typeof component === 'function'
      )

    expect(loaders.length).toBeGreaterThan(20)
    const modules = await Promise.all(loaders.map((load) => load()))
    expect(modules.every((mod) => mod.default)).toBe(true)
  })

  it('falls back to not-found for unknown paths', async () => {
    await router.push('/definitely/missing')
    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it.each([
    ['/milling2', '/milling'],
    ['/printing2', '/printing'],
    ['/other2', '/other'],
    ['/machining2', '/other'],
  ])('redirects legacy %s to %s keeping the query', async (from, to) => {
    await router.push(`${from}?files=5`)
    expect(router.currentRoute.value.path).toBe(to)
    expect(router.currentRoute.value.query.files).toBe('5')
  })
})

describe('auth guard', () => {
  it('sends guests from /personal to the login dialog on home', async () => {
    await router.push('/personal/orders')
    expect(router.currentRoute.value.name).toBe('home')
    expect(router.currentRoute.value.query.login).toBe('1')
  })

  it('lets authenticated users into /personal and opens the profile by default', async () => {
    login()
    await router.push('/personal')
    expect(router.currentRoute.value.name).toBe('personal-profile')
  })
})

describe('calc page keep-alive cache', () => {
  it('keeps the calculator alive while the breakdown is open', async () => {
    login()
    await router.push('/milling')
    await router.push('/personal/calc-info')
    expect(cachedCalcPages.value).toEqual(['CalculateMillingPage2'])

    await router.push('/milling')
    expect(cachedCalcPages.value).toEqual(['CalculateMillingPage2'])
  })

  it('forgets the calculator when leaving it for a non-breakdown page', async () => {
    login()
    await router.push('/milling')
    await router.push('/personal/calc-info')
    await router.push('/milling')
    await router.push('/print')
    expect(cachedCalcPages.value).toEqual([])
  })

  it('clears the cache when the breakdown is left for a non-calc page', async () => {
    login()
    await router.push('/printing')
    await router.push('/personal/calc-info')
    await router.push('/personal/orders')
    expect(cachedCalcPages.value).toEqual([])
  })
})

describe('scrollBehavior', () => {
  const scroll = router.options.scrollBehavior!
  const route = (hash = '') => ({ hash }) as RouteLocationNormalized

  it('restores the saved position on back/forward', () => {
    expect(scroll(route(), route(), { left: 0, top: 300 })).toEqual({ left: 0, top: 300 })
  })

  it('scrolls to the anchor when the target has a hash', () => {
    expect(scroll(route('#faq'), route(), null)).toEqual({ el: '#faq', top: 0, behavior: 'smooth' })
  })

  it('scrolls to the top otherwise', () => {
    expect(scroll(route(), route(), null)).toEqual({ left: 0, top: 0, behavior: 'smooth' })
  })
})
