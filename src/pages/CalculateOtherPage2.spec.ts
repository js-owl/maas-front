import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, type Component } from 'vue'
import { ElMessage } from 'element-plus'
import { mockCalculatePrice, mockMaterials, mockOrder, mockOtherServices } from '@/test/fixtures'
import {
  fetchCalls,
  lastFetchBody,
  mockJson,
  mockNetworkError,
  mockRoute,
  mockStatus,
} from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import { LOCAL_STP_FILE_ID, saveFile3D } from '@/helpers/local-stp-files'
import CalculateOtherPage2 from './CalculateOtherPage2.vue'
import Input from '@/components/ui/Input.vue'
import SelectCalc from '@/components/ui/SelectCalc.vue'
import CoefficientCover2 from '@/components/coefficients/CoefficientCover2.vue'
import CoefficientOtk2 from '@/components/coefficients/CoefficientOtk2.vue'
import SuitableMachines from '@/components/SuitableMachines.vue'
import CalculateResultSpecialist from '@/components/sections/CalculateResultSpecialist.vue'
import CalculateSubmit2 from '@/components/sections/CalculateSubmit2.vue'
import UploadFiles2 from '@/components/UploadFiles2.vue'
import DocumentShowByIds2 from '@/components/DocumentShowByIds2.vue'

type Body = Record<string, unknown>

const CALC = '/calculate-price'

/** Loader stub that renders its slot and exposes the `loading` prop. */
const LoaderStub = defineComponent({
  name: 'Loader',
  props: { loading: Boolean, text: String },
  setup(props, { slots }) {
    return () => h('div', { class: 'loader', 'data-loading': String(props.loading) }, slots.default?.())
  },
})

const stubs: Record<string, Component | boolean> = {
  Loader: LoaderStub,
  UploadFiles2: true,
  DocumentShowByIds2: true,
  CalculateResultSpecialist: true,
  CalculateSubmit2: true,
  SuitableMachines: true,
  CoefficientOtk2: true,
  CoefficientCover2: true,
  Input: true,
  SelectCalc: true,
}

const routes = [
  { path: '/', name: 'home', component: { template: '<div />' } },
  { path: '/other', name: 'other', component: { template: '<div />' } },
]

const services = [
  { id: '1', label: 'Лазерная резка', service: 'laser' },
  { id: '2', label: 'Гибка', service: 'bending' },
]

function mockDefaults() {
  mockJson(CALC, mockCalculatePrice, { method: 'POST' })
  mockJson('/materials', mockMaterials)
  mockJson('/other_services', mockOtherServices)
}

/** Lets pending promises and the 1s minimum-loader timers complete. */
async function settle() {
  for (let i = 0; i < 3; i++) await vi.advanceTimersByTimeAsync(1100)
}

type MountOpts = { query?: string; state?: Record<string, unknown> }

async function mountPage(opts: MountOpts = {}) {
  const { wrapper } = await mountWithPlugins(CalculateOtherPage2, {
    stubs,
    stubActions: false,
    routes,
    initialRoute: `/other${opts.query ?? ''}`,
    initialState: opts.state,
  })
  await settle()
  return wrapper
}

type Wrapper = Awaited<ReturnType<typeof mountPage>>

const calcCalls = () => fetchCalls(CALC)
const lastBody = () => lastFetchBody<Body>(CALC) as Body
const isLoading = (w: Wrapper) => w.find('.loader').attributes('data-loading') === 'true'
const submit = (w: Wrapper, index = 0) => w.findAllComponents(CalculateSubmit2)[index]
const selects = (w: Wrapper) => w.findAllComponents(SelectCalc)
const quantityInput = (w: Wrapper) => w.findComponent(Input)
const docs = (w: Wrapper) => w.findAllComponents(DocumentShowByIds2)
const uploads = (w: Wrapper) => w.findAllComponents(UploadFiles2)
const submitPayload = (w: Wrapper) => submit(w).props('payload') as unknown as Body

const managerState = { user: { profile: { username: 'boss', role: 'manager' } } }
const adminState = { user: { profile: { username: 'admin', role: 'user' } } }

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
  vi.setSystemTime(new Date('2026-03-10T09:00:00.000Z'))
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)
  mockDefaults()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('CalculateOtherPage2 bootstrap', () => {
  it('loads materials and processes, then prices the defaults once', async () => {
    const wrapper = await mountPage()

    const materialsCall = fetchCalls('/materials')[0]
    expect(materialsCall.method).toBe('GET')
    expect(materialsCall.url).toContain('/materials?process=cnc-milling')
    expect(fetchCalls('/other_services')[0].method).toBe('GET')
    expect(fetchCalls('/orders/')).toHaveLength(0)

    expect(calcCalls()).toHaveLength(1)
    expect(calcCalls()[0].method).toBe('POST')
    const body = lastBody()
    expect(body).toMatchObject({
      service_id: 'cnc-milling',
      quantity: 1,
      length: 120,
      width: 30,
      height: 30,
      material_id: '1',
      material_form: 'sheet',
      tolerance_id: '4',
      finish_id: '3',
      cover_id: ['1'],
      n_dimensions: 55,
      k_otk: '1.0',
      k_cert: ['a', 'f'],
    })
    expect(body).not.toHaveProperty('file_id')
    expect(body).not.toHaveProperty('file_data')
    expect(new Date(body.deadline as string).toISOString()).toBe(body.deadline)
    expect(new Date(body.deadline as string).getTime()).toBeGreaterThanOrEqual(
      new Date('2026-03-10T09:00:00.000Z').getTime()
    )

    expect(selects(wrapper)[0].props('inputData')).toEqual([
      { value: '1', label: mockMaterials.materials[0].label },
      { value: '2', label: mockMaterials.materials[1].label },
    ])
    expect(selects(wrapper)[0].props('modelValue')).toBe('1')
    expect(selects(wrapper)[1].props('inputData')).toEqual([
      { value: 'cnc-milling', label: mockOtherServices.other_services[0].label },
    ])
    expect(selects(wrapper)[1].props('modelValue')).toBe('cnc-milling')
    expect(submit(wrapper).props('lastResult')).toEqual(mockCalculatePrice)
    expect(submit(wrapper).props('orderId')).toBe(0)
    expect(wrapper.findComponent(CalculateResultSpecialist).exists()).toBe(true)
    expect(isLoading(wrapper)).toBe(false)
  })

  it('selects no file when neither orderId nor query is given', async () => {
    const wrapper = await mountPage()

    expect(docs(wrapper)[0].props('modelValue')).toEqual([])
    expect(docs(wrapper)[0].props('stp_id')).toBeUndefined()
    expect(submitPayload(wrapper).document_ids).toEqual([])
    expect(submitPayload(wrapper).file_id).toBeUndefined()
  })

  it('keeps the loader on for at least one second while bootstrapping', async () => {
    const { wrapper } = await mountWithPlugins(CalculateOtherPage2, {
      stubs,
      stubActions: false,
      routes,
      initialRoute: '/other',
    })
    expect(isLoading(wrapper)).toBe(true)
    await vi.advanceTimersByTimeAsync(500)
    expect(isLoading(wrapper)).toBe(true)
    await settle()
    expect(isLoading(wrapper)).toBe(false)
  })

  it('takes document ids from ?files= without selecting a model', async () => {
    const wrapper = await mountPage({ query: '?files=10,11' })

    expect(docs(wrapper)[0].props('modelValue')).toEqual([10, 11])
    expect(uploads(wrapper)[0].props('modelValue')).toEqual([10, 11])
    expect(submitPayload(wrapper).document_ids).toEqual([10, 11])
    expect(lastBody()).not.toHaveProperty('file_id')
  })

  it('takes the model id from ?stp= when ?files= is present', async () => {
    const wrapper = await mountPage({ query: '?files=10&stp=7' })

    expect(docs(wrapper)[0].props('stp_id')).toBe(7)
    expect(submitPayload(wrapper).file_id).toBe(7)
    expect(submitPayload(wrapper).document_ids).toEqual([10])
    expect(lastBody().file_id).toBe(7)
  })

  it('ignores ?stp= without ?files= and ?files= without valid ids', async () => {
    const wrapper = await mountPage({ query: '?stp=7' })
    expect(docs(wrapper)[0].props('stp_id')).toBeUndefined()
    expect(lastBody()).not.toHaveProperty('file_id')
    wrapper.unmount()

    const second = await mountPage({ query: '?files=abc' })
    expect(docs(second)[0].props('modelValue')).toEqual([])
    expect(lastBody()).not.toHaveProperty('file_id')
  })

  it('sends a locally stored model as file_data instead of file_id', async () => {
    await saveFile3D('part.stp', 'QUJD', 'stp')

    const wrapper = await mountPage({ query: `?files=1&stp=${LOCAL_STP_FILE_ID}` })

    const body = lastBody()
    expect(body).toMatchObject({ file_type: 'stp', file_name: 'part.stp', file_data: 'QUJD' })
    expect(body).not.toHaveProperty('file_id')
    expect(docs(wrapper)[0].props('stp_id')).toBe(LOCAL_STP_FILE_ID)
  })

  it('does not recalculate for changes made while bootstrapping', async () => {
    const { wrapper } = await mountWithPlugins(CalculateOtherPage2, {
      stubs,
      stubActions: false,
      routes,
      initialRoute: '/other',
    })
    quantityInput(wrapper).vm.$emit('update:modelValue', '9')
    await settle()

    expect(calcCalls()).toHaveLength(1)
    expect(submitPayload(wrapper).quantity).toBe(9)
  })
})

describe('CalculateOtherPage2 ?orderId=', () => {
  const fullOrder = {
    ...mockCalculatePrice,
    order_id: 7,
    order_name: 'Заказ 7',
    order_code: '3000.777',
    file_id: 9,
    document_ids: [3, 4],
    length: 200,
    width: 40,
    height: 50,
    quantity: 4,
    service_id: 'laser',
    material_id: '2',
    material_form: 'bar',
    tolerance_id: '1',
    finish_id: '2',
    cover_id: ['2', '3'],
    n_dimensions: 70,
    k_otk: '1.5',
    k_cert: ['b'],
    deadline: '2026-05-01T00:00:00.000Z',
    special_instructions: 'Покрасить',
    total_price: 4242,
  }

  it('fills every field and the payload from the order', async () => {
    mockJson('/orders/7', fullOrder)
    mockJson('/other_services', { other_services: services })

    const wrapper = await mountPage({ query: '?orderId=7' })

    expect(fetchCalls('/orders/7')[0].method).toBe('GET')
    expect(calcCalls()).toHaveLength(1)
    expect(lastBody()).toMatchObject({
      service_id: 'laser',
      file_id: 9,
      quantity: 4,
      length: 200,
      width: 40,
      height: 50,
      material_id: '2',
      material_form: 'bar',
      tolerance_id: '1',
      finish_id: '2',
      cover_id: ['2', '3'],
      n_dimensions: 70,
      k_otk: '1.5',
      k_cert: ['b'],
      deadline: '2026-05-01T00:00:00.000Z',
    })
    expect(submitPayload(wrapper)).toMatchObject({
      order_name: 'Заказ 7',
      order_code: '3000.777',
      document_ids: [3, 4],
      file_id: 9,
      quantity: 4,
    })
    expect(submit(wrapper).props('orderId')).toBe(7)
    expect(submit(wrapper).props('specialInstructions')).toBe('Покрасить')
    expect(wrapper.find('textarea').element.value).toBe('Покрасить')
    expect(quantityInput(wrapper).props('modelValue')).toBe('4')
    expect(selects(wrapper)[0].props('modelValue')).toBe('2')
    expect(selects(wrapper)[1].props('modelValue')).toBe('laser')
    expect(wrapper.findComponent(CoefficientCover2).props('modelValue')).toEqual(['2', '3'])
    expect(wrapper.findComponent(CoefficientOtk2).props('modelValue')).toBe('1.5')
    expect(docs(wrapper)[0].props('modelValue')).toEqual([3, 4])
  })

  it('wraps a scalar cover_id in an array', async () => {
    mockJson('/orders/7', { ...fullOrder, cover_id: '3' })

    const wrapper = await mountPage({ query: '?orderId=7' })

    expect(lastBody().cover_id).toEqual(['3'])
    expect(wrapper.findComponent(CoefficientCover2).props('modelValue')).toEqual(['3'])
  })

  it('keeps defaults for fields the order does not have', async () => {
    mockJson('/orders/7', {})

    const wrapper = await mountPage({ query: '?orderId=7' })

    const body = lastBody()
    expect(body).toMatchObject({
      service_id: 'cnc-milling',
      quantity: 1,
      length: 120,
      width: 30,
      height: 30,
      material_form: 'sheet',
      tolerance_id: '4',
      finish_id: '3',
      cover_id: ['1'],
      n_dimensions: 55,
      k_otk: '1.0',
      k_cert: ['a', 'f'],
      // a material missing from the order falls back to the first loaded one
      material_id: '1',
    })
    expect(body).not.toHaveProperty('file_id')
    expect(body).not.toHaveProperty('deadline')
    expect(submitPayload(wrapper).order_code).toBe('3000.000.001')
    expect(submitPayload(wrapper).order_name).toBe('')
    expect(wrapper.find('textarea').element.value).toBe('')
  })

  it('derives the deadline from manufacturing_cycle when the order has none', async () => {
    mockJson('/orders/101', mockOrder)

    await mountPage({ query: '?orderId=101' })

    const now = new Date('2026-03-10T09:00:00.000Z')
    const expected = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() + 5 * 86400000
    expect(lastBody().deadline).toBe(new Date(expected).toISOString())
    expect(lastBody()).toMatchObject({ quantity: 8 })
    expect(lastBody()).not.toHaveProperty('file_id')
  })

  it('does not apply ?files= of the query to an existing order', async () => {
    mockJson('/orders/7', fullOrder)

    const wrapper = await mountPage({ query: '?orderId=7&files=99&stp=98' })

    expect(docs(wrapper)[0].props('modelValue')).toEqual([3, 4])
    expect(lastBody().file_id).toBe(9)
  })

  it('logs the error and still calculates when the order cannot be loaded', async () => {
    mockStatus('/orders/7', 404)

    const wrapper = await mountPage({ query: '?orderId=7' })

    expect(console.error).toHaveBeenCalled()
    expect(calcCalls()).toHaveLength(1)
    expect(lastBody()).toMatchObject({ quantity: 1, material_id: '1' })
    expect(isLoading(wrapper)).toBe(false)
  })

  it('logs the error when the order body is not valid JSON', async () => {
    mockRoute('/orders/7', () => new Response('<html>', { status: 200 }))

    await mountPage({ query: '?orderId=7' })

    expect(console.error).toHaveBeenCalled()
    expect(calcCalls()).toHaveLength(1)
  })
})

describe('CalculateOtherPage2 loadMaterials', () => {
  it('falls back to built-in materials when the response is malformed', async () => {
    mockJson('/materials', { unexpected: true })

    const wrapper = await mountPage()

    expect(console.error).toHaveBeenCalledWith('Error loading materials:', expect.any(TypeError))
    expect(selects(wrapper)[0].props('inputData')).toEqual([
      { value: 'alum_D16T', label: 'Алюминий Д16Т' },
      { value: 'steel_12X18H10T', label: 'Сталь 12Х18Н10Т' },
    ])
    expect(lastBody().material_id).toBe('alum_D16T')
  })

  it('falls back to built-in materials when the body is not JSON', async () => {
    mockRoute('/materials', () => new Response('oops', { status: 200 }))

    await mountPage()

    expect(lastBody().material_id).toBe('alum_D16T')
  })

  it('leaves the material empty when the request fails with an http error', async () => {
    mockStatus('/materials', 404)

    const wrapper = await mountPage()

    expect(selects(wrapper)[0].props('inputData')).toEqual([])
    expect(lastBody().material_id).toBe('')
  })

  it('shows an error message on a transport failure and leaves the list empty', async () => {
    mockNetworkError('/materials')

    const wrapper = await mountPage()

    expect(ElMessage.error).toHaveBeenCalled()
    expect(selects(wrapper)[0].props('inputData')).toEqual([])
    expect(lastBody().material_id).toBe('')
  })

  it('leaves the material empty when the backend returns no materials', async () => {
    mockJson('/materials', { materials: [] })

    await mountPage()

    expect(lastBody().material_id).toBe('')
  })

  it('does not replace a material that is already in the list for an existing order', async () => {
    mockJson('/materials', { materials: [{ id: '', label: 'Без материала' }] })
    mockJson('/orders/3', {})

    await mountPage({ query: '?orderId=3' })

    expect(lastBody().material_id).toBe('')
  })

  it('keeps an empty material for an existing order when no materials were loaded', async () => {
    mockStatus('/materials', 500)
    mockJson('/orders/3', {})

    await mountPage({ query: '?orderId=3' })

    expect(lastBody().material_id).toBe('')
  })
})

describe('CalculateOtherPage2 loadProcesses', () => {
  it('accepts a plain array response', async () => {
    mockJson('/other_services', services)

    const wrapper = await mountPage()

    expect(selects(wrapper)[1].props('inputData')).toEqual([
      { value: 'laser', label: 'Лазерная резка' },
      { value: 'bending', label: 'Гибка' },
    ])
  })

  it('selects the first process when the default service is not offered', async () => {
    mockJson('/other_services', { other_services: services })

    const wrapper = await mountPage()

    expect(selects(wrapper)[1].props('modelValue')).toBe('laser')
    expect(lastBody().service_id).toBe('laser')
  })

  it('keeps the default service when the list contains it', async () => {
    mockJson('/other_services', {
      other_services: [...services, { id: '3', label: 'Фрезеровка', service: 'cnc-milling' }],
    })

    const wrapper = await mountPage()

    expect(selects(wrapper)[1].props('modelValue')).toBe('cnc-milling')
    expect(lastBody().service_id).toBe('cnc-milling')
  })

  it.each([
    ['an object without other_services', {}],
    ['a null body', null],
    ['an empty list', { other_services: [] }],
    ['a non-array other_services', { other_services: 'x' }],
  ])('falls back to the default process for %s', async (_name, body) => {
    mockJson('/other_services', body)

    const wrapper = await mountPage()

    expect(selects(wrapper)[1].props('inputData')).toEqual([
      { value: 'cnc-milling', label: 'Механообработка' },
    ])
    expect(lastBody().service_id).toBe('cnc-milling')
  })

  it('falls back to the default process on an http error', async () => {
    mockStatus('/other_services', 404)

    const wrapper = await mountPage()

    expect(selects(wrapper)[1].props('inputData')).toEqual([
      { value: 'cnc-milling', label: 'Механообработка' },
    ])
  })

  it('logs and falls back to the default process when the body is not JSON', async () => {
    mockRoute('/other_services', () => new Response('nope', { status: 200 }))

    const wrapper = await mountPage()

    expect(console.error).toHaveBeenCalledWith('Error loading processes:', expect.any(SyntaxError))
    expect(selects(wrapper)[1].props('inputData')).toEqual([
      { value: 'cnc-milling', label: 'Механообработка' },
    ])
  })
})

describe('CalculateOtherPage2 sendData', () => {
  it('stores the response of /calculate-price as the result', async () => {
    mockJson(CALC, { ...mockCalculatePrice, total_price: 777 }, { method: 'POST' })

    const wrapper = await mountPage()

    expect(submit(wrapper).props('lastResult')).toMatchObject({ total_price: 777 })
    expect(submit(wrapper, 1).props('lastResult')).toMatchObject({ total_price: 777 })
  })

  it('always posts, even without a model', async () => {
    const wrapper = await mountPage()
    quantityInput(wrapper).vm.$emit('update:modelValue', '3')
    await settle()

    expect(calcCalls()).toHaveLength(2)
    expect(lastBody()).not.toHaveProperty('file_id')
    expect(lastBody().quantity).toBe(3)
  })

  it('swallows an unparsable response and logs it', async () => {
    const wrapper = await mountPage()
    mockRoute(CALC, () => new Response('not json', { status: 200 }), { method: 'POST' })

    quantityInput(wrapper).vm.$emit('update:modelValue', '2')
    await settle()

    expect(console.error).toHaveBeenCalledWith({ error: expect.any(SyntaxError) })
    expect(submit(wrapper).props('lastResult')).toEqual(mockCalculatePrice)
    expect(isLoading(wrapper)).toBe(false)
  })

  it('swallows a server error and releases the loader', async () => {
    const wrapper = await mountPage()
    mockStatus(CALC, 500, { detail: 'boom' }, { method: 'POST' })

    quantityInput(wrapper).vm.$emit('update:modelValue', '2')
    await settle()

    expect(ElMessage.error).toHaveBeenCalled()
    expect(calcCalls()).toHaveLength(2)
    expect(isLoading(wrapper)).toBe(false)
  })

  it('finishes bootstrapping even when the first calculation fails', async () => {
    mockStatus(CALC, 500, undefined, { method: 'POST' })
    const wrapper = await mountPage()
    expect(calcCalls()).toHaveLength(1)

    mockJson(CALC, mockCalculatePrice, { method: 'POST' })
    quantityInput(wrapper).vm.$emit('update:modelValue', '4')
    await settle()

    expect(calcCalls()).toHaveLength(2)
    expect(lastBody().quantity).toBe(4)
  })

  it('shows the loader for at least one second after a recalculation', async () => {
    const wrapper = await mountPage()
    expect(isLoading(wrapper)).toBe(false)

    quantityInput(wrapper).vm.$emit('update:modelValue', '5')
    await vi.advanceTimersByTimeAsync(10)
    expect(isLoading(wrapper)).toBe(true)
    await vi.advanceTimersByTimeAsync(600)
    expect(isLoading(wrapper)).toBe(true)
    await vi.advanceTimersByTimeAsync(500)
    expect(isLoading(wrapper)).toBe(false)
  })

  it('keeps the loader while the request is still pending', async () => {
    const wrapper = await mountPage()
    let release: (r: Response) => void = () => {}
    mockRoute(
      CALC,
      () => new Promise<Response>((resolve) => (release = resolve)),
      { method: 'POST' }
    )

    quantityInput(wrapper).vm.$emit('update:modelValue', '5')
    await vi.advanceTimersByTimeAsync(2000)
    expect(isLoading(wrapper)).toBe(true)

    release(new Response(JSON.stringify({ ...mockCalculatePrice, total_price: 1 })))
    await settle()
    expect(isLoading(wrapper)).toBe(false)
    expect(submit(wrapper).props('lastResult')).toMatchObject({ total_price: 1 })
  })
})

describe('CalculateOtherPage2 watchers and interactions', () => {
  it('recalculates when the quantity changes', async () => {
    const wrapper = await mountPage()

    quantityInput(wrapper).vm.$emit('update:modelValue', '12')
    await settle()

    expect(calcCalls()).toHaveLength(2)
    expect(lastBody().quantity).toBe(12)
    expect(quantityInput(wrapper).props('modelValue')).toBe('12')
  })

  it('falls back to quantity 1 for invalid input without recalculating', async () => {
    const wrapper = await mountPage()

    quantityInput(wrapper).vm.$emit('update:modelValue', '-5')
    await settle()
    expect(quantityInput(wrapper).props('modelValue')).toBe('1')
    expect(calcCalls()).toHaveLength(1)
  })

  it('recalculates when the material changes', async () => {
    const wrapper = await mountPage()

    selects(wrapper)[0].vm.$emit('update:modelValue', '2')
    await settle()

    expect(calcCalls()).toHaveLength(2)
    expect(lastBody().material_id).toBe('2')
  })

  it('recalculates when the process changes', async () => {
    mockJson('/other_services', { other_services: services })
    const wrapper = await mountPage()

    selects(wrapper)[1].vm.$emit('update:modelValue', 'bending')
    await settle()

    expect(calcCalls()).toHaveLength(2)
    expect(lastBody().service_id).toBe('bending')
    expect(docs(wrapper)[0].props('service_id')).toBe('bending')
    expect(docs(wrapper)[1].props('service_id')).toBe('bending')
  })

  it('recalculates when the cover changes', async () => {
    const wrapper = await mountPage()

    wrapper.findComponent(CoefficientCover2).vm.$emit('update:modelValue', ['2', '3'])
    await settle()

    expect(calcCalls()).toHaveLength(2)
    expect(lastBody().cover_id).toEqual(['2', '3'])
  })

  it('recalculates when the inspection type changes', async () => {
    const wrapper = await mountPage()

    wrapper.findComponent(CoefficientOtk2).vm.$emit('update:modelValue', '2.0')
    await settle()

    expect(calcCalls()).toHaveLength(2)
    expect(lastBody().k_otk).toBe('2.0')
  })

  it('recalculates when a model is selected through DocumentShowByIds2', async () => {
    const wrapper = await mountPage()

    docs(wrapper)[0].vm.$emit('update:stp_id', 4)
    await settle()

    expect(calcCalls()).toHaveLength(2)
    expect(lastBody().file_id).toBe(4)
    expect(docs(wrapper)[1].props('stp_id')).toBe(4)
    expect(uploads(wrapper)[0].props('stp_id')).toBe(4)
  })

  it('recalculates when UploadFiles2 selects a model', async () => {
    const wrapper = await mountPage()

    uploads(wrapper)[1].vm.$emit('update:stp_id', 5)
    await settle()

    expect(calcCalls()).toHaveLength(2)
    expect(lastBody().file_id).toBe(5)
  })

  it.each([
    ['mobile DocumentShowByIds2', (w: Wrapper) => docs(w)[0]],
    ['desktop DocumentShowByIds2', (w: Wrapper) => docs(w)[1]],
    ['desktop UploadFiles2', (w: Wrapper) => uploads(w)[0]],
    ['mobile UploadFiles2', (w: Wrapper) => uploads(w)[1]],
  ])('syncs document ids and model id from the %s', async (_name, pick) => {
    const wrapper = await mountPage()

    pick(wrapper).vm.$emit('update:modelValue', [8])
    pick(wrapper).vm.$emit('update:stp_id', 3)
    await settle()

    expect(submitPayload(wrapper).document_ids).toEqual([8])
    expect(docs(wrapper).map((d) => d.props('modelValue'))).toEqual([[8], [8]])
    expect(uploads(wrapper).map((u) => u.props('modelValue'))).toEqual([[8], [8]])
    expect(docs(wrapper).map((d) => d.props('stp_id'))).toEqual([3, 3])
    expect(uploads(wrapper).map((u) => u.props('stp_id'))).toEqual([3, 3])
    expect(calcCalls()).toHaveLength(2)
    expect(lastBody().file_id).toBe(3)
  })

  it('shares the uploaded document ids without recalculating', async () => {
    const wrapper = await mountPage()

    uploads(wrapper)[0].vm.$emit('update:modelValue', [5, 6])
    await settle()

    expect(docs(wrapper)[0].props('modelValue')).toEqual([5, 6])
    expect(docs(wrapper)[1].props('modelValue')).toEqual([5, 6])
    expect(uploads(wrapper)[1].props('modelValue')).toEqual([5, 6])
    expect(submitPayload(wrapper).document_ids).toEqual([5, 6])
    expect(calcCalls()).toHaveLength(1)
  })

  it('updates document ids when DocumentShowByIds2 removes a file', async () => {
    const wrapper = await mountPage({ query: '?files=1,2' })

    docs(wrapper)[1].vm.$emit('update:modelValue', [2])
    await settle()

    expect(submitPayload(wrapper).document_ids).toEqual([2])
    expect(calcCalls()).toHaveLength(1)
  })

  it.each([0, 1])('recalculates on the calculate event of DocumentShowByIds2 #%i', async (index) => {
    const wrapper = await mountPage()

    docs(wrapper)[index].vm.$emit('calculate')
    await settle()

    expect(calcCalls()).toHaveLength(2)
    expect(lastBody()).toMatchObject({ quantity: 1, service_id: 'cnc-milling' })
  })

  it('does not recalculate when only the description changes', async () => {
    const wrapper = await mountPage()

    await wrapper.find('textarea').setValue('Нужен чертёж')
    await settle()

    expect(submit(wrapper).props('specialInstructions')).toBe('Нужен чертёж')
    expect(submit(wrapper, 1).props('specialInstructions')).toBe('Нужен чертёж')
    expect(calcCalls()).toHaveLength(1)
  })

  it('passes the current payload to both CalculateSubmit2 instances', async () => {
    const wrapper = await mountPage()
    quantityInput(wrapper).vm.$emit('update:modelValue', '6')
    await settle()

    expect(submitPayload(wrapper)).toMatchObject({ quantity: 6, service_id: 'cnc-milling' })
    expect((submit(wrapper, 1).props('payload') as unknown as Body).quantity).toBe(6)
    expect(submit(wrapper, 1).props('saveLabel')).toBe('Сохранить')
    expect(submit(wrapper, 1).props('hideBackButton')).toBe(true)
    expect(submit(wrapper).props('hideBackButton')).toBe(false)
    expect(submit(wrapper).props('detailingForManager')).toBe(true)
    expect(submit(wrapper, 1).props('detailingForManager')).toBe(true)
  })

  it.each([0, 1])('replaces the result on updateResult from CalculateSubmit2 #%i', async (index) => {
    const wrapper = await mountPage()
    const updated = { ...mockCalculatePrice, total_price: 999, order_id: 55 }

    submit(wrapper, index).vm.$emit('updateResult', updated)
    await settle()

    expect(submit(wrapper, 0).props('lastResult')).toEqual(updated)
    expect(submit(wrapper, 1).props('lastResult')).toEqual(updated)
    expect(calcCalls()).toHaveLength(1)
  })

  it.each([0, 1])('handles showInfo from CalculateSubmit2 #%i without side effects', async (index) => {
    const wrapper = await mountPage()

    submit(wrapper, index).vm.$emit('showInfo')
    await settle()

    expect(calcCalls()).toHaveLength(1)
    expect(wrapper.findComponent(CalculateResultSpecialist).exists()).toBe(true)
  })
})

describe('CalculateOtherPage2 roles', () => {
  it('shows the description field and no machines for a regular user', async () => {
    const wrapper = await mountPage()

    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.findComponent(SuitableMachines).exists()).toBe(false)
  })

  it('hides the description field for a manager', async () => {
    const wrapper = await mountPage({ state: managerState })

    expect(wrapper.find('textarea').exists()).toBe(false)
    expect(wrapper.findComponent(SuitableMachines).exists()).toBe(false)
    expect(submit(wrapper).exists()).toBe(true)
  })

  it('shows the suitable machines of the result to the admin', async () => {
    mockJson(
      CALC,
      { ...mockCalculatePrice, suitable_machines: ['DMG 50', 'Haas VF-2'] },
      { method: 'POST' }
    )

    const wrapper = await mountPage({ state: adminState })

    expect(wrapper.findComponent(SuitableMachines).props('machines')).toEqual(['DMG 50', 'Haas VF-2'])
  })

  it('passes an empty machine list when the result has none', async () => {
    mockJson(CALC, { total_price: 1 }, { method: 'POST' })

    const wrapper = await mountPage({ state: adminState })

    expect(wrapper.findComponent(SuitableMachines).props('machines')).toEqual([])
  })
})
