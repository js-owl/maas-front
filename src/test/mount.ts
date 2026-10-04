/**
 * Component mounting helper that installs the same plugins as main.ts:
 * unhead, vue-router and pinia. Without them any component calling
 * `useHead`, `useRoute` or a store fails at setup time rather than on the
 * behaviour under test.
 */
import { createTestingPinia, type TestingPinia } from '@pinia/testing'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import type { Component } from 'vue'
import {
  createMemoryHistory,
  createRouter,
  type RouteRecordRaw,
  type Router,
} from 'vue-router'
import { vi } from 'vitest'

const blankComponent: Component = { template: '<div />' }

const catchAllRoutes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: blankComponent },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: blankComponent },
]

export type MountWithPluginsOptions = {
  props?: Record<string, unknown>
  slots?: Record<string, unknown>
  attachTo?: Element | string
  /** Extra global component stubs, merged with the ones from setup.ts. */
  stubs?: Record<string, Component | boolean>
  /** Values made available through `provide`/`inject`. */
  provide?: Record<string | symbol, unknown>
  /** Routes for the in-memory router. Defaults to a home + catch-all pair. */
  routes?: RouteRecordRaw[]
  /** Path to navigate to before mounting. */
  initialRoute?: string
  /** Seed store state, e.g. `{ auth: { token: 'x' } }`. */
  initialState?: Record<string, unknown>
  /**
   * When true (the default) store actions are replaced by spies, so tests
   * assert calls instead of mocking every request the action would make.
   * Pass false to run the real action against the fetch mock.
   */
  stubActions?: boolean
}

export type MountWithPluginsResult = {
  wrapper: VueWrapper
  router: Router
  pinia: TestingPinia
}

export async function mountWithPlugins(
  component: Component,
  options: MountWithPluginsOptions = {}
): Promise<MountWithPluginsResult> {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: options.routes ?? catchAllRoutes,
  })

  const pinia = createTestingPinia({
    createSpy: vi.fn,
    stubActions: options.stubActions ?? true,
    initialState: options.initialState ?? {},
  })

  await router.push(options.initialRoute ?? '/')
  await router.isReady()

  const wrapper = mount(component, {
    props: options.props,
    slots: options.slots as never,
    attachTo: options.attachTo,
    global: {
      plugins: [router, pinia, createHead()],
      stubs: options.stubs,
      provide: options.provide,
    },
  }) as VueWrapper

  return { wrapper, router, pinia }
}
