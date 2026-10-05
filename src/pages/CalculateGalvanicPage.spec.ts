import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, type Component } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { ElMessage } from 'element-plus'
import { mockCalculatePrice, mockOrder } from '@/test/fixtures'
import {
  fetchCalls,
  lastFetchBody,
  mockJson,
  mockNetworkError,
  mockRoute,
  mockStatus,
} from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import { ensureLocalStpCacheReady, saveFile3D } from '@/helpers/local-stp-files'
import SelectCalc from '@/components/ui/SelectCalc.vue'
import Input from '@/components/ui/Input.vue'
import CoefficientOtk2 from '@/components/coefficients/CoefficientOtk2.vue'
import SuitableMachines from '@/components/SuitableMachines.vue'
import CalculateResults from '@/components/sections/CalculateResults.vue'
import CalculateSubmit2 from '@/components/sections/CalculateSubmit2.vue'
import UploadFiles2 from '@/components/UploadFiles2.vue'
import DocumentShowByIds2 from '@/components/DocumentShowByIds2.vue'
import CalculateGalvanicPage from './CalculateGalvanicPage.vue'

type Dict = Record<string, unknown>

type PageVm = {
  isBootstrapping: boolean
  isMaterialsLoading: boolean
  isInfoVisible: boolean
  cadViewerKey: number
  service_id: string
  process_id: string
  electroplating_process_id: string
  electroplating_family: string
  file_id: number | undefined
  document_ids: number[]
  length: number
  width: number
  height: number
  quantity: number
  k_otk: string
  coating_thickness_microns: number
  isFamilyInList: boolean
}

const OPERATIONS = [
  {
    id: 'zn_1',
    group: 'Цинкование',
    path: ['Цинк'],
    label: 'Цинк',
    max_part_size_label: '500x300',
    max_weight_kg: 10,
    requires_thickness_input: true,
  },
  {
    id: 'zn_2',
    group: 'Цинкование',
    path: ['Цинк', 'Хромат'],
    label: 'Цинк хромат',
    max_part_size_label: '200',
    max_weight_kg: 2.5,
  },
  {
    id: 'ox_1',
    group: 'Оксидирование',
    path: [],
    label: 'Оксид',
    max_part_size_label: '1000',
    max_weight_kg: 50,
  },
]

const FAMILIES = [
  { id: 'aluminum', label: 'Алюминий' },
  { id: 'copper', label: 'Медь' },
]

const routes = [
  { path: '/', name: 'home', component: { template: '<div />' } },
  { path: '/galvanic', name: 'galvanic', component: { template: '<div />' } },
]

/** Keeps the real Loader contract (slot + loading prop) but without its styles. */
const LoaderStub = defineComponent({
  props: { loading: Boolean, text: String },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'loader-stub', 'data-loading': String(props.loading) }, slots.default?.())
  },
})

const stubs: Record<string, Component | boolean> = {
  UploadFiles2: true,
  DocumentShowByIds2: true,
  CadShowById: true,
  CalculateResults: true,
  CalculateSubmit2: true,
  SuitableMachines: true,
  CoefficientOtk2: true,
  Input: true,
  SelectCalc: true,
  Loader: LoaderStub,
  teleport: false,
}

const API = '/api/v3'
const CALC_URL = `${API}/calculate-price`

function mockBackend() {
  mockJson(`${API}/calculate-price`, mockCalculatePrice)
  mockJson(`${API}/operations_available`, { values: OPERATIONS })
  mockJson(`${API}/electroplating_material_families`, { values: FAMILIES })
}

function deferred() {
  let resolve!: (response: Response) => void
  const promise = new Promise<Response>((r) => {
    resolve = r
  })
  return {
    promise,
    resolveJson: (body: unknown) =>
      resolve(
        new Response(JSON.stringify(body), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      ),
  }
}

/** Lets pending promise chains run, then lets useMinLoading's 1s floor elapse. */
async function settle(ms = 1100) {
  for (let i = 0; i < 3; i++) await vi.advanceTimersByTimeAsync(0)
  await vi.advanceTimersByTimeAsync(ms)
  for (let i = 0; i < 3; i++) await vi.advanceTimersByTimeAsync(0)
  await nextTick()
}

async function pump() {
  for (let i = 0; i < 6; i++) await vi.advanceTimersByTimeAsync(0)
  await nextTick()
}

async function mountPage(
  query = '',
  options: { state?: Dict; settle?: boolean } = {}
): Promise<VueWrapper> {
  vi.useFakeTimers()
  const { wrapper } = await mountWithPlugins(CalculateGalvanicPage, {
    stubs,
    stubActions: false,
    routes,
    initialRoute: `/galvanic${query}`,
    initialState: options.state,
  })
  if (options.settle !== false) await settle()
  return wrapper
}

const vmOf = (wrapper: VueWrapper) => wrapper.vm as unknown as PageVm

const selects = (w: VueWrapper) => w.findAllComponents(SelectCalc)
const processSelect = (w: VueWrapper) => selects(w)[0]
const familySelect = (w: VueWrapper) => selects(w)[selects(w).length - 1]
const typeSelect = (w: VueWrapper) => (selects(w).length === 3 ? selects(w)[1] : undefined)
const quantityInput = (w: VueWrapper) => w.findAllComponents(Input)[0]
const thicknessInput = (w: VueWrapper) =>
  w.findAllComponents(Input).find((c) => c.props('placeholder') === 'Введите толщину')
const optionValues = (c: { props: (k: string) => unknown }) =>
  (c.props('inputData') as Array<{ value: string }>).map((o) => o.value)
const loaderState = (w: VueWrapper) => w.find('.loader-stub').attributes('data-loading')
const resultProp = (w: VueWrapper) =>
  w.findComponent(CalculateResults).props('result') as Dict | null
const submits = (w: VueWrapper) => w.findAllComponents(CalculateSubmit2)
const submitPayload = (w: VueWrapper) => submits(w)[0].props('payload') as unknown as Dict
const calcBodies = () => fetchCalls(CALC_URL).map((c) => JSON.parse(c.body as string) as Dict)

const baseCalcBody = {
  service_id: 'electroplating_auto',
  location: 'location_1',
  file_id: 2,
  quantity: 1,
  electroplating_family: 'aluminum',
  electroplating_process_id: 'zn_1',
  coating_thickness_microns: 9,
  k_otk: '1.0',
}

let errorSpy: ReturnType<typeof vi.spyOn>

beforeAll(async () => {
  // Hydrate the IndexedDB-backed cache on real timers; fake timers would stall it.
  await ensureLocalStpCacheReady()
})

beforeEach(() => {
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)
  mockBackend()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('CalculateGalvanicPage bootstrap', () => {
  it('loads operations, the first coating, its families and prices the default model', async () => {
    const wrapper = await mountPage()

    expect(fetchCalls('/operations_available')[0].url).toBe(
      `${API}/operations_available?service_id=electroplating_auto`
    )
    expect(fetchCalls('/electroplating_material_families').map((c) => c.url)).toEqual([
      `${API}/electroplating_material_families?electroplating_process_id=zn_1`,
    ])
    expect(calcBodies()).toEqual([baseCalcBody])
    expect(fetchCalls(CALC_URL)[0].method).toBe('POST')

    const vm = vmOf(wrapper)
    expect(vm.isBootstrapping).toBe(false)
    expect(vm.isMaterialsLoading).toBe(false)
    expect(vm.file_id).toBe(2)
    expect(vm.process_id).toBe('zn_1')
    expect(vm.electroplating_family).toBe('aluminum')
    expect(vm.isFamilyInList).toBe(true)
    expect(vm.document_ids).toEqual([])
    expect(vm.cadViewerKey).toBe(1)
    expect(resultProp(wrapper)).toMatchObject({ total_price: 15000 })
    expect(loaderState(wrapper)).toBe('false')
  })

  it('keeps the loader visible for the minimum time before bootstrap completes', async () => {
    const wrapper = await mountPage('', { settle: false })
    expect(loaderState(wrapper)).toBe('true')

    await pump()
    expect(calcBodies()).toHaveLength(1)
    expect(loaderState(wrapper)).toBe('true')

    await vi.advanceTimersByTimeAsync(1100)
    expect(loaderState(wrapper)).toBe('false')
  })

  it('exposes coating processes by group and coating types of the selected group', async () => {
    const wrapper = await mountPage()

    expect(processSelect(wrapper).props('inputData')).toEqual([
      { value: 'zn_1', label: 'Цинкование' },
      { value: 'ox_1', label: 'Оксидирование' },
    ])
    expect(processSelect(wrapper).props('modelValue')).toBe('zn_1')
    expect(typeSelect(wrapper)?.props('inputData')).toEqual([
      { value: 'zn_1', label: 'Цинк' },
      { value: 'zn_2', label: 'Цинк / Хромат' },
    ])
    expect(typeSelect(wrapper)?.props('modelValue')).toBe('zn_1')
    expect(familySelect(wrapper).props('inputData')).toEqual([
      { value: 'aluminum', label: 'Алюминий' },
      { value: 'copper', label: 'Медь' },
    ])
    expect(familySelect(wrapper).props('modelValue')).toBe('aluminum')
  })

  it('accepts the data-wrapped operations shape', async () => {
    mockJson(`${API}/operations_available`, { data: { values: [OPERATIONS[2]] } })
    const wrapper = await mountPage()

    expect(processSelect(wrapper).props('inputData')).toEqual([
      { value: 'ox_1', label: 'Оксидирование' },
    ])
    // A group without coating paths has no types select; the operation itself is used.
    expect(typeSelect(wrapper)).toBeUndefined()
    expect(vmOf(wrapper).electroplating_process_id).toBe('ox_1')
    expect(fetchCalls('/electroplating_material_families')[0].url).toContain(
      'electroplating_process_id=ox_1'
    )
  })

  it('falls back to top-level values when data has none', async () => {
    mockJson(`${API}/operations_available`, { data: {}, values: [OPERATIONS[0]] })
    const wrapper = await mountPage()
    expect(optionValues(processSelect(wrapper))).toEqual(['zn_1'])
  })

  it('works with an empty operations response: no families, no prices, no restrictions', async () => {
    mockJson(`${API}/operations_available`, {})
    const wrapper = await mountPage()

    expect(processSelect(wrapper).props('inputData')).toEqual([])
    expect(vmOf(wrapper).process_id).toBe('')
    expect(vmOf(wrapper).electroplating_process_id).toBe('')
    expect(fetchCalls('/electroplating_material_families')).toHaveLength(0)
    expect(fetchCalls(CALC_URL)).toHaveLength(0)
    expect(wrapper.text()).not.toContain('Технические ограничения')
    expect(wrapper.text()).not.toContain('Толщина покрытия')
    expect(familySelect(wrapper).props('inputData')).toEqual([])
  })

  it.each([
    ['server error', () => mockStatus(`${API}/operations_available`, 500)],
    ['not found', () => mockStatus(`${API}/operations_available`, 404)],
    ['network failure', () => mockNetworkError(`${API}/operations_available`)],
  ])('survives a failing operations request (%s)', async (_name, setup) => {
    setup()
    const wrapper = await mountPage()

    expect(vmOf(wrapper).isBootstrapping).toBe(false)
    expect(processSelect(wrapper).props('inputData')).toEqual([])
    expect(fetchCalls(CALC_URL)).toHaveLength(0)
  })

  it('reports an unreadable operations body', async () => {
    mockRoute(`${API}/operations_available`, () => new Response('<<not json', { status: 200 }))
    const wrapper = await mountPage()

    expect(errorSpy).toHaveBeenCalledWith(
      'Error loading electroplating operations:',
      expect.any(SyntaxError)
    )
    expect(vmOf(wrapper).isBootstrapping).toBe(false)
  })
})

describe('CalculateGalvanicPage query handling', () => {
  it('applies ?files and ?stp', async () => {
    const wrapper = await mountPage('?files=5,6&stp=7')
    const vm = vmOf(wrapper)

    expect(vm.document_ids).toEqual([5, 6])
    expect(vm.file_id).toBe(7)
    expect(wrapper.findAllComponents(DocumentShowByIds2)[0].props('modelValue')).toEqual([5, 6])
    expect(calcBodies()).toEqual([{ ...baseCalcBody, file_id: 7 }])
  })

  it('leaves the model empty when ?files has no valid ?stp and does not request a price', async () => {
    const wrapper = await mountPage('?files=5&stp=abc')
    const vm = vmOf(wrapper)

    expect(vm.document_ids).toEqual([5])
    expect(vm.file_id).toBeUndefined()
    expect(fetchCalls(CALC_URL)).toHaveLength(0)
    expect(vm.electroplating_family).toBe('aluminum')
  })

  it('sends a locally stored model as file data instead of file_id', async () => {
    await saveFile3D('part.stp', 'BASE64DATA', 'stp')
    const wrapper = await mountPage('?files=1&stp=-1')

    expect(vmOf(wrapper).file_id).toBe(-1)
    const [body] = calcBodies()
    expect(body).toMatchObject({
      file_type: 'stp',
      file_name: 'part.stp',
      file_data: 'BASE64DATA',
    })
    expect(body).not.toHaveProperty('file_id')
  })
})

describe('CalculateGalvanicPage material families', () => {
  it('accepts the data-wrapped families shape', async () => {
    mockJson(`${API}/electroplating_material_families`, {
      data: { values: [{ id: 'brass', label: 'Латунь' }] },
    })
    const wrapper = await mountPage()
    expect(familySelect(wrapper).props('inputData')).toEqual([{ value: 'brass', label: 'Латунь' }])
    expect(vmOf(wrapper).electroplating_family).toBe('brass')
    expect(calcBodies()[0]).toMatchObject({ electroplating_family: 'brass' })
  })

  it('stays without families (and without a request) when the list is empty', async () => {
    mockJson(`${API}/electroplating_material_families`, {})
    const wrapper = await mountPage()

    expect(familySelect(wrapper).props('inputData')).toEqual([])
    expect(vmOf(wrapper).electroplating_family).toBe('')
    expect(vmOf(wrapper).isMaterialsLoading).toBe(false)
    expect(fetchCalls(CALC_URL)).toHaveLength(0)
  })

  it('falls back to the legacy /materials endpoint on 404', async () => {
    mockStatus(`${API}/electroplating_material_families`, 404)
    mockJson(`${API}/materials`, {
      materials: [
        { electroplating_family: 'copper' },
        { electroplating_family: 'aluminum' },
        { electroplating_family: 'copper' },
        { electroplating_family: null },
      ],
    })
    const wrapper = await mountPage()

    expect(fetchCalls('/materials').map((c) => c.url)).toEqual([
      `${API}/materials?process=electroplating_auto&electroplating_process_id=zn_1`,
    ])
    expect(familySelect(wrapper).props('inputData')).toEqual([
      { value: 'aluminum', label: 'Алюминий' },
      { value: 'copper', label: 'Медь' },
    ])
    expect(vmOf(wrapper).electroplating_family).toBe('aluminum')
    expect(calcBodies()).toHaveLength(1)
  })

  it('treats a legacy response without materials as empty', async () => {
    mockStatus(`${API}/electroplating_material_families`, 404)
    mockJson(`${API}/materials`, {})
    const wrapper = await mountPage()

    expect(familySelect(wrapper).props('inputData')).toEqual([])
    expect(fetchCalls(CALC_URL)).toHaveLength(0)
  })

  it('gives up when the legacy endpoint fails too', async () => {
    mockStatus(`${API}/electroplating_material_families`, 404)
    mockStatus(`${API}/materials`, 500)
    const wrapper = await mountPage()

    expect(familySelect(wrapper).props('inputData')).toEqual([])
    expect(vmOf(wrapper).isMaterialsLoading).toBe(false)
    expect(fetchCalls(CALC_URL)).toHaveLength(0)
  })

  it.each([
    ['server error', () => mockStatus(`${API}/electroplating_material_families`, 500)],
    ['network failure', () => mockNetworkError(`${API}/electroplating_material_families`)],
  ])('gives up quietly when the families request fails (%s)', async (_name, setup) => {
    setup()
    const wrapper = await mountPage()

    expect(familySelect(wrapper).props('inputData')).toEqual([])
    expect(vmOf(wrapper).electroplating_family).toBe('')
    expect(vmOf(wrapper).isMaterialsLoading).toBe(false)
    expect(fetchCalls(CALC_URL)).toHaveLength(0)
  })

  it('logs an unreadable families body and resets the loading flag', async () => {
    mockRoute(
      `${API}/electroplating_material_families`,
      () => new Response('<<not json', { status: 200 })
    )
    const wrapper = await mountPage()

    expect(errorSpy).toHaveBeenCalledWith(
      'Error loading electroplating material families:',
      expect.any(SyntaxError)
    )
    expect(vmOf(wrapper).isMaterialsLoading).toBe(false)
  })

  it('flags materials as loading while the request is in flight', async () => {
    const families = deferred()
    mockRoute(`${API}/electroplating_material_families`, () => families.promise)
    const wrapper = await mountPage('', { settle: false })
    await pump()

    expect(vmOf(wrapper).isMaterialsLoading).toBe(true)
    expect(vmOf(wrapper).isBootstrapping).toBe(true)
    expect(fetchCalls(CALC_URL)).toHaveLength(0)

    families.resolveJson({ values: FAMILIES })
    await settle()

    expect(vmOf(wrapper).isMaterialsLoading).toBe(false)
    expect(vmOf(wrapper).isBootstrapping).toBe(false)
    expect(calcBodies()).toHaveLength(1)
  })
})

describe('CalculateGalvanicPage computed state and rendering', () => {
  it('shows thickness input and technical restrictions of the selected operation', async () => {
    const wrapper = await mountPage()

    expect(thicknessInput(wrapper)?.props('modelValue')).toBe('9')
    expect(wrapper.text()).toContain('Технические ограничения')
    expect(wrapper.text()).toContain('Макс. размер 1 ед. изделия, мм:')
    expect(wrapper.text()).toContain('500x300')
    expect(wrapper.text()).toContain('Макс. масса 1 ед. изделия, кг:')
    const values = wrapper.findAll('.galvanic-restriction__value').map((n) => n.text())
    expect(values).toEqual(['500x300', '10'])
  })

  it('hides the thickness input and omits thickness from the request when not required', async () => {
    const wrapper = await mountPage()
    typeSelect(wrapper)!.vm.$emit('update:modelValue', 'zn_2')
    await settle()

    expect(thicknessInput(wrapper)).toBeUndefined()
    expect(wrapper.findAll('.galvanic-restriction__value').map((n) => n.text())).toEqual([
      '200',
      '2.5',
    ])
    const bodies = calcBodies()
    expect(bodies).toHaveLength(2)
    expect(bodies[1]).toEqual({
      service_id: 'electroplating_auto',
      location: 'location_1',
      file_id: 2,
      quantity: 1,
      electroplating_family: 'aluminum',
      electroplating_process_id: 'zn_2',
      k_otk: '1.0',
    })
    // The submit payload always carries the thickness.
    expect(submitPayload(wrapper)).toMatchObject({
      electroplating_process_id: 'zn_2',
      coating_thickness_microns: 9,
    })
  })

  it('renders admin-only suitable machines from the result', async () => {
    mockJson(`${API}/calculate-price`, {
      ...mockCalculatePrice,
      suitable_machines: [{ id: 1 }],
    })
    const admin = await mountPage('', { state: { user: { profile: { username: 'admin' } } } })
    expect(admin.findComponent(SuitableMachines).props('machines')).toEqual([{ id: 1 }])

    const other = await mountPage('', { state: { user: { profile: { username: 'bob' } } } })
    expect(other.findComponent(SuitableMachines).exists()).toBe(false)
  })

  it('passes no machines when the result has none', async () => {
    const admin = await mountPage('?files=3', {
      state: { user: { profile: { username: 'admin' } } },
    })
    expect(admin.findComponent(SuitableMachines).props('machines')).toEqual([])
  })

  it.each([
    ['AODMZ', 'location_2'],
    ['Kronshtadt', 'location_3'],
    ['unknown-company', 'location_1'],
    ['', 'location_1'],
  ])('derives the location from the profile username %j', async (username, location) => {
    await mountPage('', { state: { user: { profile: { username } } } })
    expect(calcBodies()[0]).toMatchObject({ location })
  })

  it('uses location_1 without a profile', async () => {
    await mountPage()
    expect(calcBodies()[0]).toMatchObject({ location: 'location_1' })
  })

  it('shows the order comment field to regular users and hides it for managers', async () => {
    const user = await mountPage()
    const textarea = user.find('textarea')
    expect(textarea.exists()).toBe(true)
    await textarea.setValue('Нужна упаковка')
    expect(submits(user)[0].props('specialInstructions')).toBe('Нужна упаковка')
    expect(submits(user)[1].props('specialInstructions')).toBe('Нужна упаковка')

    const manager = await mountPage('', { state: { user: { profile: { role: 'manager' } } } })
    expect(manager.find('textarea').exists()).toBe(false)
  })

  it('treats a manager access token as a manager', async () => {
    const segment = btoa(JSON.stringify({ role: 'manager' })).replace(/=+$/, '')
    // The auth store restores its token from sessionStorage when it is created.
    sessionStorage.setItem('token-store', `h.${segment}.s`)
    const wrapper = await mountPage()
    expect(wrapper.find('textarea').exists()).toBe(false)
  })
})

describe('CalculateGalvanicPage interactions', () => {
  it('re-prices when the quantity changes and normalizes invalid input to 1', async () => {
    const wrapper = await mountPage()
    expect(quantityInput(wrapper).props('modelValue')).toBe('1')

    quantityInput(wrapper).vm.$emit('update:modelValue', '5')
    await settle()
    expect(vmOf(wrapper).quantity).toBe(5)
    expect(quantityInput(wrapper).props('modelValue')).toBe('5')
    expect(lastFetchBody<Dict>(CALC_URL)).toMatchObject({ quantity: 5 })

    quantityInput(wrapper).vm.$emit('update:modelValue', 'abc')
    await settle()
    expect(vmOf(wrapper).quantity).toBe(1)
    expect(lastFetchBody<Dict>(CALC_URL)).toMatchObject({ quantity: 1 })
    expect(calcBodies()).toHaveLength(3)
  })

  it('re-prices with the entered thickness and normalizes invalid values to 9', async () => {
    const wrapper = await mountPage()

    thicknessInput(wrapper)!.vm.$emit('update:modelValue', '25')
    await settle()
    expect(thicknessInput(wrapper)?.props('modelValue')).toBe('25')
    expect(lastFetchBody<Dict>(CALC_URL)).toMatchObject({ coating_thickness_microns: 25 })

    thicknessInput(wrapper)!.vm.$emit('update:modelValue', '-3')
    await settle()
    expect(thicknessInput(wrapper)?.props('modelValue')).toBe('9')
    expect(lastFetchBody<Dict>(CALC_URL)).toMatchObject({ coating_thickness_microns: 9 })

    thicknessInput(wrapper)!.vm.$emit('update:modelValue', 'x')
    await settle()
    expect(thicknessInput(wrapper)?.props('modelValue')).toBe('9')
  })

  it('re-prices with the selected inspection type', async () => {
    const wrapper = await mountPage()
    wrapper.findComponent(CoefficientOtk2).vm.$emit('update:modelValue', '1.3')
    await settle()

    expect(vmOf(wrapper).k_otk).toBe('1.3')
    expect(lastFetchBody<Dict>(CALC_URL)).toMatchObject({ k_otk: '1.3' })
    expect(submitPayload(wrapper)).toMatchObject({ k_otk: '1.3' })
  })

  it('switching the coating process picks its first type, reloads families and re-prices', async () => {
    mockJson(`${API}/electroplating_material_families`, { values: [{ id: 'steel', label: 'Сталь' }] })
    mockJson(`${API}/electroplating_material_families?electroplating_process_id=zn_1`, {
      values: FAMILIES,
    })
    const wrapper = await mountPage()

    processSelect(wrapper).vm.$emit('update:modelValue', 'ox_1')
    await settle()

    const vm = vmOf(wrapper)
    expect(vm.process_id).toBe('ox_1')
    expect(vm.electroplating_process_id).toBe('ox_1')
    expect(typeSelect(wrapper)).toBeUndefined()
    expect(thicknessInput(wrapper)).toBeUndefined()
    expect(wrapper.findAll('.galvanic-restriction__value').map((n) => n.text())).toEqual([
      '1000',
      '50',
    ])
    expect(fetchCalls('/electroplating_material_families').map((c) => c.url)).toContain(
      `${API}/electroplating_material_families?electroplating_process_id=ox_1`
    )
    expect(vm.electroplating_family).toBe('steel')
    const bodies = calcBodies()
    expect(bodies.at(-1)).toMatchObject({
      electroplating_process_id: 'ox_1',
      electroplating_family: 'steel',
    })
    expect(bodies.at(-1)).not.toHaveProperty('coating_thickness_microns')
  })

  it('clears families synchronously when the coating type changes, then reloads them', async () => {
    const wrapper = await mountPage()
    const families = deferred()
    mockRoute(`${API}/electroplating_material_families`, () => families.promise)

    typeSelect(wrapper)!.vm.$emit('update:modelValue', 'zn_2')
    await nextTick()

    expect(vmOf(wrapper).isMaterialsLoading).toBe(true)
    expect(familySelect(wrapper).props('inputData')).toEqual([])
    expect(fetchCalls(CALC_URL)).toHaveLength(1)

    // Edits made while families load never trigger a price request.
    quantityInput(wrapper).vm.$emit('update:modelValue', '4')
    await pump()
    expect(fetchCalls(CALC_URL)).toHaveLength(1)

    families.resolveJson({ values: [{ id: 'copper', label: 'Медь' }] })
    await settle()

    expect(vmOf(wrapper).isMaterialsLoading).toBe(false)
    // For a new calculation the first family of the reloaded list is selected,
    // and a single request covers the type change and the edits made meanwhile.
    expect(calcBodies()).toHaveLength(2)
    expect(calcBodies()[1]).toMatchObject({
      electroplating_process_id: 'zn_2',
      electroplating_family: 'copper',
      quantity: 4,
    })
  })

  it('does not request a price while bootstrapping', async () => {
    const families = deferred()
    mockRoute(`${API}/electroplating_material_families`, () => families.promise)
    const wrapper = await mountPage('', { settle: false })
    await pump()

    quantityInput(wrapper).vm.$emit('update:modelValue', '3')
    await pump()
    expect(fetchCalls(CALC_URL)).toHaveLength(0)

    families.resolveJson({ values: FAMILIES })
    await settle()
    expect(calcBodies()).toEqual([{ ...baseCalcBody, quantity: 3 }])
  })

  it('selecting another family re-prices', async () => {
    const wrapper = await mountPage()
    familySelect(wrapper).vm.$emit('update:modelValue', 'copper')
    await settle()

    expect(lastFetchBody<Dict>(CALC_URL)).toMatchObject({ electroplating_family: 'copper' })
    expect(calcBodies()).toHaveLength(2)
  })

  it('does not request a price for an empty family or a family missing from the list', async () => {
    const wrapper = await mountPage()

    familySelect(wrapper).vm.$emit('update:modelValue', '')
    await settle()
    expect(vmOf(wrapper).isFamilyInList).toBe(false)

    familySelect(wrapper).vm.$emit('update:modelValue', 'unobtainium')
    await settle()
    expect(vmOf(wrapper).isFamilyInList).toBe(false)

    expect(calcBodies()).toHaveLength(1)
  })

  it('does not request a price when the coating type is cleared', async () => {
    const wrapper = await mountPage()
    typeSelect(wrapper)!.vm.$emit('update:modelValue', '')
    await settle()

    expect(vmOf(wrapper).electroplating_process_id).toBe('')
    expect(fetchCalls('/electroplating_material_families')).toHaveLength(1)
    expect(calcBodies()).toHaveLength(1)
  })

  it('forces service_id back to electroplating_auto', async () => {
    const wrapper = await mountPage()
    const vm = vmOf(wrapper)

    vm.service_id = 'cnc-milling'
    await nextTick()
    expect(vm.service_id).toBe('electroplating_auto')
    expect(wrapper.findAllComponents(DocumentShowByIds2)[0].props('service_id')).toBe(
      'electroplating_auto'
    )

    // Writing the allowed value is a no-op.
    vm.service_id = 'electroplating_auto'
    await nextTick()
    expect(vm.service_id).toBe('electroplating_auto')
  })

  it('remounts the CAD viewer and re-prices when the model changes', async () => {
    const wrapper = await mountPage()
    const viewer = () => wrapper.findComponent({ name: 'CadShowById' })
    expect(viewer().props('modelValue')).toBe(2)
    expect(vmOf(wrapper).cadViewerKey).toBe(1)

    viewer().vm.$emit('update:modelValue', 9)
    await settle()

    expect(vmOf(wrapper).file_id).toBe(9)
    expect(vmOf(wrapper).cadViewerKey).toBe(2)
    expect(viewer().props('modelValue')).toBe(9)
    expect(lastFetchBody<Dict>(CALC_URL)).toMatchObject({ file_id: 9 })
  })

  it('syncs documents and the model through the upload and document components', async () => {
    const wrapper = await mountPage()
    const uploads = wrapper.findAllComponents(UploadFiles2)
    const docs = wrapper.findAllComponents(DocumentShowByIds2)
    expect(uploads).toHaveLength(2)
    expect(docs).toHaveLength(2)

    uploads[0].vm.$emit('update:modelValue', [11, 12])
    await settle()
    expect(vmOf(wrapper).document_ids).toEqual([11, 12])
    expect(submitPayload(wrapper)).toMatchObject({ document_ids: [11, 12] })

    // Every instance (desktop and mobile) is bound to the same state.
    const all = [...uploads, ...docs] as unknown as Array<{
      vm: { $emit: (event: string, ...args: unknown[]) => void }
      props: (key: string) => unknown
    }>
    for (const c of all) expect(c.props('modelValue')).toEqual([11, 12])
    for (const [index, component] of all.entries()) {
      component.vm.$emit('update:modelValue', [index])
      await settle()
      expect(vmOf(wrapper).document_ids).toEqual([index])
      for (const c of all) expect(c.props('modelValue')).toEqual([index])

      component.vm.$emit('update:stp_id', 20 + index)
      await settle()
      expect(vmOf(wrapper).file_id).toBe(20 + index)
      expect(lastFetchBody<Dict>(CALC_URL)).toMatchObject({ file_id: 20 + index })
      for (const c of all) expect(c.props('stp_id')).toBe(20 + index)
    }
  })

  it('recalculates when a document component asks for it', async () => {
    const wrapper = await mountPage()
    const docs = wrapper.findAllComponents(DocumentShowByIds2)
    expect(calcBodies()).toHaveLength(1)

    docs[0].vm.$emit('calculate')
    await settle()
    expect(calcBodies()).toHaveLength(2)

    docs[1].vm.$emit('calculate')
    await settle()
    expect(calcBodies()).toHaveLength(3)
    expect(calcBodies()[2]).toEqual(baseCalcBody)
  })
})

describe('CalculateGalvanicPage sendData and submit payload', () => {
  it('returns a zero-price result without a request when there is no model', async () => {
    const wrapper = await mountPage('?files=1')

    expect(vmOf(wrapper).file_id).toBeUndefined()
    expect(fetchCalls(CALC_URL)).toHaveLength(0)
    expect(resultProp(wrapper)).toMatchObject({
      total_price: 0,
      detail_price: 0,
      detail_price_one: 0,
      quantity: 1,
    })

    // The payload watcher goes through the same no-model path and keeps the new quantity.
    quantityInput(wrapper).vm.$emit('update:modelValue', '7')
    await settle()
    expect(fetchCalls(CALC_URL)).toHaveLength(0)
    expect(resultProp(wrapper)).toMatchObject({ total_price: 0, quantity: 7 })
  })

  it('shows the loader while the price request runs', async () => {
    const wrapper = await mountPage()
    quantityInput(wrapper).vm.$emit('update:modelValue', '2')
    await nextTick()
    await vi.advanceTimersByTimeAsync(0)

    expect(loaderState(wrapper)).toBe('true')
    await vi.advanceTimersByTimeAsync(1100)
    expect(loaderState(wrapper)).toBe('false')
  })

  it('stores dimensions from the response and prefers them in the submit payload', async () => {
    const wrapper = await mountPage()
    const vm = vmOf(wrapper)

    expect([vm.length, vm.width, vm.height]).toEqual([120, 30, 30])
    expect(submitPayload(wrapper)).toEqual({
      service_id: 'electroplating_auto',
      order_name: '',
      order_code: '3000.000.001',
      location: 'location_1',
      file_id: 2,
      document_ids: [],
      quantity: 1,
      electroplating_family: 'aluminum',
      electroplating_process_id: 'zn_1',
      coating_thickness_microns: 9,
      k_otk: '1.0',
      length: 120,
      width: 30,
      height: 30,
    })
    expect(submits(wrapper)[1].props('payload')).toEqual(submitPayload(wrapper))
    expect(submits(wrapper)[0].props('orderId')).toBe(0)
    expect(submits(wrapper)[0].props('lastResult')).toMatchObject({ total_price: 15000 })
  })

  it('unwraps data-wrapped responses', async () => {
    mockJson(`${API}/calculate-price`, { data: { length: 7, width: 8, height: 9, status: 'OK' } })
    const wrapper = await mountPage()

    expect(resultProp(wrapper)).toEqual({ length: 7, width: 8, height: 9, status: 'OK' })
    expect(submitPayload(wrapper)).toMatchObject({ length: 7, width: 8, height: 9 })
  })

  it('omits dimensions that neither the result nor the form know', async () => {
    mockJson(`${API}/calculate-price`, { status: 'CALCULATED', total_price: 10 })
    const wrapper = await mountPage()

    const payload = submitPayload(wrapper)
    expect(payload).not.toHaveProperty('length')
    expect(payload).not.toHaveProperty('width')
    expect(payload).not.toHaveProperty('height')
    expect(vmOf(wrapper).length).toBe(0)
  })

  it.each([
    ['server error', () => mockStatus(CALC_URL, 500)],
    ['network failure', () => mockNetworkError(CALC_URL)],
    ['unreadable body', () => mockRoute(CALC_URL, () => new Response('<<', { status: 200 }))],
  ])('swallows a price request error (%s)', async (_name, setup) => {
    setup()
    const wrapper = await mountPage()

    expect(fetchCalls(CALC_URL)).toHaveLength(1)
    expect(errorSpy).toHaveBeenCalled()
    expect(resultProp(wrapper)).toBeNull()
    expect(loaderState(wrapper)).toBe('false')
    expect(vmOf(wrapper).isBootstrapping).toBe(false)
  })

  it('applies results emitted by CalculateSubmit2 and falls back to form dimensions', async () => {
    const wrapper = await mountPage()

    submits(wrapper)[0].vm.$emit('updateResult', {
      ...mockCalculatePrice,
      total_price: 777,
      length: 10,
      width: 20,
      height: 30,
    })
    await nextTick()
    expect(resultProp(wrapper)).toMatchObject({ total_price: 777 })
    expect(submitPayload(wrapper)).toMatchObject({ length: 10, width: 20, height: 30 })

    submits(wrapper)[1].vm.$emit('updateResult', {
      ...mockCalculatePrice,
      total_price: 888,
      length: 0,
      width: 0,
      height: 0,
    })
    await nextTick()
    expect(resultProp(wrapper)).toMatchObject({ total_price: 888 })
    expect(vmOf(wrapper).length).toBe(10)
    expect(submitPayload(wrapper)).toMatchObject({ length: 10, width: 20, height: 30 })
  })

  it('flags info as visible when the mobile submit asks for it', async () => {
    const wrapper = await mountPage()
    expect(vmOf(wrapper).isInfoVisible).toBe(false)

    submits(wrapper)[1].vm.$emit('showInfo')
    await nextTick()
    expect(vmOf(wrapper).isInfoVisible).toBe(true)
  })

  it('also reacts to the desktop submit asking for info', async () => {
    const wrapper = await mountPage()
    submits(wrapper)[0].vm.$emit('showInfo')
    await nextTick()
    expect(vmOf(wrapper).isInfoVisible).toBe(true)
  })
})

describe('CalculateGalvanicPage existing order', () => {
  const fullOrder = {
    ...mockOrder,
    order_id: 5,
    order_code: 'ORD-5',
    order_name: 'Покрытие',
    file_id: 4,
    document_ids: [7, 8],
    length: 11,
    width: 12,
    height: 13,
    quantity: 3,
    electroplating_family: 'copper',
    electroplating_process_id: 'zn_2',
    coating_thickness_microns: 20,
    k_otk: '1.3',
    special_instructions: 'Аккуратно',
  }
  const bareOrder = { order_id: 5, total_price: 100 }

  it('requests the order instead of reading query files and fills every field', async () => {
    mockJson(`${API}/orders/5`, fullOrder)
    mockJson(CALC_URL, { ...mockCalculatePrice, length: 0, width: 0, height: 0 })
    const wrapper = await mountPage('?orderId=5&files=99&stp=98')
    const vm = vmOf(wrapper)

    expect(fetchCalls('/orders/5')[0].method).toBe('GET')
    expect(vm.file_id).toBe(4)
    expect(vm.document_ids).toEqual([7, 8])
    expect([vm.length, vm.width, vm.height]).toEqual([11, 12, 13])
    expect(vm.quantity).toBe(3)
    expect(vm.electroplating_family).toBe('copper')
    expect(vm.electroplating_process_id).toBe('zn_2')
    expect(vm.process_id).toBe('zn_1')
    expect(vm.coating_thickness_microns).toBe(20)
    expect(vm.k_otk).toBe('1.3')
    expect(typeSelect(wrapper)?.props('modelValue')).toBe('zn_2')
    expect(wrapper.find('textarea').element.value).toBe('Аккуратно')
    expect(submits(wrapper)[0].props('orderId')).toBe(5)
    expect(submits(wrapper)[0].props('specialInstructions')).toBe('Аккуратно')
    expect(submitPayload(wrapper)).toMatchObject({
      order_name: 'Покрытие',
      order_code: 'ORD-5',
      file_id: 4,
      document_ids: [7, 8],
      quantity: 3,
      electroplating_family: 'copper',
      electroplating_process_id: 'zn_2',
      k_otk: '1.3',
      length: 11,
      width: 12,
      height: 13,
    })
    expect(fetchCalls('/electroplating_material_families').map((c) => c.url)).toEqual([
      `${API}/electroplating_material_families?electroplating_process_id=zn_2`,
    ])
    // The order's own family is kept because it is in the loaded list.
    expect(calcBodies()).toEqual([
      {
        service_id: 'electroplating_auto',
        location: 'location_1',
        file_id: 4,
        quantity: 3,
        electroplating_family: 'copper',
        electroplating_process_id: 'zn_2',
        k_otk: '1.3',
      },
    ])
  })

  it('keeps the thickness for an order whose operation requires it', async () => {
    mockJson(`${API}/orders/5`, {
      ...fullOrder,
      electroplating_process_id: 'zn_1',
      coating_thickness_microns: 20,
    })
    const wrapper = await mountPage('?orderId=5')

    expect(thicknessInput(wrapper)?.props('modelValue')).toBe('20')
    expect(calcBodies()).toEqual([
      expect.objectContaining({ electroplating_process_id: 'zn_1', coating_thickness_microns: 20 }),
    ])
  })

  it('replaces an order family that is not offered with the first one', async () => {
    mockJson(`${API}/orders/5`, { ...fullOrder, electroplating_family: 'unobtainium' })
    const wrapper = await mountPage('?orderId=5')

    expect(vmOf(wrapper).electroplating_family).toBe('aluminum')
    expect(calcBodies()[0]).toMatchObject({ electroplating_family: 'aluminum' })
  })

  it.each([
    ['electroplating_process_id', { electroplating_process_id: 'zn_2' }, 'zn_2'],
    ['process_id', { process_id: 'zn_2' }, 'zn_2'],
    ['cover_id array', { cover_id: ['zn_2'] }, 'zn_2'],
    ['cover_id string', { cover_id: 'zn_2' }, 'zn_2'],
    ['unknown id (falls back to first coating)', { process_id: 'nope' }, 'zn_1'],
    ['nothing (keeps the first coating)', {}, 'zn_1'],
  ])('resolves the order coating from %s', async (_name, fields, expected) => {
    mockJson(`${API}/orders/5`, { ...bareOrder, file_id: 4, ...fields })
    const wrapper = await mountPage('?orderId=5')

    expect(vmOf(wrapper).electroplating_process_id).toBe(expected)
    expect(fetchCalls('/electroplating_material_families')[0].url).toContain(
      `electroplating_process_id=${expected}`
    )
  })

  it('uses material_id as family when the order has no electroplating_family', async () => {
    mockJson(`${API}/orders/5`, { ...bareOrder, file_id: 4, material_id: 'copper' })
    const wrapper = await mountPage('?orderId=5')

    expect(vmOf(wrapper).electroplating_family).toBe('copper')
    expect(calcBodies()[0]).toMatchObject({ electroplating_family: 'copper', file_id: 4 })
  })

  it('keeps defaults for an order with no data and does not price without a model', async () => {
    mockJson(`${API}/orders/5`, bareOrder)
    const wrapper = await mountPage('?orderId=5')
    const vm = vmOf(wrapper)

    expect(vm.file_id).toBeUndefined()
    expect(vm.document_ids).toEqual([])
    expect([vm.length, vm.width, vm.height]).toEqual([0, 0, 0])
    expect(vm.quantity).toBe(1)
    expect(vm.k_otk).toBe('1.0')
    expect(vm.coating_thickness_microns).toBe(9)
    expect(vm.electroplating_family).toBe('aluminum')
    expect(submitPayload(wrapper)).toMatchObject({ order_name: '', order_code: '3000.000.001' })
    expect(fetchCalls(CALC_URL)).toHaveLength(0)
    expect(resultProp(wrapper)).toMatchObject({ order_id: 5, total_price: 0, quantity: 1 })
  })

  it('unwraps a data-wrapped order', async () => {
    mockJson(`${API}/orders/5`, { data: { file_id: 4, quantity: 2, electroplating_family: 'copper' } })
    const wrapper = await mountPage('?orderId=5')

    expect(vmOf(wrapper).quantity).toBe(2)
    expect(vmOf(wrapper).electroplating_family).toBe('copper')
  })

  it.each([
    ['server error', () => mockStatus(`${API}/orders/5`, 404)],
    ['unreadable body', () => mockRoute(`${API}/orders/5`, () => new Response('<<', { status: 200 }))],
  ])('logs a failing order request and still finishes bootstrap (%s)', async (_name, setup) => {
    setup()
    const wrapper = await mountPage('?orderId=5')

    expect(errorSpy).toHaveBeenCalled()
    expect(vmOf(wrapper).isBootstrapping).toBe(false)
    expect(vmOf(wrapper).electroplating_process_id).toBe('zn_1')
    expect(vmOf(wrapper).electroplating_family).toBe('aluminum')
    expect(loaderState(wrapper)).toBe('false')
  })

  it('keeps the order coating id when the operations list is empty', async () => {
    mockJson(`${API}/operations_available`, { values: [] })
    mockJson(`${API}/orders/5`, { ...bareOrder, file_id: 4, electroplating_process_id: 'zn_2' })
    const wrapper = await mountPage('?orderId=5')

    expect(vmOf(wrapper).process_id).toBe('')
    expect(vmOf(wrapper).electroplating_process_id).toBe('zn_2')
    expect(typeSelect(wrapper)).toBeUndefined()
    expect(calcBodies()[0]).toMatchObject({ electroplating_process_id: 'zn_2' })
  })

  describe('when the coating process is changed while the order is loading', () => {
    async function mountWithPendingOrder() {
      const order = deferred()
      mockRoute(`${API}/orders/5`, () => order.promise)
      const wrapper = await mountPage('?orderId=5', { settle: false })
      await pump()
      expect(fetchCalls('/orders/5')).toHaveLength(1)
      processSelect(wrapper).vm.$emit('update:modelValue', 'bogus')
      await pump()
      expect(vmOf(wrapper).process_id).toBe('bogus')
      return { wrapper, order }
    }

    it('re-selects the process group of the order operation', async () => {
      const { wrapper, order } = await mountWithPendingOrder()
      order.resolveJson({ ...bareOrder, file_id: 4, electroplating_process_id: 'ox_1' })
      await settle()

      expect(vmOf(wrapper).process_id).toBe('ox_1')
      expect(vmOf(wrapper).electroplating_process_id).toBe('ox_1')
      expect(processSelect(wrapper).props('modelValue')).toBe('ox_1')
    })

    it('falls back to the first process when the order operation is unknown', async () => {
      const { wrapper, order } = await mountWithPendingOrder()
      order.resolveJson({ ...bareOrder, file_id: 4, electroplating_process_id: 'unknown_op' })
      await settle()

      expect(vmOf(wrapper).process_id).toBe('zn_1')
      // The unknown operation is replaced by the first coating of the group.
      expect(vmOf(wrapper).electroplating_process_id).toBe('zn_1')
    })
  })
})
