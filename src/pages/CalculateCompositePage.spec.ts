import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { ElMessage } from 'element-plus'
import type { Component } from 'vue'
import { mockCalculatePrice, mockMaterials } from '@/test/fixtures'
import { fetchCalls, mockJson, mockRoute, mockStatus } from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import Input from '@/components/ui/Input.vue'
import SelectGroup from '@/components/ui/SelectGroup.vue'
import CoefficientOtk2 from '@/components/coefficients/CoefficientOtk2.vue'
import CoefficientCover2 from '@/components/coefficients/CoefficientCover2.vue'
import SuitableMachines from '@/components/SuitableMachines.vue'
import CalculateResults from '@/components/sections/CalculateResults.vue'
import CalculateSubmit2 from '@/components/sections/CalculateSubmit2.vue'
import UploadFiles2 from '@/components/UploadFiles2.vue'
import DocumentShowByIds2 from '@/components/DocumentShowByIds2.vue'
import { saveFile3D } from '@/helpers/local-stp-files'
import CalculateCompositePage from './CalculateCompositePage.vue'

// The page imports a component whose file name starts with a Cyrillic "С".
const CHECKBOX_NAME = 'Checkbox\u0421alc'

const LoaderStub: Component = {
  props: ['loading', 'text'],
  template: '<div class="loader-stub" :data-loading="String(loading)"><slot /></div>',
}

const CheckboxStub: Component = {
  name: CHECKBOX_NAME,
  props: ['modelValue'],
  template: '<label class="checkbox-stub"><slot /></label>',
}

const stubs = {
  Loader: LoaderStub,
  Input: true,
  SelectGroup: true,
  CoefficientOtk2: true,
  CoefficientCover2: true,
  [CHECKBOX_NAME]: CheckboxStub,
  SuitableMachines: true,
  CalculateResults: true,
  CalculateSubmit2: true,
  UploadFiles2: true,
  DocumentShowByIds2: true,
  CadShowById: true,
}

type CalcBody = Record<string, unknown>

const orderResponse = {
  ...mockCalculatePrice,
  order_id: 7,
  file_id: 3,
  document_ids: [10, 11],
  length: 200,
  width: 40,
  height: 50,
  quantity: 4,
  material_id: '2',
  cover_id: '2',
  is_need_special_equipment: false,
  n_dimensions: 77,
  k_otk: '1.5',
  k_cert: ['x'],
  deadline: '2026-12-01T00:00:00.000Z',
  order_name: 'Order X',
  order_code: 'ABC-001',
  special_instructions: 'Please hurry',
}

async function settle() {
  for (let i = 0; i < 3; i++) {
    await flushPromises()
    await vi.advanceTimersByTimeAsync(1100)
  }
  await flushPromises()
}

type MountOptions = {
  query?: string
  state?: Record<string, unknown>
  wait?: boolean
}

async function mountPage(options: MountOptions = {}) {
  const { wrapper } = await mountWithPlugins(CalculateCompositePage, {
    stubs,
    initialRoute: `/composite${options.query ?? ''}`,
    initialState: options.state,
  })
  if (options.wait !== false) await settle()
  return wrapper
}

const calcBodies = () => fetchCalls('/calculate-price').map((c) => JSON.parse(c.body!) as CalcBody)
const lastCalcBody = () => calcBodies().at(-1)!

const resultProp = (w: VueWrapper) =>
  w.findComponent(CalculateResults).props('result') as Record<string, unknown> | null | undefined

const managerState = { user: { profile: { role: 'manager' } } }

describe('CalculateCompositePage', () => {
  let consoleError: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
    vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)
    mockJson('/api/v3/materials', mockMaterials)
    mockJson('/api/v3/calculate-price', mockCalculatePrice, { method: 'POST' })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('bootstrap without an order', () => {
    it('loads composite materials, picks the first one and prices the default demo file', async () => {
      const wrapper = await mountPage()

      const materialsCall = fetchCalls('/materials')[0]
      expect(materialsCall.url).toContain('/materials?process=composite')
      expect(materialsCall.method).toBe('GET')

      const select = wrapper.findComponent(SelectGroup)
      expect(select.props('modelValue')).toBe('1')
      expect(select.props('options')).toEqual([
        { label: 'Алюминий', options: [{ value: '1', label: 'Алюминий Д16Т' }] },
        { label: 'Сталь', options: [{ value: '2', label: 'Сталь 45' }] },
      ])

      expect(fetchCalls('/calculate-price')).toHaveLength(1)
      expect(fetchCalls('/calculate-price')[0].method).toBe('POST')
      expect(lastCalcBody()).toEqual({
        service_id: 'composite',
        file_id: 2,
        quantity: 1,
        length: 120,
        width: 30,
        height: 30,
        material_id: '1',
        cover_id: [],
        is_need_special_equipment: true,
        n_dimensions: 55,
        k_otk: '1.0',
        k_cert: ['a', 'f'],
      })
      expect(fetchCalls('/orders')).toHaveLength(0)
      expect(resultProp(wrapper)).toEqual(mockCalculatePrice)
      expect(wrapper.findComponent(CalculateResults).props('priceLabelFormat')).toBe('asterisk')
    })

    it('keeps the loader visible for at least a second', async () => {
      const wrapper = await mountPage({ wait: false })
      const loader = () => wrapper.find('.loader-stub').attributes('data-loading')
      expect(loader()).toBe('true')

      await flushPromises()
      await vi.advanceTimersByTimeAsync(500)
      expect(fetchCalls('/calculate-price')).toHaveLength(1)
      expect(loader()).toBe('true')

      await settle()
      expect(loader()).toBe('false')
    })

    it('uses ?files= for documents and ?stp= for the model', async () => {
      const wrapper = await mountPage({ query: '?files=5,6&stp=7' })

      for (const upload of wrapper.findAllComponents(UploadFiles2)) {
        expect(upload.props('modelValue')).toEqual([5, 6])
        expect(upload.props('stp_id')).toBe(7)
      }
      expect(lastCalcBody().file_id).toBe(7)
      expect(fetchCalls('/calculate-price')).toHaveLength(1)
    })

    it('does not fall back to the default model when ?files= comes without ?stp=', async () => {
      const wrapper = await mountPage({ query: '?files=5' })

      expect(wrapper.findAllComponents(UploadFiles2)[0].props('modelValue')).toEqual([5])
      expect(wrapper.findAllComponents(UploadFiles2)[0].props('stp_id')).toBeUndefined()
      expect(fetchCalls('/calculate-price')).toHaveLength(0)
      // No model: zero-priced placeholder result with the current quantity.
      expect(resultProp(wrapper)).toEqual({
        total_price: 0,
        detail_price: 0,
        detail_price_one: 0,
        quantity: 1,
      })
    })

    it('ignores a non-numeric ?stp=', async () => {
      const wrapper = await mountPage({ query: '?files=5&stp=abc' })

      expect(wrapper.findAllComponents(UploadFiles2)[0].props('stp_id')).toBeUndefined()
      expect(fetchCalls('/calculate-price')).toHaveLength(0)
    })

    it('falls back to the default model for ?stp= without ?files=', async () => {
      const wrapper = await mountPage({ query: '?stp=9' })

      expect(wrapper.findAllComponents(UploadFiles2)[0].props('modelValue')).toEqual([])
      expect(wrapper.findAllComponents(UploadFiles2)[0].props('stp_id')).toBe(2)
      expect(lastCalcBody().file_id).toBe(2)
    })

    it('prices a model stored locally by sending its file data instead of file_id', async () => {
      const localId = await saveFile3D('part.stp', 'ISO-10303', 'stp')
      const wrapper = await mountPage({ query: `?files=1&stp=${localId}` })

      expect(wrapper.findAllComponents(UploadFiles2)[0].props('stp_id')).toBe(localId)
      const body = lastCalcBody()
      expect(body).toMatchObject({
        file_name: 'part.stp',
        file_data: 'ISO-10303',
        file_type: 'stp',
      })
      expect(body).not.toHaveProperty('file_id')
    })
  })

  describe('loading materials', () => {
    it('leaves the material empty when the backend returns none', async () => {
      mockJson('/api/v3/materials', { materials: [] })
      const wrapper = await mountPage()

      const select = wrapper.findComponent(SelectGroup)
      expect(select.props('options')).toEqual([])
      expect(select.props('modelValue')).toBe('')
      expect(lastCalcBody().material_id).toBe('')
    })

    it('survives a non-ok response', async () => {
      mockStatus('/api/v3/materials', 404)
      const wrapper = await mountPage()

      expect(wrapper.findComponent(SelectGroup).props('options')).toEqual([])
      expect(wrapper.findComponent(SelectGroup).props('modelValue')).toBe('')
      // Bootstrap still completes and prices the default file.
      expect(fetchCalls('/calculate-price')).toHaveLength(1)
    })

    it('logs a malformed materials body and continues bootstrapping', async () => {
      mockRoute('/api/v3/materials', () => new Response('<html>', { status: 200 }))
      const wrapper = await mountPage()

      expect(consoleError).toHaveBeenCalledWith('Error loading materials:', expect.any(Error))
      expect(wrapper.findComponent(SelectGroup).props('options')).toEqual([])
      expect(fetchCalls('/calculate-price')).toHaveLength(1)
      expect(wrapper.find('.loader-stub').attributes('data-loading')).toBe('false')
    })

    it('groups materials without a family under the default group', async () => {
      mockJson('/api/v3/materials', {
        materials: [{ id: 'x', label: 'Углепластик', family: null }],
      })
      const wrapper = await mountPage()

      expect(wrapper.findComponent(SelectGroup).props('options')).toEqual([
        { label: 'Без группы', options: [{ value: 'x', label: 'Углепластик' }] },
      ])
      expect(wrapper.findComponent(SelectGroup).props('modelValue')).toBe('x')
    })
  })

  describe('bootstrap with an order', () => {
    beforeEach(() => {
      mockJson('/api/v3/orders/7', orderResponse)
    })

    it('fills every field from the order and prices it', async () => {
      const wrapper = await mountPage({ query: '?orderId=7' })

      const orderCall = fetchCalls('/orders/7')[0]
      expect(orderCall.method).toBe('GET')
      // The default demo file must not be applied for an existing order.
      expect(fetchCalls('/calculate-price')).toHaveLength(1)
      expect(lastCalcBody()).toEqual({
        service_id: 'composite',
        file_id: 3,
        quantity: 4,
        length: 200,
        width: 40,
        height: 50,
        material_id: '2',
        cover_id: ['2'],
        is_need_special_equipment: false,
        n_dimensions: 77,
        k_otk: '1.5',
        k_cert: ['x'],
        deadline: '2026-12-01T00:00:00.000Z',
      })

      expect(wrapper.findComponent(SelectGroup).props('modelValue')).toBe('2')
      expect(wrapper.findComponent(Input).props('modelValue')).toBe('4')
      expect(wrapper.findComponent(CoefficientCover2).props('modelValue')).toEqual(['2'])
      expect(wrapper.findComponent(CoefficientOtk2).props('modelValue')).toBe('1.5')
      expect(wrapper.findComponent({ name: CHECKBOX_NAME }).props('modelValue')).toBe(false)
      expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('Please hurry')
      for (const upload of wrapper.findAllComponents(UploadFiles2)) {
        expect(upload.props('modelValue')).toEqual([10, 11])
        expect(upload.props('stp_id')).toBe(3)
      }

      const submit = wrapper.findAllComponents(CalculateSubmit2)[0]
      expect(submit.props('orderId')).toBe(7)
      expect(submit.props('specialInstructions')).toBe('Please hurry')
      expect(submit.props('payload')).toMatchObject({
        service_id: 'composite',
        order_name: 'Order X',
        order_code: 'ABC-001',
        file_id: 3,
        document_ids: [10, 11],
        quantity: 4,
        length: 200,
        width: 40,
        height: 50,
        material_id: '2',
        cover_id: ['2'],
        is_need_special_equipment: false,
        n_dimensions: 77,
        k_otk: '1.5',
        k_cert: ['x'],
      })
    })

    it('sends the bearer token for authenticated requests', async () => {
      sessionStorage.setItem('token-store', 'tok-123')
      await mountPage({ query: '?orderId=7' })

      expect(fetchCalls('/orders/7')[0].headers.authorization).toBe('Bearer tok-123')
      expect(fetchCalls('/materials')[0].headers.authorization).toBe('Bearer tok-123')
    })

    it('keeps an array cover_id and derives the deadline from the manufacturing cycle', async () => {
      vi.setSystemTime(new Date(2026, 2, 10, 12, 0, 0))
      mockJson('/api/v3/orders/7', {
        ...orderResponse,
        cover_id: ['1', '3'],
        deadline: undefined,
        manufacturing_cycle: 5,
      })
      const wrapper = await mountPage({ query: '?orderId=7' })

      expect(wrapper.findComponent(CoefficientCover2).props('modelValue')).toEqual(['1', '3'])
      expect(lastCalcBody().cover_id).toEqual(['1', '3'])
      expect(lastCalcBody().deadline).toBe(new Date(2026, 2, 15).toISOString())
    })

    it('keeps defaults for fields the order does not provide', async () => {
      mockJson('/api/v3/orders/7', {
        file_id: 0,
        document_ids: undefined,
        length: 0,
        width: 0,
        height: 0,
        quantity: 0,
        material_id: '',
        cover_id: null,
        n_dimensions: 0,
        k_otk: '',
        k_cert: null,
        manufacturing_cycle: 0,
      })
      const wrapper = await mountPage({ query: '?orderId=7' })

      // Without a file id there is nothing to price.
      expect(fetchCalls('/calculate-price')).toHaveLength(0)
      expect(wrapper.findComponent(Input).props('modelValue')).toBe('1')
      // Nothing came from the order, so the first material wins.
      expect(wrapper.findComponent(SelectGroup).props('modelValue')).toBe('1')
      expect(wrapper.findComponent(CoefficientCover2).props('modelValue')).toEqual([])
      expect(wrapper.findComponent(CoefficientOtk2).props('modelValue')).toBe('1.0')
      expect(wrapper.findComponent({ name: CHECKBOX_NAME }).props('modelValue')).toBe(true)
      expect(wrapper.findAllComponents(UploadFiles2)[0].props('modelValue')).toEqual([])
      expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('')
      expect(wrapper.findAllComponents(CalculateSubmit2)[0].props('payload')).toMatchObject({
        order_name: '',
        order_code: '3000.000.001',
        n_dimensions: 55,
        k_cert: ['a', 'f'],
      })
    })

    it('treats a falsy is_need_special_equipment as false and an undefined one as default', async () => {
      mockJson('/api/v3/orders/7', { ...orderResponse, is_need_special_equipment: 0 })
      const w1 = await mountPage({ query: '?orderId=7' })
      expect(w1.findComponent({ name: CHECKBOX_NAME }).props('modelValue')).toBe(false)
      w1.unmount()

      mockJson('/api/v3/orders/7', { ...orderResponse, is_need_special_equipment: undefined })
      const w2 = await mountPage({ query: '?orderId=7' })
      expect(w2.findComponent({ name: CHECKBOX_NAME }).props('modelValue')).toBe(true)
    })

    it('keeps the order material when it is among the loaded ones', async () => {
      mockJson('/api/v3/materials', {
        materials: [{ id: '', label: 'Без материала', family: 'composite' }],
      })
      mockJson('/api/v3/orders/7', { ...orderResponse, material_id: undefined })
      const wrapper = await mountPage({ query: '?orderId=7' })

      // The empty id exists in the list, so it is not replaced by the first option.
      expect(wrapper.findComponent(SelectGroup).props('modelValue')).toBe('')
      expect(lastCalcBody().material_id).toBe('')
    })

    it('logs the failure when the order cannot be loaded and does not price without a model', async () => {
      mockStatus('/api/v3/orders/7', 404)
      const wrapper = await mountPage({ query: '?orderId=7' })

      expect(consoleError).toHaveBeenCalledWith({ error: expect.any(TypeError) })
      expect(fetchCalls('/calculate-price')).toHaveLength(0)
      expect(resultProp(wrapper)).toMatchObject({ total_price: 0, quantity: 1 })
      expect(wrapper.find('.loader-stub').attributes('data-loading')).toBe('false')
    })

    it('treats a zero or invalid orderId as a new order', async () => {
      const wrapper = await mountPage({ query: '?orderId=abc' })

      expect(fetchCalls('/orders')).toHaveLength(0)
      expect(wrapper.findAllComponents(CalculateSubmit2)[0].props('orderId')).toBe(0)
      expect(lastCalcBody().file_id).toBe(2)
    })
  })

  describe('sendData', () => {
    it('shows zero prices and sends nothing when there is no model', async () => {
      const wrapper = await mountPage({ query: '?files=5' })
      expect(fetchCalls('/calculate-price')).toHaveLength(0)

      wrapper.findComponent(Input).vm.$emit('update:modelValue', '9')
      await settle()

      expect(fetchCalls('/calculate-price')).toHaveLength(0)
      expect(resultProp(wrapper)).toEqual({
        total_price: 0,
        detail_price: 0,
        detail_price_one: 0,
        quantity: 9,
      })
    })

    it('keeps previous result data but zeroes prices after the model disappears', async () => {
      const wrapper = await mountPage()
      expect(resultProp(wrapper)).toEqual(mockCalculatePrice)

      wrapper.findAllComponents(UploadFiles2)[0].vm.$emit('update:stp_id', undefined)
      await settle()

      expect(resultProp(wrapper)).toEqual({
        ...mockCalculatePrice,
        total_price: 0,
        detail_price: 0,
        detail_price_one: 0,
        quantity: 1,
      })
      expect(fetchCalls('/calculate-price')).toHaveLength(1)
    })

    it('swallows a failing response body and clears the loader', async () => {
      mockRoute('/api/v3/calculate-price', () => new Response('oops', { status: 200 }), {
        method: 'POST',
      })
      const wrapper = await mountPage()

      expect(consoleError).toHaveBeenCalledWith({ error: expect.any(SyntaxError) })
      expect(resultProp(wrapper)).toBeNull()
      expect(wrapper.find('.loader-stub').attributes('data-loading')).toBe('false')
    })

    it('reports a server error through ElMessage without breaking the page', async () => {
      mockStatus('/api/v3/calculate-price', 500, { detail: 'boom' }, { method: 'POST' })
      const wrapper = await mountPage()

      expect(ElMessage.error).toHaveBeenCalledWith('Ошибка сервера 500')
      expect(wrapper.find('.loader-stub').attributes('data-loading')).toBe('false')
    })

    it('shows the loader while a recalculation is pending', async () => {
      const wrapper = await mountPage()
      const loader = () => wrapper.find('.loader-stub').attributes('data-loading')
      expect(loader()).toBe('false')

      wrapper.findComponent(Input).vm.$emit('update:modelValue', '3')
      await flushPromises()
      expect(loader()).toBe('true')

      await vi.advanceTimersByTimeAsync(1100)
      await flushPromises()
      expect(loader()).toBe('false')
    })

    it('recalculates when the document list asks for it', async () => {
      const wrapper = await mountPage()
      expect(fetchCalls('/calculate-price')).toHaveLength(1)

      const docs = wrapper.findAllComponents(DocumentShowByIds2)
      expect(docs).toHaveLength(2)
      docs[1].vm.$emit('calculate')
      await settle()
      docs[0].vm.$emit('calculate')
      await settle()

      expect(fetchCalls('/calculate-price')).toHaveLength(3)
      expect(lastCalcBody().file_id).toBe(2)
    })
  })

  describe('watchers', () => {
    it('does not recalculate for changes made while bootstrapping', async () => {
      const wrapper = await mountPage({ query: '?files=5,6&stp=7', wait: false })
      // Edits made before bootstrap ends must not trigger extra requests.
      wrapper.findComponent(Input).vm.$emit('update:modelValue', '4')
      await settle()

      expect(fetchCalls('/calculate-price')).toHaveLength(1)
      expect(lastCalcBody().quantity).toBe(4)
    })

    it('recalculates when the quantity changes after bootstrapping', async () => {
      const wrapper = await mountPage()

      wrapper.findComponent(Input).vm.$emit('update:modelValue', '12')
      await settle()

      expect(fetchCalls('/calculate-price')).toHaveLength(2)
      expect(lastCalcBody().quantity).toBe(12)
      expect(wrapper.findComponent(Input).props('modelValue')).toBe('12')
    })

    it.each(['0', '-3', 'abc', ''])('falls back to quantity 1 for input %j', async (raw) => {
      const wrapper = await mountPage()
      wrapper.findComponent(Input).vm.$emit('update:modelValue', '5')
      await settle()
      expect(lastCalcBody().quantity).toBe(5)

      wrapper.findComponent(Input).vm.$emit('update:modelValue', raw)
      await settle()

      expect(lastCalcBody().quantity).toBe(1)
      expect(wrapper.findComponent(Input).props('modelValue')).toBe('1')
    })

    it('recalculates with the selected material', async () => {
      const wrapper = await mountPage()

      wrapper.findComponent(SelectGroup).vm.$emit('update:modelValue', '2')
      await settle()

      expect(fetchCalls('/calculate-price')).toHaveLength(2)
      expect(lastCalcBody().material_id).toBe('2')
    })

    it('recalculates when the special-equipment checkbox is toggled', async () => {
      const wrapper = await mountPage()
      const checkbox = wrapper.findComponent({ name: CHECKBOX_NAME })
      expect(checkbox.props('modelValue')).toBe(true)

      checkbox.vm.$emit('update:modelValue', false)
      await settle()

      expect(lastCalcBody().is_need_special_equipment).toBe(false)
      expect(wrapper.findComponent({ name: CHECKBOX_NAME }).props('modelValue')).toBe(false)
    })

    it('recalculates when cover or OTK controls change', async () => {
      const wrapper = await mountPage()
      const cover = wrapper.findComponent(CoefficientCover2)
      expect(cover.props('excludeLabels')).toEqual(['Гальваника'])

      cover.vm.$emit('update:modelValue', ['2', '3'])
      await settle()
      expect(lastCalcBody().cover_id).toEqual(['2', '3'])

      wrapper.findComponent(CoefficientOtk2).vm.$emit('update:modelValue', '2.0')
      await settle()
      expect(lastCalcBody().k_otk).toBe('2.0')
      expect(fetchCalls('/calculate-price')).toHaveLength(3)
    })

    it('recalculates for the model chosen through the uploader and remounts the CAD viewer', async () => {
      const wrapper = await mountPage()
      const cad = () => wrapper.findComponent({ name: 'CadShowById' })
      expect(cad().props('modelValue')).toBe(2)
      const uidBefore = cad().vm.$.uid

      wrapper.findAllComponents(UploadFiles2)[1].vm.$emit('update:stp_id', 4)
      await settle()

      expect(lastCalcBody().file_id).toBe(4)
      expect(cad().props('modelValue')).toBe(4)
      expect(cad().vm.$.uid).not.toBe(uidBefore)
    })

    it('keeps the CAD viewer mounted when the file id does not change', async () => {
      const wrapper = await mountPage()
      const cad = () => wrapper.findComponent({ name: 'CadShowById' })
      const uidBefore = cad().vm.$.uid

      wrapper.findAllComponents(UploadFiles2)[0].vm.$emit('update:stp_id', 2)
      await settle()

      expect(cad().vm.$.uid).toBe(uidBefore)
      expect(fetchCalls('/calculate-price')).toHaveLength(1)
    })

    const documentEmitters: [string, (w: VueWrapper) => VueWrapper][] = [
      ['desktop uploader', (w) => w.findAllComponents(UploadFiles2)[0]],
      ['mobile uploader', (w) => w.findAllComponents(UploadFiles2)[1]],
      ['mobile document list', (w) => w.findAllComponents(DocumentShowByIds2)[0]],
      ['desktop document list', (w) => w.findAllComponents(DocumentShowByIds2)[1]],
    ]

    it.each(documentEmitters)('syncs the model id emitted by the %s', async (_name, pick) => {
      const wrapper = await mountPage()

      pick(wrapper).vm.$emit('update:stp_id', 6)
      await settle()

      expect(lastCalcBody().file_id).toBe(6)
      expect(wrapper.findComponent({ name: 'CadShowById' }).props('modelValue')).toBe(6)
      for (const upload of wrapper.findAllComponents(UploadFiles2)) {
        expect(upload.props('stp_id')).toBe(6)
      }
      for (const docs of wrapper.findAllComponents(DocumentShowByIds2)) {
        expect(docs.props('stp_id')).toBe(6)
      }
    })

    it('recalculates when the CAD viewer selects another model', async () => {
      const wrapper = await mountPage()

      wrapper.findComponent({ name: 'CadShowById' }).vm.$emit('update:modelValue', 5)
      await settle()

      expect(lastCalcBody().file_id).toBe(5)
      expect(wrapper.findAllComponents(UploadFiles2)[0].props('stp_id')).toBe(5)
    })

    it.each(documentEmitters)('syncs the documents emitted by the %s', async (_name, pick) => {
      const wrapper = await mountPage()

      pick(wrapper).vm.$emit('update:modelValue', [8, 9])
      await settle()

      expect(fetchCalls('/calculate-price')).toHaveLength(1)
      for (const upload of wrapper.findAllComponents(UploadFiles2)) {
        expect(upload.props('modelValue')).toEqual([8, 9])
      }
      for (const docs of wrapper.findAllComponents(DocumentShowByIds2)) {
        expect(docs.props('modelValue')).toEqual([8, 9])
      }
      expect(wrapper.findAllComponents(CalculateSubmit2)[0].props('payload')).toMatchObject({
        document_ids: [8, 9],
      })
    })

    it('forces service_id back to composite', async () => {
      const wrapper = await mountPage()
      const vm = wrapper.vm as unknown as { service_id: string }
      expect(wrapper.findAllComponents(DocumentShowByIds2)[0].props('service_id')).toBe('composite')

      vm.service_id = 'cnc-milling'
      await settle()

      expect(vm.service_id).toBe('composite')
      for (const docs of wrapper.findAllComponents(DocumentShowByIds2)) {
        expect(docs.props('service_id')).toBe('composite')
      }
    })

    it('leaves service_id alone when it is already composite', async () => {
      const wrapper = await mountPage()
      const vm = wrapper.vm as unknown as { service_id: string }

      vm.service_id = 'composite'
      await settle()

      expect(vm.service_id).toBe('composite')
    })
  })

  describe('submit and results', () => {
    it('passes the current payload and result to both submit buttons', async () => {
      const wrapper = await mountPage()
      const submits = wrapper.findAllComponents(CalculateSubmit2)

      expect(submits).toHaveLength(2)
      for (const submit of submits) {
        expect(submit.props('orderId')).toBe(0)
        expect(submit.props('lastResult')).toEqual(mockCalculatePrice)
        expect(submit.props('detailingForManager')).toBe(true)
        expect(submit.props('payload')).toMatchObject({
          service_id: 'composite',
          order_name: '',
          order_code: '3000.000.001',
          file_id: 2,
          document_ids: [],
          material_id: '1',
        })
      }
      expect(submits[0].props('hideBackButton')).toBe(false)
      expect(submits[1].props('hideBackButton')).toBe(true)
      expect(submits[1].props('saveLabel')).toBe('Сохранить')
    })

    it.each([0, 1])('replaces the result when submit %i emits updateResult', async (index) => {
      const wrapper = await mountPage()
      const updated = { ...mockCalculatePrice, total_price: 777, detail_price: 777 }

      wrapper.findAllComponents(CalculateSubmit2)[index].vm.$emit('updateResult', updated)
      await flushPromises()

      expect(resultProp(wrapper)).toEqual(updated)
      expect(wrapper.findAllComponents(CalculateSubmit2)[0].props('lastResult')).toEqual(updated)
      // An externally supplied result must not trigger another calculation.
      expect(fetchCalls('/calculate-price')).toHaveLength(1)
    })

    it.each([0, 1])('accepts showInfo from submit %i', async (index) => {
      const wrapper = await mountPage()
      const vm = wrapper.vm as unknown as { isInfoVisible: boolean }
      expect(vm.isInfoVisible).toBe(false)

      wrapper.findAllComponents(CalculateSubmit2)[index].vm.$emit('showInfo')
      await flushPromises()

      expect(vm.isInfoVisible).toBe(true)
    })

    it('mirrors the description field into the submit props', async () => {
      const wrapper = await mountPage()
      const textarea = wrapper.find('textarea')

      await textarea.setValue('Нужна оснастка')

      for (const submit of wrapper.findAllComponents(CalculateSubmit2)) {
        expect(submit.props('specialInstructions')).toBe('Нужна оснастка')
      }
      // Free text is not part of the price calculation.
      expect(fetchCalls('/calculate-price')).toHaveLength(1)
    })
  })

  describe('roles', () => {
    it('shows the order description field to regular users and hides suitable machines', async () => {
      const wrapper = await mountPage()

      expect(wrapper.find('textarea').exists()).toBe(true)
      expect(wrapper.text()).toContain('Описание заказа')
      expect(wrapper.text()).toContain('Требуется изготовление')
      expect(wrapper.findComponent(SuitableMachines).exists()).toBe(false)
    })

    it('hides the order description field for managers', async () => {
      const wrapper = await mountPage({ state: managerState })

      expect(wrapper.find('textarea').exists()).toBe(false)
      expect(wrapper.text()).not.toContain('Описание заказа')
      expect(wrapper.findComponent(SuitableMachines).exists()).toBe(false)
      // The manager still gets the full calculator.
      expect(wrapper.findComponent(Input).exists()).toBe(true)
      expect(fetchCalls('/calculate-price')).toHaveLength(1)
    })

    it('shows suitable machines for the admin user', async () => {
      const machines = [{ id: 'm1', name: 'Станок 1' }]
      mockJson('/api/v3/calculate-price', { ...mockCalculatePrice, suitable_machines: machines }, {
        method: 'POST',
      })
      const wrapper = await mountPage({ state: { user: { profile: { username: 'admin' } } } })

      const suitable = wrapper.findComponent(SuitableMachines)
      expect(suitable.exists()).toBe(true)
      expect(suitable.props('machines')).toEqual(machines)
    })

    it('passes an empty machine list to admin before any result exists', async () => {
      const wrapper = await mountPage({
        query: '?files=5',
        state: { user: { profile: { username: 'admin' } } },
      })

      expect(wrapper.findComponent(SuitableMachines).props('machines')).toEqual([])
    })

    it('renders the admin machines block with an empty list when the result has none', async () => {
      mockJson('/api/v3/calculate-price', { ...mockCalculatePrice, suitable_machines: undefined }, {
        method: 'POST',
      })
      const wrapper = await mountPage({ state: { user: { profile: { username: 'admin' } } } })

      expect(wrapper.findComponent(SuitableMachines).props('machines')).toEqual([])
    })
  })
})
