import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import {
  cachedCalcPages,
  clearCalcPageCache,
  forgetCalcPage,
  isCalcRouteName,
  rememberCalcPage,
} from '@/helpers/calc-page-cache'

/** Mirrors router.ts beforeEach without importing every page component. */
async function createGuardedRouter() {
  const blank = { template: '<div />' }
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: blank },
      { path: '/milling', name: 'milling', component: blank },
      { path: '/personal', name: 'personal', component: blank },
      { path: '/personal/calc-info', name: 'personal-calc-info', component: blank },
      { path: '/personal/orders', name: 'personal-orders', component: blank },
    ],
  })

  router.beforeEach((to, from) => {
    if (isCalcRouteName(from.name) && to.name === 'personal-calc-info') {
      rememberCalcPage(from.name)
    } else if (isCalcRouteName(from.name)) {
      forgetCalcPage(from.name)
    }

    if (from.name === 'personal-calc-info' && !isCalcRouteName(to.name)) {
      clearCalcPageCache()
    }

    if (!to.path.startsWith('/personal')) return
    const authStore = useAuthStore()
    if (!authStore.getToken) {
      return { name: 'home', query: { login: '1' } }
    }
  })

  return router
}

describe('router auth + calc-cache guards', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    clearCalcPageCache()
  })

  it('redirects unauthenticated users away from /personal', async () => {
    const router = await createGuardedRouter()
    await router.push('/personal/orders')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('home')
    expect(router.currentRoute.value.query.login).toBe('1')
  })

  it('allows authenticated access to /personal', async () => {
    useAuthStore().setToken('tok', false)
    const router = await createGuardedRouter()
    await router.push('/personal/orders')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('personal-orders')
  })

  it('remembers a calc page when entering the breakdown', async () => {
    useAuthStore().setToken('tok', false)
    const router = await createGuardedRouter()
    await router.push('/milling')
    await router.push('/personal/calc-info')
    expect(cachedCalcPages.value).toContain('CalculateMillingPage2')
  })

  it('clears the calc cache when leaving the breakdown to a non-calc page', async () => {
    useAuthStore().setToken('tok', false)
    const router = await createGuardedRouter()
    await router.push('/milling')
    await router.push('/personal/calc-info')
    await router.push('/')
    expect(cachedCalcPages.value).toEqual([])
  })
})
