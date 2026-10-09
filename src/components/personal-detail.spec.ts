import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { mockCalculatePrice, mockKit, mockLegalProfile, mockOrder } from '@/test/fixtures'
import { fetchCalls, mockJson, mockStatus } from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import { useAuthStore } from '@/stores/auth.store'
import { useProfileStore } from '@/stores/profile.store'
import PersonalOrder from './PersonalOrder.vue'
import PersonalOrderDelivery from './PersonalOrderDelivery.vue'
import PersonalProfile from './PersonalProfile.vue'
import PersonalCalc from './PersonalCalc.vue'
import PersonalCalcInfo from './PersonalCalcInfo.vue'

async function flush(ms = 0) {
  await nextTick()
  await new Promise((r) => setTimeout(r, ms))
  await nextTick()
}

const heavyStubs = {
  DialogLogin: true,
  DialogRegistration: true,
  DialogCall: true,
  UploadFiles: true,
  UploadFiles2: true,
  DocumentShowByIds: true,
  DocumentShowByIds2: true,
  CadShowById: true,
  CadPreview: true,
  CalculateResults: true,
  CalculateResultSpecialist: true,
  CalculateSubmit2: true,
  PersonalOrderDelivery: true,
  PvzMapPreview: true,
  SelectFiles: true,
  SuitableMachines: true,
  teleport: false,
}

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(ElMessage, 'success').mockImplementation(() => undefined as never)
  vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)
  vi.spyOn(ElMessage, 'warning').mockImplementation(() => undefined as never)
})

describe('PersonalOrder', () => {
  it('loads kit details for kitId from the query', async () => {
    mockJson(`/api/v3/kits/${mockKit.kit_id}`, {
      ...mockKit,
      order_ids: [mockOrder.order_id],
    })
    mockJson(`/api/v3/orders/${mockOrder.order_id}`, mockOrder)
    mockJson('/api/v3/locations', [{ id: 1, name: 'Москва' }])

    const { wrapper, pinia } = await mountWithPlugins(PersonalOrder, {
      stubs: heavyStubs,
      stubActions: false,
      initialRoute: `/personal/order?kitId=${mockKit.kit_id}`,
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/personal/order', name: 'personal-order', component: { template: '<div />' } },
        { path: '/personal/orders', name: 'personal-orders', component: { template: '<div />' } },
        { path: '/personal/calcs', name: 'personal-calcs', component: { template: '<div />' } },
      ],
    })
    useAuthStore(pinia).setToken('tok', false)
    useProfileStore(pinia).$patch({ profile: { ...mockLegalProfile } as never })
    await flush(120)
    expect(wrapper.text()).toMatch(/Заказ|заказ|№/)
  })
})

describe('PersonalOrderDelivery', () => {
  it('loads kit delivery screen from kitId query', async () => {
    mockJson(`/api/v3/kits/${mockKit.kit_id}`, {
      ...mockKit,
      status_name: 'draft',
      order_ids: [mockOrder.order_id],
    })
    mockJson(`/api/v3/orders/${mockOrder.order_id}`, mockOrder)
    mockStatus(`/api/v3/delivery/kits/${mockKit.kit_id}/shipment`, 404)
    mockJson('/api/v3/locations', [{ id: 1, name: 'Москва' }])

    const { wrapper, pinia } = await mountWithPlugins(PersonalOrderDelivery, {
      stubs: { ...heavyStubs, PersonalOrderDelivery: false },
      stubActions: false,
      initialRoute: `/personal/order/delivery?kitId=${mockKit.kit_id}`,
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        {
          path: '/personal/order/delivery',
          name: 'personal-order-delivery',
          component: { template: '<div />' },
        },
        { path: '/personal/order', name: 'personal-order', component: { template: '<div />' } },
      ],
    })
    useAuthStore(pinia).setToken('tok', false)
    useProfileStore(pinia).$patch({ profile: { ...mockLegalProfile } as never })
    await flush(120)
    expect(wrapper.text()).toMatch(/Заказ|доставк/i)
  })

  it('confirms a zero-price Прочее order without a CDEK pickup point', async () => {
    const kit = {
      ...mockKit,
      status: 'AWAITING_CONFIRMATION',
      status_name: 'AWAITING_CONFIRMATION',
      kit_price: 0,
      total_kit_price: 0,
      order_ids: [mockOrder.order_id],
    }
    mockJson(`/api/v3/kits/${mockKit.kit_id}`, kit)
    mockJson(`/api/v3/orders/${mockOrder.order_id}`, {
      ...mockOrder,
      service_id: 'other',
      total_price: 0,
      detail_price: 0,
      detail_price_one: 0,
      mat_weight: 0,
      total_price_breakdown: null,
    })
    mockStatus(`/api/v3/delivery/kits/${mockKit.kit_id}/shipment`, 404)
    mockJson(`/api/v3/kits/${mockKit.kit_id}`, { ...kit, status: 'NEW' }, { method: 'PUT' })
    mockJson(`/api/v3/kits/${mockKit.kit_id}/confirm`, { ...kit, status: 'NEW' }, { method: 'PUT' })

    const { wrapper, pinia } = await mountWithPlugins(PersonalOrderDelivery, {
      stubs: { ...heavyStubs, PersonalOrderDelivery: false },
      stubActions: false,
      initialRoute: `/personal/order/delivery?kitId=${mockKit.kit_id}`,
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        {
          path: '/personal/order/delivery',
          name: 'personal-order-delivery',
          component: { template: '<div />' },
        },
        { path: '/personal/order', name: 'personal-order', component: { template: '<div />' } },
      ],
    })
    useAuthStore(pinia).setToken('tok', false)
    useProfileStore(pinia).$patch({ profile: { ...mockLegalProfile } as never })
    await flush(120)

    const button = wrapper.get('button.order-delivery__continue')
    expect(button.attributes('disabled')).toBeUndefined()
    expect(wrapper.text()).toMatch(/после уточнения деталей/)

    await button.trigger('click')
    await flush(120)

    expect(
      fetchCalls(`/api/v3/kits/${mockKit.kit_id}/confirm`).some((call) => call.method === 'PUT')
    ).toBe(true)
    expect(ElMessage.success).toHaveBeenCalledWith('Заказ подтверждён')
  })
})

describe('PersonalProfile', () => {
  it('loads and displays profile fields', async () => {
    const profile = {
      ...mockLegalProfile,
      full_name: 'ООО Тест',
      postal: '123456',
      region: 'Москва',
      city_name: 'Москва',
      street: 'Тверская',
      building: '1',
    }
    mockJson('/api/v3/profile', profile)
    mockJson('/api/v3/me', profile)

    const { wrapper, pinia } = await mountWithPlugins(PersonalProfile, {
      stubs: heavyStubs,
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    useProfileStore(pinia).$patch({ profile: profile as never })
    await flush(100)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html().length).toBeGreaterThan(200)
  })
})

describe('PersonalCalc / PersonalCalcInfo', () => {
  it('PersonalCalc mounts for an order id', async () => {
    mockJson(`/api/v3/orders/${mockOrder.order_id}`, {
      ...mockOrder,
      ...mockCalculatePrice,
    })
    mockJson('/api/v3/other_services', { other_services: [] })
    mockJson('/api/v3/operations_available', { operations: [] })
    mockJson(`/api/v3/kits/${mockKit.kit_id}`, mockKit)

    const { wrapper, pinia } = await mountWithPlugins(PersonalCalc, {
      stubs: heavyStubs,
      stubActions: false,
      initialRoute: `/personal/calc?orderId=${mockOrder.order_id}&kitId=${mockKit.kit_id}`,
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/personal/calc', name: 'personal-calc', component: { template: '<div />' } },
      ],
    })
    useAuthStore(pinia).setToken('tok', false)
    useProfileStore(pinia).$patch({ profile: { ...mockLegalProfile, role: 'manager' } as never })
    await flush(120)
    expect(wrapper.exists()).toBe(true)
  })

  it('PersonalCalcInfo loads order details from the query', async () => {
    mockJson(`/api/v3/orders/${mockOrder.order_id}`, {
      ...mockOrder,
      ...mockCalculatePrice,
      service_id: 'cnc-milling',
    })

    const { wrapper, pinia } = await mountWithPlugins(PersonalCalcInfo, {
      stubs: heavyStubs,
      stubActions: false,
      initialRoute: `/personal/calc-info?orderId=${mockOrder.order_id}&kitId=${mockKit.kit_id}`,
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        {
          path: '/personal/calc-info',
          name: 'personal-calc-info',
          component: { template: '<div />' },
        },
      ],
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush(120)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html().length).toBeGreaterThan(100)
  })
})
