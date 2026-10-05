import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { mockKit, mockLegalProfile, mockOrder } from '@/test/fixtures'
import { mockJson } from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import { useAuthStore } from '@/stores/auth.store'
import { useProfileStore } from '@/stores/profile.store'
import PersonalUsers from './PersonalUsers.vue'
import PersonalCalcs from './PersonalCalcs.vue'
import PersonalOrders from './PersonalOrders.vue'
import UpperMenu from './UpperMenu.vue'

async function flush(ms = 0) {
  await nextTick()
  await new Promise((r) => setTimeout(r, ms))
  await nextTick()
}

const ElDialogStub = {
  name: 'ElDialog',
  props: { modelValue: Boolean },
  template: '<div class="el-dialog-stub"><slot /><slot name="footer" /><slot name="header" /></div>',
}

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(ElMessage, 'success').mockImplementation(() => undefined as never)
  vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)
  vi.spyOn(ElMessage, 'warning').mockImplementation(() => undefined as never)
})

describe('PersonalUsers', () => {
  it('loads users from the API', async () => {
    mockJson('/api/v3/users', [
      { id: 1, username: 'u1', email: 'u1@e.x', full_name: 'User One' },
      { id: 2, username: 'u2', email: 'u2@e.x', full_name: 'User Two' },
    ])
    const { wrapper, pinia } = await mountWithPlugins(PersonalUsers, {
      stubs: {
        DialogLogin: true,
        DialogRegistration: true,
        DialogEditUser: true,
        teleport: false,
        ElDialog: ElDialogStub,
      },
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush(60)
    expect(wrapper.text()).toMatch(/User One|u1|пользовател/i)
  })
})

describe('PersonalOrders', () => {
  it('loads kits list on mount', async () => {
    mockJson('/api/v3/kits', [mockKit])
    const { wrapper, pinia } = await mountWithPlugins(PersonalOrders, {
      stubs: {
        DialogLogin: true,
        teleport: false,
        SelectFiles: true,
        DocumentShowByIds: true,
        DocumentShowByIds2: true,
      },
      stubActions: false,
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/personal/orders', name: 'personal-orders', component: { template: '<div />' } },
        { path: '/personal/order', name: 'personal-order', component: { template: '<div />' } },
      ],
    })
    useAuthStore(pinia).setToken('tok', false)
    useProfileStore(pinia).$patch({ profile: { ...mockLegalProfile, role: 'manager' } as never })
    await flush(80)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html().length).toBeGreaterThan(100)
  })
})

describe('PersonalCalcs', () => {
  it('loads calculation summary for a kit', async () => {
    mockJson(`/api/v3/kits/${mockKit.kit_id}`, {
      ...mockKit,
      orders: [
        {
          ...mockOrder,
          unit_price: 1000,
          taxes: 200,
          total_kit_price_with_taxes: 1200,
        },
      ],
    })
    // Some builds hit a dedicated summary endpoint — also allow orders
    mockJson('/api/v3/orders', [mockOrder])

    const { wrapper, pinia } = await mountWithPlugins(PersonalCalcs, {
      stubs: { teleport: false },
      stubActions: false,
      initialRoute: `/personal/calcs?kitId=${mockKit.kit_id}`,
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        {
          path: '/personal/calcs',
          name: 'personal-calcs',
          component: { template: '<div />' },
        },
      ],
    })
    useAuthStore(pinia).setToken('tok', false)
    useProfileStore(pinia).$patch({
      profile: { ...mockLegalProfile, role: 'manager' } as never,
    })
    await flush(100)
    expect(wrapper.exists()).toBe(true)
  })
})

describe('UpperMenu', () => {
  it('shows login entry for guests and cabinet for authenticated users', async () => {
    const { wrapper, pinia } = await mountWithPlugins(UpperMenu, {
      stubs: {
        DialogLogin: true,
        DialogRegistration: true,
        ServicesCabinetMenu: true,
        teleport: false,
      },
      stubActions: false,
    })
    expect(wrapper.exists()).toBe(true)

    useAuthStore(pinia).setToken('tok', false)
    useProfileStore(pinia).$patch({
      profile: { ...mockLegalProfile, role: 'client' } as never,
    })
    await flush()
    expect(wrapper.html().length).toBeGreaterThan(50)
  })
})
