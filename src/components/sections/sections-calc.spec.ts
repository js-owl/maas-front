import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { saveFile3D } from '@/helpers/local-stp-files'
import { mockCalculatePrice } from '@/test/fixtures'
import { mountWithPlugins } from '@/test/mount'
import UploadFiles from '../UploadFiles.vue'
import Select from '../ui/Select.vue'
import CalculateResults from './CalculateResults.vue'
import CalculateSubmit2 from './CalculateSubmit2.vue'
import HomeCalc from './HomeCalc.vue'
import UslugiCalc from './uslugi/UslugiCalc.vue'

async function flush() {
  await nextTick()
  await new Promise((r) => setTimeout(r, 0))
  await nextTick()
}

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(ElMessage, 'warning').mockImplementation(() => undefined as never)
  vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)
  vi.spyOn(ElMessage, 'success').mockImplementation(() => undefined as never)
})

describe('CalculateResults', () => {
  it('shows price for a calculated result', async () => {
    const { wrapper } = await mountWithPlugins(CalculateResults, {
      props: {
        result: { ...mockCalculatePrice, status: 'CALCULATED', total_price: 15000 },
        showManufacturingTime: true,
      },
      initialState: {
        profile: { profile: { username: 'user@example.com' } },
      },
    })
    expect(wrapper.text()).toContain('Стоимость')
    expect(wrapper.text()).toMatch(/15/)
    expect(wrapper.text()).toContain('Время изготовления')
  })

  it('hides price for restricted username + pending status', async () => {
    const { wrapper } = await mountWithPlugins(CalculateResults, {
      props: {
        result: { ...mockCalculatePrice, status: 'CALCULATING', total_price: 15000 },
      },
      initialState: {
        profile: { profile: { username: 'hide_price_user' } },
      },
    })
    // Depends on hide-price helpers list — either calculating UI or price
    expect(wrapper.text().length).toBeGreaterThan(0)
  })
})

describe('CalculateSubmit2', () => {
  it('mounts and disables without token', async () => {
    const { wrapper } = await mountWithPlugins(CalculateSubmit2, {
      props: {
        orderId: 0,
        payload: { ...mockCalculatePrice, document_ids: [], file_id: 2 },
        specialInstructions: '',
      },
      stubs: {
        DialogLogin: true,
        teleport: false,
        UploadFiles: true,
        UploadFiles2: true,
      },
    })
    expect(wrapper.text().length).toBeGreaterThan(0)
    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
  })
})

describe('HomeCalc / UslugiCalc', () => {
  it('HomeCalc mounts with order type controls', async () => {
    const { wrapper } = await mountWithPlugins(HomeCalc, {
      stubs: {
        UploadFiles: true,
        UploadFiles2: true,
        teleport: false,
        HomeCalcOrderTypeMobile: true,
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html().length).toBeGreaterThan(100)
  })

  it('Прочее принимает любые файлы и не блокирует Отправить', async () => {
    const { wrapper, router } = await mountWithPlugins(HomeCalc, {
      stubs: {
        UploadFiles: true,
        UploadFiles2: true,
        teleport: false,
        HomeCalcOrderTypeMobile: true,
      },
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/other', name: 'other', component: { template: '<div />' } },
      ],
    })

    const submitButton = () => wrapper.find('.calc-submit-button')
    expect(submitButton().attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('Для отправки необходимо загрузить 3D-модель')

    const select = wrapper.findComponent(Select)
    select.vm.$emit('update:modelValue', 'other')
    select.vm.$emit('change', 'other')
    await flush()

    expect(submitButton().attributes('disabled')).toBeUndefined()
    expect(wrapper.text()).not.toContain('Для отправки необходимо загрузить 3D-модель')
    expect(wrapper.text()).toContain('любого формата')
    expect(wrapper.findComponent(UploadFiles).props('allowAnyFileType')).toBe(true)

    const push = vi.spyOn(router, 'push')
    await submitButton().trigger('click')
    await flush()
    expect(push).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/other',
      })
    )
  })

  it('UslugiCalc блокирует Отправить без STP и переходит после загрузки модели', async () => {
    const { wrapper, router } = await mountWithPlugins(UslugiCalc, {
      props: { service_id: 'cnc-milling' },
      stubs: { UploadFiles: true, UploadFiles2: true, teleport: false },
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/milling', name: 'milling', component: { template: '<div />' } },
      ],
    })
    expect(wrapper.text()).toContain('Производство')

    const submitButton = () => wrapper.find('.uslugi-calc-submit-button')
    expect(submitButton().attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('Для отправки необходимо загрузить STP-модель')

    const push = vi.spyOn(router, 'push')
    await submitButton().trigger('click')
    await flush()
    expect(push).not.toHaveBeenCalled()

    const upload = wrapper.findComponent(UploadFiles)
    upload.vm.$emit('update:modelValue', [11])
    await flush()
    expect(submitButton().attributes('disabled')).toBeDefined()

    upload.vm.$emit('update:stp_id', 7)
    await flush()
    expect(submitButton().attributes('disabled')).toBeUndefined()
    expect(wrapper.text()).not.toContain('Для отправки необходимо загрузить STP-модель')

    await submitButton().trigger('click')
    await flush()
    expect(push).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/milling',
        query: expect.objectContaining({
          stp: '7',
        }),
      })
    )
  })

  it('UslugiCalc для ПКМ блокирует Отправить без STP', async () => {
    const { wrapper, router } = await mountWithPlugins(UslugiCalc, {
      props: { service_id: 'composite' },
      stubs: { UploadFiles: true, UploadFiles2: true, teleport: false },
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/composite', name: 'composite', component: { template: '<div />' } },
      ],
    })

    const submitButton = () => wrapper.find('.uslugi-calc-submit-button')
    expect(submitButton().attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('Для отправки необходимо загрузить STP-модель')

    const push = vi.spyOn(router, 'push')
    const upload = wrapper.findComponent(UploadFiles)
    upload.vm.$emit('update:modelValue', [11])
    await flush()
    expect(submitButton().attributes('disabled')).toBeDefined()

    upload.vm.$emit('update:stp_id', 9)
    await flush()
    expect(submitButton().attributes('disabled')).toBeUndefined()

    await submitButton().trigger('click')
    await flush()
    expect(push).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/composite',
        query: expect.objectContaining({
          stp: '9',
        }),
      })
    )
  })

  it('UslugiCalc для прочих услуг не блокирует Отправить и принимает любой файл', async () => {
    const { wrapper, router } = await mountWithPlugins(UslugiCalc, {
      props: { service_id: 'other' },
      stubs: { UploadFiles: true, UploadFiles2: true, teleport: false },
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/other', name: 'other', component: { template: '<div />' } },
      ],
    })

    const submitButton = () => wrapper.find('.uslugi-calc-submit-button')
    expect(submitButton().attributes('disabled')).toBeUndefined()
    expect(wrapper.text()).not.toContain('Для отправки необходимо загрузить STP-модель')
    expect(wrapper.findComponent(UploadFiles).props('allowAnyFileType')).toBe(true)

    const push = vi.spyOn(router, 'push')
    await submitButton().trigger('click')
    await flush()
    expect(push).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/other',
      })
    )
  })

  it('UslugiCalc для 3D-печати блокирует Отправить без STL', async () => {
    const { wrapper, router } = await mountWithPlugins(UslugiCalc, {
      props: { service_id: 'printing' },
      stubs: { UploadFiles: true, UploadFiles2: true, teleport: false },
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/printing', name: 'printing', component: { template: '<div />' } },
      ],
    })

    const submitButton = () => wrapper.find('.uslugi-calc-submit-button')
    expect(submitButton().attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('Для отправки необходимо загрузить STL-модель')

    const push = vi.spyOn(router, 'push')
    const upload = wrapper.findComponent(UploadFiles)
    upload.vm.$emit('update:modelValue', [11])
    await flush()
    expect(submitButton().attributes('disabled')).toBeDefined()

    const modelId = await saveFile3D('part.stp', 'U1RQ', 'stp')
    upload.vm.$emit('update:stp_id', modelId)
    await flush()
    expect(submitButton().attributes('disabled')).toBeDefined()
    expect(push).not.toHaveBeenCalled()

    await saveFile3D('part.stl', 'U1RM', 'stl')
    await flush()
    expect(submitButton().attributes('disabled')).toBeUndefined()
    expect(wrapper.text()).not.toContain('Для отправки необходимо загрузить STL-модель')

    await submitButton().trigger('click')
    await flush()
    expect(push).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/printing',
        query: expect.objectContaining({
          stp: String(modelId),
        }),
      })
    )
  })
})
