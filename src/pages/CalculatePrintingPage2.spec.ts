import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, onMounted, type Component } from 'vue'
import { ElMessage } from 'element-plus'
import { mockCalculatePrice } from '@/test/fixtures'
import {
  fetchCalls,
  lastFetchBody,
  mockJson,
  mockRoute,
  mockStatus,
} from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import { LOCAL_STP_FILE_ID, localStpCacheVersion } from '@/helpers/local-stp-files'
import { DEFAULT_PRINTING_FILE_ID } from '@/helpers/model-file-types'
import UploadFiles2 from '@/components/UploadFiles2.vue'
import DocumentShowByIds2 from '@/components/DocumentShowByIds2.vue'
import SuitableMachines from '@/components/SuitableMachines.vue'
import CalculateResults from '@/components/sections/CalculateResults.vue'
import CalculateSubmit2 from '@/components/sections/CalculateSubmit2.vue'
import CoefficientCover2 from '@/components/coefficients/CoefficientCover2.vue'
import CoefficientOtk2 from '@/components/coefficients/CoefficientOtk2.vue'
import Input from '@/components/ui/Input.vue'
import SelectGroup from '@/components/ui/SelectGroup.vue'
import CalculatePrintingPage2 from './CalculatePrintingPage2.vue'

const CALC_URL = '/api/v3/calculate-price'
const MATERIALS_URL = '/api/v3/materials'

const printingMaterials = {
  materials: [
    { id: 'plastic_PA11', label: 'PA11', family: 'plastic' },
    { id: 'plastic_PA12', label: 'PA12', family: 'plastic' },
  ],
}

/** Calculation response without manufacturing_cycle so the deadline watcher stays idle by default. */
const calcResponse = { ...mockCalculatePrice, manufacturing_cycle: undefined, file_id: 1 }

let cadMounts = 0
const CadStub = defineComponent({
  name: 'CadShowById',
  props: { modelValue: { type: Number, default: undefined }, stlOnly: Boolean },
  setup() {
    onMounted(() => {
      cadMounts += 1
    })
    return () => h('div', { class: 'cad-stub' })
  },
})

const LoaderStub = defineComponent({
  name: 'Loader',
  props: { loading: Boolean, text: String },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'loader-stub', 'data-loading': String(props.loading) }, slots.default?.())
  },
})

const stubs: Record<string, Component | boolean> = {
  UploadFiles2: true,
  DocumentShowByIds2: true,
  CalculateSubmit2: true,
  CalculateResults: true,
  SuitableMachines: true,
  CoefficientOtk2: true,
  CoefficientCover2: true,
  Input: true,
  SelectGroup: true,
  CadShowById: CadStub,
  Loader: LoaderStub,
}

type MountOptions = {
  query?: string
  initialState?: Record<string, unknown>
}

async function settle(rounds = 3) {
  for (let i = 0; i < rounds; i++) await vi.advanceTimersByTimeAsync(1100)
}

async function mountPage(options: MountOptions = {}) {
  const { wrapper } = await mountWithPlugins(CalculatePrintingPage2, {
    stubs,
    stubActions: false,
    initialRoute: `/printing${options.query ?? ''}`,
    initialState: options.initialState,
  })
  return wrapper
}

async function mountSettled(options: MountOptions = {}) {
  const wrapper = await mountPage(options)
  await settle()
  return wrapper
}

type Wrapper = Awaited<ReturnType<typeof mountPage>>

const isLoading = (wrapper: Wrapper) =>
  wrapper.find('.loader-stub').attributes('data-loading') === 'true'

const calcCalls = () => fetchCalls(CALC_URL)
const docs = (wrapper: Wrapper) => wrapper.findAllComponents(DocumentShowByIds2)
const uploads = (wrapper: Wrapper) => wrapper.findAllComponents(UploadFiles2)
const submits = (wrapper: Wrapper) => wrapper.findAllComponents(CalculateSubmit2)
const results = (wrapper: Wrapper) =>
  wrapper.findComponent(CalculateResults).props('result') as unknown as Record<string, unknown>
const select = (wrapper: Wrapper) => wrapper.findComponent(SelectGroup)

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'],
  })
  vi.setSystemTime(new Date(2026, 2, 10, 12, 0, 0))
  cadMounts = 0
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)
  mockJson(MATERIALS_URL, printingMaterials)
  mockJson(CALC_URL, calcResponse)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('CalculatePrintingPage2 bootstrap', () => {
  it('shows the loader until the minimum loading time has passed', async () => {
    const wrapper = await mountPage()
    expect(isLoading(wrapper)).toBe(true)

    await vi.advanceTimersByTimeAsync(300)
    expect(isLoading(wrapper)).toBe(true)

    await settle()
    expect(isLoading(wrapper)).toBe(false)
  })

  it('uses the default printing model and prices it when there is no order', async () => {
    const wrapper = await mountSettled()

    expect(fetchCalls('/orders/')).toHaveLength(0)
    expect(fetchCalls('/materials?process=printing')).toHaveLength(1)
    expect(calcCalls()).toHaveLength(1)
    expect(lastFetchBody(CALC_URL)).toMatchObject({
      service_id: 'printing',
      file_id: DEFAULT_PRINTING_FILE_ID,
      quantity: 1,
      length: 120,
      width: 30,
      height: 30,
      material_id: 'plastic_PA11',
      material_form: 'powder',
      cover_id: ['1'],
      k_otk: '1.0',
      k_cert: ['a', 'f'],
    })
    expect(lastFetchBody<{ deadline: string }>(CALC_URL)?.deadline).toBe(
      new Date(2026, 2, 10, 12, 0, 0).toISOString()
    )
    expect(docs(wrapper)[0].props('stp_id')).toBe(DEFAULT_PRINTING_FILE_ID)
    expect(docs(wrapper)[0].props('modelValue')).toEqual([])
    expect(results(wrapper).total_price).toBe(15000)
  })

  it('renders the static form blocks', async () => {
    const wrapper = await mountSettled()

    expect(wrapper.text()).toContain('3D-печать')
    expect(wrapper.text()).toContain('SLS (послойное лазерное спекание)')
    expect(wrapper.findComponent(Input).props('modelValue')).toBe('1')
    expect(select(wrapper).props('placeholder')).toBe('Выберите материал')
    expect(wrapper.findComponent(CoefficientCover2).props('excludeLabels')).toEqual([
      'Гальваника',
    ])
    expect(wrapper.findComponent(CoefficientCover2).props('modelValue')).toEqual(['1'])
    expect(wrapper.findComponent(CoefficientOtk2).props('modelValue')).toBe('1.0')
    expect(wrapper.findComponent(CadStub).props('stlOnly')).toBe(true)
    expect(wrapper.findComponent(CadStub).props('modelValue')).toBe(DEFAULT_PRINTING_FILE_ID)
  })

  it('treats a non-numeric orderId as "no order"', async () => {
    await mountSettled({ query: '?orderId=abc' })

    expect(fetchCalls('/orders/')).toHaveLength(0)
    expect(lastFetchBody(CALC_URL)).toMatchObject({ file_id: DEFAULT_PRINTING_FILE_ID })
  })

  it('takes document ids and the model from ?files= and ?stp=', async () => {
    const wrapper = await mountSettled({ query: '?files=5,6&stp=9' })

    expect(docs(wrapper)[0].props('modelValue')).toEqual([5, 6])
    expect(uploads(wrapper)[0].props('modelValue')).toEqual([5, 6])
    expect(docs(wrapper)[0].props('stp_id')).toBe(9)
    expect(calcCalls()).toHaveLength(1)
    expect(lastFetchBody(CALC_URL)).toMatchObject({ file_id: 9 })
  })

  it('does not price anything for ?files= without a model and shows an empty result', async () => {
    const wrapper = await mountSettled({ query: '?files=5' })

    expect(docs(wrapper)[0].props('modelValue')).toEqual([5])
    expect(docs(wrapper)[0].props('stp_id')).toBeUndefined()
    expect(calcCalls()).toHaveLength(0)
    expect(results(wrapper)).toMatchObject({
      total_price: 0,
      detail_price: 0,
      detail_price_one: 0,
      quantity: 1,
    })
  })

  it('ignores a non-numeric ?stp= value', async () => {
    const wrapper = await mountSettled({ query: '?files=5&stp=abc' })

    expect(docs(wrapper)[0].props('stp_id')).toBeUndefined()
    expect(calcCalls()).toHaveLength(0)
  })

  // BUG (CalculatePrintingPage2.vue onMounted/sendData): when the page starts without a model the
  // early return in sendData never calls stopLoading(), so the initial `isLoading = true` from
  // useMinLoading is never cleared and the loader overlay stays up forever.
  // `it.fails` documents the defect: remove `.fails` once the page is fixed.
  it.fails('hides the loader after bootstrapping without a model', async () => {
    const wrapper = await mountSettled({ query: '?files=5' })

    expect(isLoading(wrapper)).toBe(false)
  })

  it('keeps the default model when ?files= resolves to no valid ids', async () => {
    const wrapper = await mountSettled({ query: '?files=' })

    expect(docs(wrapper)[0].props('modelValue')).toEqual([])
    expect(docs(wrapper)[0].props('stp_id')).toBe(DEFAULT_PRINTING_FILE_ID)
  })
})

describe('CalculatePrintingPage2 order loading', () => {
  const order = {
    ...mockCalculatePrice,
    order_id: 7,
    order_name: 'Корпус',
    order_code: '3000.555.001',
    special_instructions: 'Покрасить',
    file_id: 4,
    document_ids: [11, 12],
    quantity: 8,
    length: 200,
    width: 50,
    height: 60,
    material_id: 'plastic_PA12',
    material_form: 'granule',
    cover_id: '2',
    k_otk: '1.5',
    k_cert: ['b'],
    deadline: '2026-05-01T08:00:00.000Z',
    // A manufacturing_cycle on the order would override the saved deadline (see report), keep it empty.
    manufacturing_cycle: undefined,
  }

  beforeEach(() => {
    mockJson(CALC_URL, { ...calcResponse, length: 200, width: 50, height: 60 })
  })

  it('fills every field from the order and prices it with those values', async () => {
    mockJson('/api/v3/orders/7', order)
    const wrapper = await mountSettled({ query: '?orderId=7' })

    expect(fetchCalls('/api/v3/orders/7')).toHaveLength(1)
    expect(fetchCalls('/api/v3/orders/7')[0].method).toBe('GET')
    expect(lastFetchBody(CALC_URL)).toMatchObject({
      service_id: 'printing',
      file_id: 4,
      quantity: 8,
      length: 200,
      width: 50,
      height: 60,
      material_id: 'plastic_PA12',
      material_form: 'granule',
      cover_id: ['2'],
      k_otk: '1.5',
      k_cert: ['b'],
      deadline: '2026-05-01T08:00:00.000Z',
    })
    expect(docs(wrapper)[0].props('modelValue')).toEqual([11, 12])
    expect(docs(wrapper)[0].props('stp_id')).toBe(4)
    expect(wrapper.findComponent(Input).props('modelValue')).toBe('8')
    expect(select(wrapper).props('modelValue')).toBe('plastic_PA12')
    expect(wrapper.find('textarea').element.value).toBe('Покрасить')
    expect(isLoading(wrapper)).toBe(false)
  })

  it('passes order identity and the filled payload to both submit blocks', async () => {
    mockJson('/api/v3/orders/7', order)
    const wrapper = await mountSettled({ query: '?orderId=7' })

    expect(submits(wrapper)).toHaveLength(2)
    for (const submit of submits(wrapper)) {
      expect(submit.props('orderId')).toBe(7)
      expect(submit.props('specialInstructions')).toBe('Покрасить')
      expect(submit.props('detailingForManager')).toBe(true)
      expect(submit.props('payload')).toMatchObject({
        service_id: 'printing',
        order_name: 'Корпус',
        order_code: '3000.555.001',
        file_id: 4,
        document_ids: [11, 12],
        quantity: 8,
        length: 200,
        material_id: 'plastic_PA12',
        material_form: 'granule',
        cover_id: ['2'],
        k_otk: '1.5',
        k_cert: ['b'],
      })
    }
    expect(submits(wrapper)[1].props('saveLabel')).toBe('Сохранить')
    expect(submits(wrapper)[1].props('hideBackButton')).toBe(true)
  })

  it('accepts cover_id given as an array', async () => {
    mockJson('/api/v3/orders/7', { ...order, cover_id: ['2', '3'] })
    await mountSettled({ query: '?orderId=7' })

    expect(lastFetchBody(CALC_URL)).toMatchObject({ cover_id: ['2', '3'] })
  })

  it('derives the deadline from manufacturing_cycle when the order has no deadline', async () => {
    mockJson('/api/v3/orders/7', { ...order, deadline: undefined, manufacturing_cycle: 3 })
    await mountSettled({ query: '?orderId=7' })

    const expected = new Date(new Date(2026, 2, 10).getTime() + 3 * 24 * 60 * 60 * 1000)
    expect(lastFetchBody<{ deadline: string }>(CALC_URL)?.deadline).toBe(expected.toISOString())
  })

  // BUG: getOrder() stores the whole order as `result`; the `result.manufacturing_cycle` watcher then
  // replaces the saved order deadline with "today + cycle", so editing an order silently moves its deadline.
  it.fails('keeps the saved order deadline when the order also has a manufacturing_cycle', async () => {
    mockJson('/api/v3/orders/7', { ...order, manufacturing_cycle: 5 })
    await mountSettled({ query: '?orderId=7' })

    expect(lastFetchBody<{ deadline: string }>(CALC_URL)?.deadline).toBe('2026-05-01T08:00:00.000Z')
  })

  it('keeps defaults for fields the order does not provide', async () => {
    mockJson('/api/v3/orders/7', {
      order_id: 7,
      total_price: 100,
      file_id: 3,
    })
    const wrapper = await mountSettled({ query: '?orderId=7' })

    expect(lastFetchBody(CALC_URL)).toMatchObject({
      file_id: 3,
      quantity: 1,
      length: 120,
      width: 30,
      height: 30,
      material_id: 'plastic_PA11',
      material_form: 'powder',
      cover_id: ['1'],
      k_otk: '1.0',
      k_cert: ['a', 'f'],
    })
    // no deadline and no manufacturing cycle on the order -> deadline is cleared
    expect(lastFetchBody<{ deadline?: string }>(CALC_URL)?.deadline).toBeUndefined()
    expect(submits(wrapper)[0].props('payload')).toMatchObject({
      order_code: '3000.000.001',
      document_ids: [],
    })
    expect(wrapper.find('textarea').element.value).toBe('')
  })

  it('logs and carries on with the empty calculator when the order cannot be loaded', async () => {
    mockStatus('/api/v3/orders/7', 404)
    const wrapper = await mountSettled({ query: '?orderId=7' })

    expect(console.error).toHaveBeenCalled()
    // the order failed before any model was set, so nothing is priced
    expect(calcCalls()).toHaveLength(0)
    expect(results(wrapper)).toMatchObject({ total_price: 0, quantity: 1 })
    expect(isLoading(wrapper)).toBe(false)
  })
})

describe('CalculatePrintingPage2 materials', () => {
  it('keeps the current material when it is in the list', async () => {
    const wrapper = await mountSettled()

    expect(select(wrapper).props('modelValue')).toBe('plastic_PA11')
    const options = select(wrapper).props('options') as { options: { value: string }[] }[]
    expect(options.flatMap((g) => g.options.map((o) => o.value))).toEqual([
      'plastic_PA11',
      'plastic_PA12',
    ])
  })

  it('selects the first option when the current material is not available', async () => {
    mockJson(MATERIALS_URL, {
      materials: [
        { id: 'resin_b', label: 'B', family: 'plastic' },
        { id: 'resin_a', label: 'A', family: 'plastic' },
      ],
    })
    const wrapper = await mountSettled()

    expect(select(wrapper).props('modelValue')).toBe('resin_a')
    expect(lastFetchBody(CALC_URL)).toMatchObject({ material_id: 'resin_a' })
  })

  it('keeps the current material when the list is empty', async () => {
    mockJson(MATERIALS_URL, { materials: [] })
    const wrapper = await mountSettled()

    expect(select(wrapper).props('options')).toEqual([])
    expect(select(wrapper).props('modelValue')).toBe('plastic_PA11')
    expect(calcCalls()).toHaveLength(1)
  })

  it('continues without materials when the request is not ok', async () => {
    mockStatus(MATERIALS_URL, 500)
    const wrapper = await mountSettled()

    expect(select(wrapper).props('options')).toEqual([])
    expect(select(wrapper).props('modelValue')).toBe('plastic_PA11')
    expect(calcCalls()).toHaveLength(1)
    expect(isLoading(wrapper)).toBe(false)
  })

  it('logs and continues when the materials response cannot be parsed', async () => {
    mockRoute(MATERIALS_URL, () => new Response('not json', { status: 200 }))
    const wrapper = await mountSettled()

    expect(console.error).toHaveBeenCalledWith('Error loading materials:', expect.anything())
    expect(select(wrapper).props('options')).toEqual([])
    expect(calcCalls()).toHaveLength(1)
  })
})

describe('CalculatePrintingPage2 price calculation', () => {
  it('stores the response and copies the dimensions the backend returned', async () => {
    mockJson(CALC_URL, { ...calcResponse, length: 210, width: 55, height: 66, total_price: 777 })
    const wrapper = await mountSettled()

    expect(results(wrapper).total_price).toBe(777)
    expect(wrapper.findComponent(CalculateResults).props('priceLabelFormat')).toBe('asterisk')
    expect(calcCalls()).toHaveLength(1)

    // the dimensions are part of the next request
    await wrapper.findComponent(Input).vm.$emit('update:modelValue', '2')
    await settle()
    expect(lastFetchBody(CALC_URL)).toMatchObject({
      quantity: 2,
      length: 210,
      width: 55,
      height: 66,
    })
  })

  it('keeps the current dimensions when the backend does not return them', async () => {
    mockJson(CALC_URL, { ...calcResponse, length: 0, width: undefined, height: null })
    const wrapper = await mountSettled()

    await wrapper.findComponent(Input).vm.$emit('update:modelValue', '3')
    await settle()
    expect(lastFetchBody(CALC_URL)).toMatchObject({
      quantity: 3,
      length: 120,
      width: 30,
      height: 30,
    })
  })

  it('sets the result to null when the response is not ok', async () => {
    mockStatus(CALC_URL, 500)
    const wrapper = await mountSettled()

    expect(calcCalls()).toHaveLength(1)
    expect(results(wrapper)).toBeNull()
    expect(isLoading(wrapper)).toBe(false)
  })

  it('sets the result to null and logs when total_price is not a number', async () => {
    mockJson(CALC_URL, { ...calcResponse, total_price: 'n/a' })
    const wrapper = await mountSettled()

    expect(results(wrapper)).toBeNull()
    expect(console.error).toHaveBeenCalledWith(
      'calculate-price returned no total_price',
      expect.objectContaining({ total_price: 'n/a' })
    )
    expect(isLoading(wrapper)).toBe(false)
  })

  it('handles an empty (null) response body like a missing total_price', async () => {
    mockJson(CALC_URL, null)
    const wrapper = await mountSettled()

    expect(results(wrapper)).toBeNull()
    expect(console.error).toHaveBeenCalledWith('calculate-price returned no total_price', null)
  })

  it('sets the result to null and logs when reading the response throws', async () => {
    mockRoute(CALC_URL, () => new Response('<html>', { status: 200 }))
    const wrapper = await mountSettled()

    expect(results(wrapper)).toBeNull()
    expect(console.error).toHaveBeenCalledWith({ error: expect.any(SyntaxError) })
    expect(isLoading(wrapper)).toBe(false)
  })

  it('recovers after a failed calculation on the next change', async () => {
    mockStatus(CALC_URL, 500, undefined, { once: true })
    const wrapper = await mountSettled()
    expect(results(wrapper)).toBeNull()

    await wrapper.findComponent(Input).vm.$emit('update:modelValue', '4')
    await settle()

    expect(calcCalls()).toHaveLength(2)
    expect(results(wrapper).total_price).toBe(15000)
  })

  it('shows the loader while a recalculation is running', async () => {
    const wrapper = await mountSettled()
    expect(isLoading(wrapper)).toBe(false)

    await wrapper.findComponent(Input).vm.$emit('update:modelValue', '5')
    await vi.advanceTimersByTimeAsync(200)
    expect(isLoading(wrapper)).toBe(true)

    await settle()
    expect(isLoading(wrapper)).toBe(false)
  })
})

describe('CalculatePrintingPage2 watchers', () => {
  it('does not recalculate while bootstrapping, only once per bootstrap', async () => {
    await mountSettled()
    expect(calcCalls()).toHaveLength(1)
  })

  it('sends a new calculate request when the payload changes after bootstrap', async () => {
    const wrapper = await mountSettled()

    await wrapper.findComponent(CoefficientOtk2).vm.$emit('update:modelValue', '1.5')
    await settle()

    expect(calcCalls()).toHaveLength(2)
    expect(lastFetchBody(CALC_URL)).toMatchObject({ k_otk: '1.5' })
  })

  it('bumps the CAD viewer key when the model changes', async () => {
    const wrapper = await mountSettled()
    const mountsBefore = cadMounts

    await docs(wrapper)[0].vm.$emit('update:stp_id', 2)
    await settle()

    expect(cadMounts).toBe(mountsBefore + 1)
    expect(wrapper.findComponent(CadStub).props('modelValue')).toBe(2)
    expect(lastFetchBody(CALC_URL)).toMatchObject({ file_id: 2 })
  })

  it('rebuilds the CAD viewer on a local STP cache update only for the local model', async () => {
    const wrapper = await mountSettled()
    const mountsBefore = cadMounts

    // server model selected: cache changes do not matter
    localStpCacheVersion.value += 1
    await settle(1)
    expect(cadMounts).toBe(mountsBefore)

    // local model selected: cache changes rebuild the viewer
    await uploads(wrapper)[0].vm.$emit('update:stp_id', LOCAL_STP_FILE_ID)
    await settle()
    const mountsAfterSelect = cadMounts
    expect(mountsAfterSelect).toBe(mountsBefore + 1)

    localStpCacheVersion.value += 1
    await settle(1)
    expect(cadMounts).toBe(mountsAfterSelect + 1)
  })

  it('updates the deadline from result.manufacturing_cycle', async () => {
    const wrapper = await mountSettled()
    expect(calcCalls()).toHaveLength(1)

    await submits(wrapper)[0].vm.$emit('updateResult', {
      ...calcResponse,
      manufacturing_cycle: 7,
    })
    await settle()

    const expected = new Date(new Date(2026, 2, 10).getTime() + 7 * 24 * 60 * 60 * 1000)
    expect(calcCalls()).toHaveLength(2)
    expect(lastFetchBody<{ deadline: string }>(CALC_URL)?.deadline).toBe(expected.toISOString())
  })

  it('keeps the deadline when the manufacturing cycle becomes empty', async () => {
    const wrapper = await mountSettled()
    await submits(wrapper)[0].vm.$emit('updateResult', { ...calcResponse, manufacturing_cycle: 7 })
    await settle()
    const callsBefore = calcCalls().length
    const deadlineBefore = lastFetchBody<{ deadline: string }>(CALC_URL)?.deadline

    await submits(wrapper)[1].vm.$emit('updateResult', { ...calcResponse, manufacturing_cycle: 0 })
    await settle()

    expect(calcCalls()).toHaveLength(callsBefore)
    expect(results(wrapper).manufacturing_cycle).toBe(0)
    expect(deadlineBefore).toBeDefined()
  })
})

describe('CalculatePrintingPage2 interactions', () => {
  it('maps the quantity input to a positive number and recalculates', async () => {
    const wrapper = await mountSettled()
    const input = wrapper.findComponent(Input)

    await input.vm.$emit('update:modelValue', '12')
    await settle()
    expect(lastFetchBody(CALC_URL)).toMatchObject({ quantity: 12 })
    expect(wrapper.findComponent(Input).props('modelValue')).toBe('12')
  })

  it('falls back to quantity 1 for invalid input', async () => {
    const wrapper = await mountSettled()
    const input = wrapper.findComponent(Input)

    await input.vm.$emit('update:modelValue', '6')
    await settle()
    expect(lastFetchBody(CALC_URL)).toMatchObject({ quantity: 6 })

    await input.vm.$emit('update:modelValue', 'abc')
    await settle()
    expect(lastFetchBody(CALC_URL)).toMatchObject({ quantity: 1 })
    expect(wrapper.findComponent(Input).props('modelValue')).toBe('1')

    await input.vm.$emit('update:modelValue', '-3')
    await settle()
    expect(wrapper.findComponent(Input).props('modelValue')).toBe('1')
  })

  it('recalculates with the selected material', async () => {
    const wrapper = await mountSettled()

    await select(wrapper).vm.$emit('update:modelValue', 'plastic_PA12')
    await settle()

    expect(select(wrapper).props('modelValue')).toBe('plastic_PA12')
    expect(lastFetchBody(CALC_URL)).toMatchObject({ material_id: 'plastic_PA12' })
  })

  it('recalculates with the selected finish', async () => {
    const wrapper = await mountSettled()

    await wrapper.findComponent(CoefficientCover2).vm.$emit('update:modelValue', ['2', '3'])
    await settle()

    expect(wrapper.findComponent(CoefficientCover2).props('modelValue')).toEqual(['2', '3'])
    expect(lastFetchBody(CALC_URL)).toMatchObject({ cover_id: ['2', '3'] })
  })

  it('propagates the typed order description to both submit blocks', async () => {
    const wrapper = await mountSettled()

    await wrapper.find('textarea').setValue('Нужна шлифовка')

    for (const submit of submits(wrapper)) {
      expect(submit.props('specialInstructions')).toBe('Нужна шлифовка')
    }
  })

  // docs/uploads appear in DOM order: mobile docs, desktop upload, mobile upload, desktop docs
  const fileSources: [string, 'docs' | 'uploads', number][] = [
    ['mobile document list', 'docs', 0],
    ['desktop uploader', 'uploads', 0],
    ['mobile uploader', 'uploads', 1],
    ['desktop document list', 'docs', 1],
  ]

  it.each(fileSources)(
    'syncs document ids and the model emitted by the %s everywhere',
    async (_name, kind, index) => {
      const wrapper = await mountSettled()
      const source = (kind === 'docs' ? docs(wrapper) : uploads(wrapper))[index]

      await source.vm.$emit('update:modelValue', [7, 8])
      await source.vm.$emit('update:stp_id', 3)
      await settle()

      const all = [...uploads(wrapper), ...docs(wrapper)] as unknown as {
        props: (key: string) => unknown
      }[]
      expect(all).toHaveLength(4)
      for (const component of all) {
        expect(component.props('modelValue')).toEqual([7, 8])
        expect(component.props('stp_id')).toBe(3)
        expect(component.props('service_id')).toBe('printing')
      }
      expect(wrapper.findComponent(CadStub).props('modelValue')).toBe(3)
      expect(lastFetchBody(CALC_URL)).toMatchObject({ file_id: 3 })
    }
  )

  it('selects the model when the CAD viewer reports one', async () => {
    const wrapper = await mountSettled()

    await wrapper.findComponent(CadStub).vm.$emit('update:modelValue', 4)
    await settle()

    expect(docs(wrapper)[0].props('stp_id')).toBe(4)
    expect(lastFetchBody(CALC_URL)).toMatchObject({ file_id: 4 })
  })

  it('recalculates when a document list asks for it', async () => {
    const wrapper = await mountSettled()
    expect(calcCalls()).toHaveLength(1)

    await docs(wrapper)[0].vm.$emit('calculate')
    await settle()
    expect(calcCalls()).toHaveLength(2)

    await docs(wrapper)[1].vm.$emit('calculate')
    await settle()
    expect(calcCalls()).toHaveLength(3)
    expect(lastFetchBody(CALC_URL)).toMatchObject({ service_id: 'printing', file_id: 1 })
  })

  it('shows a zero-price result without a request when the model is removed', async () => {
    const wrapper = await mountSettled()
    expect(results(wrapper).total_price).toBe(15000)

    await uploads(wrapper)[0].vm.$emit('update:stp_id', undefined)
    await settle()

    expect(calcCalls()).toHaveLength(1)
    expect(results(wrapper)).toMatchObject({
      total_price: 0,
      detail_price: 0,
      detail_price_one: 0,
      quantity: 1,
      status: 'CALCULATED',
    })
  })

  it('treats a local model missing from the cache as having no model', async () => {
    const wrapper = await mountSettled()

    await docs(wrapper)[0].vm.$emit('update:stp_id', LOCAL_STP_FILE_ID)
    await settle()

    expect(calcCalls()).toHaveLength(1)
    expect(results(wrapper).total_price).toBe(0)
  })

  it('stores a result emitted by the submit block', async () => {
    const wrapper = await mountSettled()
    const emitted = { ...calcResponse, total_price: 4321 }

    await submits(wrapper)[0].vm.$emit('updateResult', emitted)

    expect(results(wrapper).total_price).toBe(4321)
    expect(submits(wrapper)[0].props('lastResult')).toMatchObject({ total_price: 4321 })
  })

  it('opens the info state when a submit block emits showInfo', async () => {
    const wrapper = await mountSettled()
    const vm = wrapper.vm as unknown as { isInfoVisible: boolean }
    expect(vm.isInfoVisible).toBe(false)

    await submits(wrapper)[0].vm.$emit('showInfo')
    expect(vm.isInfoVisible).toBe(true)

    vm.isInfoVisible = false
    await submits(wrapper)[1].vm.$emit('showInfo')
    expect(vm.isInfoVisible).toBe(true)
  })
})

describe('CalculatePrintingPage2 roles', () => {
  it('shows the order description field to regular users', async () => {
    const wrapper = await mountSettled({
      initialState: { user: { profile: { username: 'user@example.com', role: 'user' } } },
    })

    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.text()).toContain('Описание заказа')
    expect(wrapper.findComponent(SuitableMachines).exists()).toBe(false)
  })

  it('hides the order description field for managers', async () => {
    const wrapper = await mountSettled({
      initialState: { user: { profile: { username: 'boss', role: 'manager' } } },
    })

    expect(wrapper.find('textarea').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Описание заказа')
    expect(submits(wrapper)).toHaveLength(2)
  })

  it('shows suitable machines to the admin user', async () => {
    const machines = [{ id: 'm1' }]
    mockJson(CALC_URL, { ...calcResponse, suitable_machines: machines })
    const wrapper = await mountPage({
      initialState: { user: { profile: { username: 'admin', role: 'user' } } },
    })

    // before any result exists the list is empty
    expect(wrapper.findComponent(SuitableMachines).props('machines')).toEqual([])

    await settle()
    expect(wrapper.findComponent(SuitableMachines).props('machines')).toEqual(machines)
  })

  it('falls back to an empty machine list when the result has none', async () => {
    mockStatus(CALC_URL, 500)
    const wrapper = await mountSettled({
      initialState: { user: { profile: { username: 'admin', role: 'user' } } },
    })

    expect(wrapper.findComponent(SuitableMachines).props('machines')).toEqual([])
  })
})
