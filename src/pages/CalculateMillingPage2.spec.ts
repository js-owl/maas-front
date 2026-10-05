import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, type Component } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { config } from '@vue/test-utils'
import { ElMessage } from 'element-plus'
import { mockCalculatePrice, mockCoefficients, mockLegalProfile, mockMaterials } from '@/test/fixtures'
import { fetchCalls, mockJson, mockRoute, mockStatus } from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import { clearCoefficientsCache } from '@/components/coefficients/api-coefficients'
import { saveFile3D } from '@/helpers/local-stp-files'
import CalculateMillingPage2 from './CalculateMillingPage2.vue'
import Input from '@/components/ui/Input.vue'
import SelectCalc from '@/components/ui/SelectCalc.vue'
import SelectGroup from '@/components/ui/SelectGroup.vue'
import CoefficientCover2 from '@/components/coefficients/CoefficientCover2.vue'
import CoefficientOtk2 from '@/components/coefficients/CoefficientOtk2.vue'
import CadShowById from '@/components/cad/CadShowById.vue'
import SuitableMachines from '@/components/SuitableMachines.vue'
import CalculateResults from '@/components/sections/CalculateResults.vue'
import CalculateSubmit2 from '@/components/sections/CalculateSubmit2.vue'
import UploadFiles2 from '@/components/UploadFiles2.vue'
import DocumentShowByIds2 from '@/components/DocumentShowByIds2.vue'

type Json = Record<string, unknown>

type PageVm = {
  service_id: string
  cadViewerKey: number
  isInfoVisible: boolean
  isLoading: boolean
  special_instructions: string
}

const LoaderStub = defineComponent({
  name: 'Loader',
  props: { loading: Boolean, text: String },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'loader', 'data-loading': String(props.loading) }, slots.default?.())
  },
})

const ElInputStub = defineComponent({
  name: 'ElInput',
  props: { modelValue: { type: String, default: '' } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('textarea', {
        class: 'special-instructions',
        value: props.modelValue,
        onInput: (event: Event) =>
          emit('update:modelValue', (event.target as HTMLTextAreaElement).value),
      })
  },
})

const PassthroughStub = defineComponent({
  setup(_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const stubs = {
  Loader: LoaderStub,
  UploadFiles2: true,
  DocumentShowByIds2: true,
  CadShowById: true,
  CalculateResults: true,
  CalculateSubmit2: true,
  SuitableMachines: true,
  CoefficientOtk2: true,
  CoefficientCover2: true,
  Input: true,
  SelectCalc: true,
  SelectGroup: true,
}

const routes = [
  { path: '/', name: 'home', component: { template: '<div />' } },
  { path: '/milling', name: 'milling', component: { template: '<div />' } },
]

const FAKE_NOW = new Date(2026, 5, 10, 12, 0, 0)
const startOfDayPlus = (days: number) =>
  new Date(FAKE_NOW.getFullYear(), FAKE_NOW.getMonth(), FAKE_NOW.getDate() + days).toISOString()

const originalGlobalComponents = config.global.components

beforeAll(() => {
  config.global.components = {
    ...originalGlobalComponents,
    ElRow: PassthroughStub,
    ElCol: PassthroughStub,
    ElInput: ElInputStub,
  }
})

afterAll(() => {
  config.global.components = originalGlobalComponents
})

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
  vi.setSystemTime(FAKE_NOW)
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)
  clearCoefficientsCache()
  mockJson('/api/v3/calculate-price', mockCalculatePrice)
  mockJson('/api/v3/coefficients', mockCoefficients)
  mockJson('/api/v3/materials', mockMaterials)
})

afterEach(() => {
  vi.useRealTimers()
})

/** Lets pending requests, IndexedDB hydration and the min-loading timer finish. */
async function settle() {
  for (let i = 0; i < 6; i++) {
    await new Promise<void>((resolve) => setImmediate(resolve))
    await vi.advanceTimersByTimeAsync(1100)
  }
}

async function mountPage(
  path = '/milling',
  options: { initialState?: Record<string, unknown> } = {}
) {
  const { wrapper } = await mountWithPlugins(CalculateMillingPage2, {
    stubs,
    stubActions: false,
    routes,
    initialRoute: path,
    initialState: options.initialState,
  })
  return wrapper
}

async function mountSettled(path = '/milling', options: { initialState?: Record<string, unknown> } = {}) {
  const wrapper = await mountPage(path, options)
  await settle()
  return wrapper
}

const calcCalls = () => fetchCalls('/calculate-price')
const lastCalcBody = () => JSON.parse(calcCalls().at(-1)!.body!) as Json

function emitOn(wrapper: VueWrapper, component: Component, event: string, value?: unknown, index = 0) {
  const target = wrapper.findAllComponents(component)[index]
  if (value === undefined) target.vm.$emit(event)
  else target.vm.$emit(event, value)
}

const pageVm = (wrapper: VueWrapper) => wrapper.vm as unknown as PageVm
const loaderFlag = (wrapper: VueWrapper) => wrapper.find('.loader').attributes('data-loading')

const fullOrder = {
  ...mockCalculatePrice,
  order_id: 55,
  order_name: 'Bracket order',
  order_code: '3000.055.001',
  file_id: 4,
  document_ids: [7, 8],
  length: 200,
  width: 50,
  height: 40,
  quantity: 6,
  material_id: '2',
  material_form: 'rod',
  tolerance_id: '1',
  finish_id: '2',
  cover_id: '3',
  n_dimensions: 77,
  k_otk: '1.2',
  k_cert: ['b'],
  deadline: '2026-07-01T10:00:00.000Z',
  manufacturing_cycle: 0,
  special_instructions: 'Please hurry',
}

describe('CalculateMillingPage2 bootstrap without an order', () => {
  it('shows the loader while bootstrapping and hides it after the minimum time', async () => {
    const wrapper = await mountPage()
    expect(loaderFlag(wrapper)).toBe('true')

    await settle()

    expect(loaderFlag(wrapper)).toBe('false')
    expect(wrapper.find('.loader').text()).toContain('Механическая обработка')
  })

  it('uses default file id 2 and the first material for a new order', async () => {
    const wrapper = await mountSettled()

    expect(calcCalls()).toHaveLength(1)
    expect(calcCalls()[0].method).toBe('POST')
    expect(lastCalcBody()).toMatchObject({
      service_id: 'cnc-milling',
      file_id: 2,
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
    expect(typeof lastCalcBody().deadline).toBe('string')
    expect(fetchCalls('/orders/')).toHaveLength(0)

    const submit = wrapper.findComponent(CalculateSubmit2)
    expect(submit.props('orderId')).toBe(0)
    expect(submit.props('payload')).toMatchObject({ file_id: 2, material_id: '1', quantity: 1 })
    expect(wrapper.findComponent(CalculateResults).props('result')).toMatchObject({
      total_price: 15000,
    })
  })

  it('requests materials for the cnc-milling process and groups them by family', async () => {
    const wrapper = await mountSettled()

    expect(fetchCalls('/materials')[0].url).toContain('/materials?process=cnc-milling')
    const groups = wrapper.findComponent(SelectGroup).props('options') as Array<{
      label: string
      options: Array<{ value: string; label: string }>
    }>
    expect(groups).toHaveLength(2)
    expect(groups.flatMap((g) => g.options.map((o) => o.value)).sort()).toEqual(['1', '2'])
    expect(wrapper.findComponent(SelectGroup).props('modelValue')).toBe('1')
  })

  it('passes loaded finish and tolerance options to the selects', async () => {
    const wrapper = await mountSettled()

    const [finish, tolerance] = wrapper.findAllComponents(SelectCalc)
    expect(finish.props('inputData')).toEqual([
      { value: '1', label: 'Ra 0.8' },
      { value: '2', label: 'Ra 1.6' },
      { value: '3', label: 'Ra 6.3' },
    ])
    expect(tolerance.props('inputData')).toEqual([
      { value: '1', label: 'h7' },
      { value: '4', label: 'h12' },
    ])
    expect(finish.props('modelValue')).toBe('3')
    expect(tolerance.props('modelValue')).toBe('4')
  })

  it('applies ?files and ?stp to document ids and file id', async () => {
    const wrapper = await mountSettled('/milling?files=3,4&stp=7')

    expect(wrapper.findAllComponents(DocumentShowByIds2)[0].props('modelValue')).toEqual([3, 4])
    expect(wrapper.findAllComponents(UploadFiles2)[0].props('modelValue')).toEqual([3, 4])
    expect(wrapper.findComponent(CadShowById).props('modelValue')).toBe(7)
    expect(calcCalls()).toHaveLength(1)
    expect(lastCalcBody()).toMatchObject({ file_id: 7 })
  })

  it('does not calculate and shows a zero-price result when ?files has no ?stp', async () => {
    const wrapper = await mountSettled('/milling?files=3,4')

    expect(wrapper.findAllComponents(DocumentShowByIds2)[0].props('modelValue')).toEqual([3, 4])
    expect(wrapper.findComponent(CadShowById).props('modelValue')).toBeUndefined()
    expect(calcCalls()).toHaveLength(0)
    expect(wrapper.findComponent(CalculateResults).props('result')).toEqual({
      total_price: 0,
      detail_price: 0,
      detail_price_one: 0,
      quantity: 1,
    })
  })

  it('ignores a non-numeric ?stp value', async () => {
    const wrapper = await mountSettled('/milling?files=3&stp=abc')

    expect(wrapper.findComponent(CadShowById).props('modelValue')).toBeUndefined()
    expect(calcCalls()).toHaveLength(0)
  })

  it('keeps document ids empty when ?files holds no valid ids', async () => {
    const wrapper = await mountSettled('/milling?files=x')

    expect(wrapper.findAllComponents(DocumentShowByIds2)[0].props('modelValue')).toEqual([])
    expect(wrapper.findComponent(CadShowById).props('modelValue')).toBeUndefined()
    expect(calcCalls()).toHaveLength(0)
  })
})

describe('CalculateMillingPage2 bootstrap with an order', () => {
  it('loads the order and copies every field into the form and payload', async () => {
    mockJson('/api/v3/orders/55', fullOrder)
    mockJson('/api/v3/calculate-price', { ...mockCalculatePrice, manufacturing_cycle: 0 })

    const wrapper = await mountSettled('/milling?orderId=55')

    const orderCalls = fetchCalls('/orders/55')
    expect(orderCalls).toHaveLength(1)
    expect(orderCalls[0].method).toBe('GET')

    expect(lastCalcBody()).toMatchObject({
      file_id: 4,
      quantity: 6,
      length: 200,
      width: 50,
      height: 40,
      material_id: '2',
      material_form: 'rod',
      tolerance_id: '1',
      finish_id: '2',
      cover_id: ['3'],
      n_dimensions: 77,
      k_otk: '1.2',
      k_cert: ['b'],
      deadline: '2026-07-01T10:00:00.000Z',
    })

    const submit = wrapper.findComponent(CalculateSubmit2)
    expect(submit.props('orderId')).toBe(55)
    expect(submit.props('specialInstructions')).toBe('Please hurry')
    expect(submit.props('payload')).toMatchObject({
      service_id: 'cnc-milling',
      order_name: 'Bracket order',
      order_code: '3000.055.001',
      file_id: 4,
      document_ids: [7, 8],
      quantity: 6,
      material_id: '2',
      cover_id: ['3'],
    })
    expect(wrapper.findComponent(Input).props('modelValue')).toBe('6')
    expect(wrapper.findComponent(SelectGroup).props('modelValue')).toBe('2')
    expect(wrapper.findComponent(CoefficientCover2).props('modelValue')).toEqual(['3'])
    expect(wrapper.findComponent(CoefficientOtk2).props('modelValue')).toBe('1.2')
    expect(wrapper.find('textarea').element.value).toBe('Please hurry')
  })

  it('keeps cover_id as an array when the order already stores an array', async () => {
    mockJson('/api/v3/orders/55', { ...fullOrder, cover_id: ['2', '3'] })

    const wrapper = await mountSettled('/milling?orderId=55')

    expect(wrapper.findComponent(CoefficientCover2).props('modelValue')).toEqual(['2', '3'])
    expect(lastCalcBody()).toMatchObject({ cover_id: ['2', '3'] })
  })

  it('derives the deadline from manufacturing_cycle when the order has no deadline', async () => {
    mockJson('/api/v3/orders/55', {
      ...fullOrder,
      deadline: undefined,
      manufacturing_cycle: 3,
    })

    await mountSettled('/milling?orderId=55')

    expect(lastCalcBody().deadline).toBe(startOfDayPlus(3))
  })

  it('keeps the material stored in the order even if the catalog lacks it', async () => {
    mockJson('/api/v3/orders/55', { ...fullOrder, material_id: '99' })

    const wrapper = await mountSettled('/milling?orderId=55')

    // The order overrides the catalog default after the lists are loaded.
    expect(wrapper.findComponent(SelectGroup).props('modelValue')).toBe('99')
    expect(lastCalcBody()).toMatchObject({ material_id: '99' })
  })

  it('leaves defaults untouched for fields the order does not provide', async () => {
    mockJson('/api/v3/orders/56', { file_id: 2 })

    const wrapper = await mountSettled('/milling?orderId=56')

    expect(lastCalcBody()).toMatchObject({
      file_id: 2,
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
    })
    // Material list is still loaded for an existing order: the first option is preselected.
    expect(lastCalcBody().material_id).toBe('1')
    expect(wrapper.find('textarea').element.value).toBe('')
    expect(wrapper.findComponent(CalculateSubmit2).props('payload')).toMatchObject({
      order_code: '3000.000.001',
      order_name: '',
    })
  })

  it('shows a zero-price result when the loaded order has no model', async () => {
    mockJson('/api/v3/orders/57', { quantity: 4, total_price: 99, status: 'DRAFT' })

    const wrapper = await mountSettled('/milling?orderId=57')

    expect(calcCalls()).toHaveLength(0)
    expect(wrapper.findComponent(CalculateResults).props('result')).toEqual({
      quantity: 4,
      status: 'DRAFT',
      total_price: 0,
      detail_price: 0,
      detail_price_one: 0,
    })
  })

  it('swallows an order loading error and still finishes bootstrapping', async () => {
    mockStatus('/api/v3/orders/58', 404)

    const wrapper = await mountSettled('/milling?orderId=58')

    expect(console.error).toHaveBeenCalled()
    expect(loaderFlag(wrapper)).toBe('false')
    expect(wrapper.findComponent(CalculateSubmit2).props('orderId')).toBe(58)
  })
})

describe('CalculateMillingPage2 reference data loading', () => {
  it('leaves the material empty and logs nothing when the response is not ok', async () => {
    mockStatus('/api/v3/materials', 500)

    const wrapper = await mountSettled()

    expect(wrapper.findComponent(SelectGroup).props('options')).toEqual([])
    expect(wrapper.findComponent(SelectGroup).props('modelValue')).toBe('')
    expect(lastCalcBody()).toMatchObject({ material_id: '' })
  })

  it('logs an error when the materials payload is malformed', async () => {
    mockJson('/api/v3/materials', {})

    const wrapper = await mountSettled()

    expect(console.error).toHaveBeenCalledWith('Error loading materials:', expect.any(Error))
    expect(wrapper.findComponent(SelectGroup).props('options')).toEqual([])
    expect(loaderFlag(wrapper)).toBe('false')
  })

  it('keeps the empty material when the catalog has no materials', async () => {
    mockJson('/api/v3/materials', { materials: [] })

    const wrapper = await mountSettled()

    expect(wrapper.findComponent(SelectGroup).props('options')).toEqual([])
    expect(lastCalcBody()).toMatchObject({ material_id: '' })
  })

  it('keeps the catalog empty for an existing order when there are no materials', async () => {
    mockJson('/api/v3/materials', { materials: [] })
    mockJson('/api/v3/orders/55', { ...fullOrder, material_id: '' })

    const wrapper = await mountSettled('/milling?orderId=55')

    expect(wrapper.findComponent(SelectGroup).props('options')).toEqual([])
    expect(wrapper.findComponent(SelectGroup).props('modelValue')).toBe('')
  })

  it('preselects the first material of the flattened catalog', async () => {
    mockJson('/api/v3/materials', {
      materials: [
        { id: 'z', label: 'Zeta', family: null },
        { id: 'a', label: 'Alpha', family: 'steel' },
      ],
    })

    const wrapper = await mountSettled()

    const groups = wrapper.findComponent(SelectGroup).props('options') as Array<{
      options: Array<{ value: string }>
    }>
    expect(groups.flatMap((g) => g.options.map((o) => o.value))).toHaveLength(2)
    expect(wrapper.findComponent(SelectGroup).props('modelValue')).toBe(
      groups.flatMap((g) => g.options)[0].value
    )
  })

  it('falls back to the first finish and tolerance when the defaults are not offered', async () => {
    mockJson('/api/v3/coefficients', {
      finish: [{ id: '9', label: 'Ra 12' }],
      cover: [],
      tolerance: [
        { id: '7', label: 'h9' },
        { id: '8', label: 'h10' },
      ],
    })

    const wrapper = await mountSettled()

    const [finish, tolerance] = wrapper.findAllComponents(SelectCalc)
    expect(finish.props('modelValue')).toBe('9')
    expect(tolerance.props('modelValue')).toBe('7')
    expect(lastCalcBody()).toMatchObject({ finish_id: '9', tolerance_id: '7' })
  })

  it('keeps the defaults when the coefficient lists are empty', async () => {
    mockJson('/api/v3/coefficients', { finish: [], cover: [], tolerance: [] })

    const wrapper = await mountSettled()

    const [finish, tolerance] = wrapper.findAllComponents(SelectCalc)
    expect(finish.props('inputData')).toEqual([])
    expect(finish.props('modelValue')).toBe('3')
    expect(tolerance.props('modelValue')).toBe('4')
    expect(lastCalcBody()).toMatchObject({ finish_id: '3', tolerance_id: '4' })
  })

  it('logs an error and keeps defaults when coefficients cannot be loaded', async () => {
    mockStatus('/api/v3/coefficients', 500)

    const wrapper = await mountSettled()

    expect(console.error).toHaveBeenCalledWith(
      'Error loading finish/tolerance:',
      expect.any(Error)
    )
    const [finish, tolerance] = wrapper.findAllComponents(SelectCalc)
    expect(finish.props('inputData')).toEqual([])
    expect(tolerance.props('inputData')).toEqual([])
    expect(lastCalcBody()).toMatchObject({ finish_id: '3', tolerance_id: '4' })
  })
})

describe('CalculateMillingPage2 price calculation', () => {
  it('shows the calculated result and clears the loader', async () => {
    mockJson('/api/v3/calculate-price', { ...mockCalculatePrice, total_price: 4321 })

    const wrapper = await mountSettled()

    expect(wrapper.findComponent(CalculateResults).props('result')).toMatchObject({
      total_price: 4321,
    })
    expect(wrapper.findComponent(CalculateSubmit2).props('lastResult')).toMatchObject({
      total_price: 4321,
    })
    expect(loaderFlag(wrapper)).toBe('false')
  })

  it('swallows a malformed calculate response and still hides the loader', async () => {
    mockRoute('/api/v3/calculate-price', () => new Response('not json', { status: 200 }))

    const wrapper = await mountSettled()

    expect(console.error).toHaveBeenCalledWith({ error: expect.any(Error) })
    expect(loaderFlag(wrapper)).toBe('false')
    expect(wrapper.exists()).toBe(true)
  })

  it('swallows a failed calculate request (HTTP 500)', async () => {
    mockStatus('/api/v3/calculate-price', 500)

    const wrapper = await mountSettled()

    expect(calcCalls()).toHaveLength(1)
    expect(loaderFlag(wrapper)).toBe('false')
  })

  it('sends a local STP model as file data instead of a file id', async () => {
    await saveFile3D('part.stp', 'ZGF0YQ==', 'stp')
    const wrapper = await mountSettled()

    emitOn(wrapper, UploadFiles2, 'update:stp_id', -1)
    await settle()

    expect(calcCalls()).toHaveLength(2)
    const body = lastCalcBody()
    expect(body).toMatchObject({ file_name: 'part.stp', file_data: 'ZGF0YQ==', file_type: 'stp' })
    expect(body).not.toHaveProperty('file_id')
  })
})

describe('CalculateMillingPage2 watchers', () => {
  it('does not recalculate for payload changes made while bootstrapping', async () => {
    const wrapper = await mountPage()

    emitOn(wrapper, SelectCalc, 'update:modelValue', '1', 1)
    await settle()

    expect(calcCalls()).toHaveLength(1)
    expect(lastCalcBody()).toMatchObject({ tolerance_id: '1' })
    expect(pageVm(wrapper).isLoading).toBe(false)
  })

  it('recalculates when the payload changes after bootstrap and shows the loader', async () => {
    const wrapper = await mountSettled()
    expect(calcCalls()).toHaveLength(1)

    emitOn(wrapper, Input, 'update:modelValue', '5')
    await nextTick()
    await vi.advanceTimersByTimeAsync(0)

    expect(loaderFlag(wrapper)).toBe('true')
    await settle()

    expect(calcCalls()).toHaveLength(2)
    expect(lastCalcBody()).toMatchObject({ quantity: 5 })
    expect(loaderFlag(wrapper)).toBe('false')
  })

  it('recalculates with the selected material', async () => {
    const wrapper = await mountSettled()

    emitOn(wrapper, SelectGroup, 'update:modelValue', '2')
    await settle()

    expect(calcCalls()).toHaveLength(2)
    expect(lastCalcBody()).toMatchObject({ material_id: '2' })
  })

  it('recalculates with the selected finish and tolerance', async () => {
    const wrapper = await mountSettled()

    emitOn(wrapper, SelectCalc, 'update:modelValue', '1', 0)
    await settle()
    expect(lastCalcBody()).toMatchObject({ finish_id: '1', tolerance_id: '4' })

    emitOn(wrapper, SelectCalc, 'update:modelValue', '1', 1)
    await settle()
    expect(calcCalls()).toHaveLength(3)
    expect(lastCalcBody()).toMatchObject({ finish_id: '1', tolerance_id: '1' })
  })

  it('recalculates with the selected cover and OTK', async () => {
    const wrapper = await mountSettled()

    emitOn(wrapper, CoefficientCover2, 'update:modelValue', ['2', '3'])
    await settle()
    expect(lastCalcBody()).toMatchObject({ cover_id: ['2', '3'] })

    emitOn(wrapper, CoefficientOtk2, 'update:modelValue', '1.15')
    await settle()
    expect(calcCalls()).toHaveLength(3)
    expect(lastCalcBody()).toMatchObject({ k_otk: '1.15' })
  })

  it('does not recalculate when only the order name or comment changes', async () => {
    const wrapper = await mountSettled()

    await wrapper.find('textarea').setValue('Some comment')
    await settle()

    expect(calcCalls()).toHaveLength(1)
    expect(wrapper.findComponent(CalculateSubmit2).props('specialInstructions')).toBe('Some comment')
  })

  it('forces service_id back to cnc-milling', async () => {
    const wrapper = await mountSettled()

    pageVm(wrapper).service_id = 'cnc-turning'
    await nextTick()
    await nextTick()

    expect(pageVm(wrapper).service_id).toBe('cnc-milling')
    expect(wrapper.findAllComponents(DocumentShowByIds2)[0].props('service_id')).toBe('cnc-milling')
  })

  it('keeps service_id when it is already cnc-milling', async () => {
    const wrapper = await mountSettled()

    pageVm(wrapper).service_id = 'cnc-milling'
    await nextTick()

    expect(pageVm(wrapper).service_id).toBe('cnc-milling')
  })

  it('re-creates the CAD viewer when the file id changes', async () => {
    const wrapper = await mountSettled()
    const keyBefore = pageVm(wrapper).cadViewerKey
    const viewerBefore = wrapper.findComponent(CadShowById).vm.$.uid

    emitOn(wrapper, CadShowById, 'update:modelValue', 3)
    await settle()

    expect(pageVm(wrapper).cadViewerKey).toBe(keyBefore + 1)
    expect(wrapper.findComponent(CadShowById).vm.$.uid).not.toBe(viewerBefore)
    expect(wrapper.findComponent(CadShowById).props('modelValue')).toBe(3)
    expect(lastCalcBody()).toMatchObject({ file_id: 3 })
  })

  it('updates the deadline from the manufacturing cycle of a new result', async () => {
    // First response (bootstrap) has cycle 5, later recalculations answer with the new cycle 9.
    mockJson('/api/v3/calculate-price', { ...mockCalculatePrice, manufacturing_cycle: 9 })
    mockJson('/api/v3/calculate-price', mockCalculatePrice, { once: true })
    const wrapper = await mountSettled()
    const callsBefore = calcCalls().length

    emitOn(wrapper, CalculateSubmit2, 'updateResult', { ...mockCalculatePrice, manufacturing_cycle: 9 })
    await settle()

    expect(calcCalls()).toHaveLength(callsBefore + 1)
    expect(lastCalcBody().deadline).toBe(startOfDayPlus(9))
  })

  it('keeps the deadline when the new result has no manufacturing cycle', async () => {
    const wrapper = await mountSettled()
    const callsBefore = calcCalls().length

    emitOn(wrapper, CalculateSubmit2, 'updateResult', { ...mockCalculatePrice, manufacturing_cycle: 0 })
    await settle()

    expect(calcCalls()).toHaveLength(callsBefore)
  })
})

describe('CalculateMillingPage2 user interaction', () => {
  it('shows the quantity as text and stores a valid number', async () => {
    const wrapper = await mountSettled()
    expect(wrapper.findComponent(Input).props('modelValue')).toBe('1')

    emitOn(wrapper, Input, 'update:modelValue', '12')
    await settle()

    expect(wrapper.findComponent(Input).props('modelValue')).toBe('12')
    expect(lastCalcBody()).toMatchObject({ quantity: 12 })
    expect(wrapper.findComponent(CalculateSubmit2).props('payload')).toMatchObject({ quantity: 12 })
  })

  it.each(['abc', '0', '-3', ''])(
    'falls back to quantity 1 for invalid input %j',
    async (value) => {
      const wrapper = await mountSettled()
      emitOn(wrapper, Input, 'update:modelValue', '8')
      await settle()
      expect(lastCalcBody()).toMatchObject({ quantity: 8 })

      emitOn(wrapper, Input, 'update:modelValue', value)
      await settle()

      expect(wrapper.findComponent(Input).props('modelValue')).toBe('1')
      expect(lastCalcBody()).toMatchObject({ quantity: 1 })
    }
  )

  it('shows the order description textarea for non-managers', async () => {
    const wrapper = await mountSettled()

    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('.calc-title__desktop').text()).toBe('Описание заказа')
    expect(wrapper.find('.calc-title__mobile').text()).toBe('Комментарий')
    expect(wrapper.findComponent(SuitableMachines).exists()).toBe(false)
  })

  it('hides the order description textarea for managers', async () => {
    const wrapper = await mountSettled('/milling', {
      initialState: { user: { profile: { ...mockLegalProfile, role: 'manager' } } },
    })

    expect(wrapper.find('textarea').exists()).toBe(false)
    expect(wrapper.findComponent(CalculateSubmit2).props('detailingForManager')).toBe(true)
  })

  it('shows suitable machines for the admin user only', async () => {
    const machines = [{ id: 1, name: 'DMG' }]
    mockJson('/api/v3/calculate-price', { ...mockCalculatePrice, suitable_machines: machines })

    const wrapper = await mountSettled('/milling', {
      initialState: { user: { profile: { ...mockLegalProfile, username: 'admin' } } },
    })

    expect(wrapper.findComponent(SuitableMachines).props('machines')).toEqual(machines)
  })

  it('passes no machines to the admin block while there is no result', async () => {
    const wrapper = await mountSettled('/milling?files=3', {
      initialState: { user: { profile: { ...mockLegalProfile, username: 'admin' } } },
    })

    expect(wrapper.findComponent(SuitableMachines).props('machines')).toEqual([])
  })

  it('renders desktop and mobile submit blocks with their own options', async () => {
    const wrapper = await mountSettled()

    const [desktop, mobile] = wrapper.findAllComponents(CalculateSubmit2)
    expect(desktop.props('hideBackButton')).toBe(false)
    expect(mobile.props('hideBackButton')).toBe(true)
    expect(mobile.props('saveLabel')).toBe('Сохранить')
  })

  it.each([0, 1])('applies updateResult of submit block %i to the shown result', async (index) => {
    const wrapper = await mountSettled()
    const updated = { ...mockCalculatePrice, total_price: 777 }

    emitOn(wrapper, CalculateSubmit2, 'updateResult', updated, index)
    await nextTick()

    expect(wrapper.findComponent(CalculateResults).props('result')).toMatchObject({
      total_price: 777,
    })
    expect(wrapper.findAllComponents(CalculateSubmit2)[1 - index].props('lastResult')).toMatchObject({
      total_price: 777,
    })
  })

  it.each([0, 1])('sets isInfoVisible on showInfo of submit block %i', async (index) => {
    const wrapper = await mountSettled()
    expect(pageVm(wrapper).isInfoVisible).toBe(false)

    emitOn(wrapper, CalculateSubmit2, 'showInfo', undefined, index)
    await nextTick()

    expect(pageVm(wrapper).isInfoVisible).toBe(true)
  })

  it.each([
    [UploadFiles2, 0],
    [UploadFiles2, 1],
    [DocumentShowByIds2, 0],
    [DocumentShowByIds2, 1],
  ] as const)('syncs document ids written by %s #%i to every upload and document component', async (component, index) => {
    const wrapper = await mountSettled()

    emitOn(wrapper, component, 'update:modelValue', [9, 10], index)
    await settle()

    for (const doc of wrapper.findAllComponents(DocumentShowByIds2)) {
      expect(doc.props('modelValue')).toEqual([9, 10])
    }
    for (const upload of wrapper.findAllComponents(UploadFiles2)) {
      expect(upload.props('modelValue')).toEqual([9, 10])
    }
    expect(wrapper.findComponent(CalculateSubmit2).props('payload')).toMatchObject({
      document_ids: [9, 10],
    })
  })

  it.each([
    [UploadFiles2, 0],
    [UploadFiles2, 1],
    [DocumentShowByIds2, 0],
    [DocumentShowByIds2, 1],
  ] as const)('selecting a model through %s #%i updates the file id and recalculates', async (component, index) => {
    const wrapper = await mountSettled()

    emitOn(wrapper, component, 'update:stp_id', 6, index)
    await settle()

    expect(wrapper.findComponent(CadShowById).props('modelValue')).toBe(6)
    expect(calcCalls()).toHaveLength(2)
    expect(lastCalcBody()).toMatchObject({ file_id: 6 })
  })

  it.each([0, 1])('recalculates immediately when document list %i emits calculate', async (index) => {
    const wrapper = await mountSettled()

    emitOn(wrapper, DocumentShowByIds2, 'calculate', undefined, index)
    await settle()

    expect(calcCalls()).toHaveLength(2)
    expect(lastCalcBody()).toMatchObject({ file_id: 2, quantity: 1 })
  })

  it('shows a zero-price result when the model is removed', async () => {
    const wrapper = await mountSettled()

    emitOn(wrapper, CadShowById, 'update:modelValue', undefined)
    emitOn(wrapper, UploadFiles2, 'update:stp_id', undefined)
    await settle()

    expect(wrapper.findComponent(CalculateResults).props('result')).toMatchObject({
      total_price: 0,
      detail_price: 0,
      detail_price_one: 0,
      quantity: 1,
    })
  })
})
