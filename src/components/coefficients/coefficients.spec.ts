import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { clearCoefficientsCache } from './api-coefficients'
import { mockCoefficients, mockOtherServices } from '@/test/fixtures'
import { mockJson, mockStatus } from '@/test/fetch-mock'
import CoefficientFinish from './CoefficientFinish.vue'
import CoefficientTolerance from './CoefficientTolerance.vue'
import CoefficientCover from './CoefficientCover.vue'
import CoefficientCover2 from './CoefficientCover2.vue'
import CoefficientOtk from './CoefficientOtk.vue'
import CoefficientOtk2 from './CoefficientOtk2.vue'
import CoefficientCertificate from './CoefficientCertificate.vue'
import CoefficientQuantity from './CoefficientQuantity.vue'
import CoefficientSize from './CoefficientSize.vue'
import CoefficientTooling from './CoefficientTooling.vue'
import CoefficientType from './CoefficientType.vue'
import CoefficientProcess from './CoefficientProcess.vue'
import Length from './Length.vue'
import Width from './Width.vue'
import Height from './Height.vue'
import Diameter from './Diameter.vue'
import PaintArea from './PaintArea.vue'
import PaintType from './PaintType.vue'
import PaintColor from './PaintColor.vue'
import PaintLakery from './PaintLakery.vue'
import PaintPrepare from './PaintPrepare.vue'
import PaintPrimer from './PaintPrimer.vue'
import PlasticPreparation from './PlasticPreparation.vue'
import ProcessSelect from './ProcessSelect.vue'

async function flush() {
  await nextTick()
  await new Promise((r) => setTimeout(r, 0))
  await nextTick()
}

beforeEach(() => {
  clearCoefficientsCache()
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

describe('coefficients loaded from API', () => {
  const selectMount = (Comp: any, props: Record<string, unknown>) =>
    mount(Comp, {
      props,
      global: { stubs: { teleport: false, transition: false } },
    })

  it('CoefficientFinish loads finish options', async () => {
    mockJson('/api/v3/coefficients', mockCoefficients)
    const wrapper = selectMount(CoefficientFinish, { modelValue: '' })
    await flush()
    expect(wrapper.text()).toContain('Шероховатость')
    const options = wrapper.findAllComponents({ name: 'ElOption' })
    expect(options.map((o) => o.props('label'))).toContain('Ra 0.8')
  })

  it('CoefficientTolerance loads tolerance options', async () => {
    mockJson('/api/v3/coefficients', mockCoefficients)
    const wrapper = selectMount(CoefficientTolerance, { modelValue: '' })
    await flush()
    expect(wrapper.text()).toContain('Квалитет точности')
    const options = wrapper.findAllComponents({ name: 'ElOption' })
    expect(options.map((o) => o.props('label'))).toContain('h7')
  })

  it('CoefficientCover filters excluded labels', async () => {
    mockJson('/api/v3/coefficients', mockCoefficients)
    const wrapper = mount(CoefficientCover, {
      props: { modelValue: [], excludeLabels: ['Покраска'] },
    })
    await flush()
    expect(wrapper.text()).toContain('Анодирование')
    expect(wrapper.text()).not.toContain('Покраска')
  })

  it('CoefficientCover2 falls back when coefficients fail', async () => {
    mockStatus('/api/v3/coefficients', 500)
    const wrapper = mount(CoefficientCover2, { props: { modelValue: [] } })
    await flush()
    expect(wrapper.text()).toContain('Покраска')
  })

  it('CoefficientCover2 loads covers on success', async () => {
    mockJson('/api/v3/coefficients', mockCoefficients)
    const wrapper = mount(CoefficientCover2, { props: { modelValue: [] } })
    await flush()
    expect(wrapper.text()).toContain('Анодирование')
  })
})

describe('static coefficient selects / radios / numbers', () => {
  it.each([
    [CoefficientOtk, 'Изготовителя', { modelValue: '1.0' }],
    [CoefficientOtk2, 'Изготовитель', { modelValue: '1.0' }],
    [CoefficientCertificate, 'Сертификация материалов', { modelValue: [] }],
    [CoefficientType, 'Тип детали', { modelValue: 1 }],
    [CoefficientProcess, 'Процесс', { modelValue: 1 }],
    [PlasticPreparation, 'Способ изготовления', { modelValue: 'a' }],
    [PaintType, 'Вид краски', { modelValue: 'epoxy' }],
    [PaintColor, 'Цвет в RAL', { modelValue: '3032' }],
    [PaintLakery, 'Лакировка', { modelValue: 'a' }],
    [PaintPrepare, 'Тип предварительной подготовки', { modelValue: 'a' }],
    [PaintPrimer, 'Грунтовка', { modelValue: 'a' }],
    [CoefficientTooling, 'Требуется изготовление', { modelValue: '1' }],
  ] as const)('renders %s label', (Comp, needle, props) => {
    const wrapper = mount(Comp as any, { props: { ...props } })
    expect(wrapper.text()).toContain(needle)
  })

  it.each([
    [Length, 'Длина'],
    [Width, 'Ширина'],
    [Height, 'Высота'],
    [Diameter, 'Диаметр'],
    [CoefficientQuantity, 'Кол-во, шт'],
    [CoefficientSize, 'типоразмеров'],
    [PaintArea, 'Площадь покраски'],
  ] as const)('number field %s shows label', (Comp, needle) => {
    const wrapper = mount(Comp as any, { props: { modelValue: 10 } })
    expect(wrapper.text()).toContain(needle)
  })

  it('CoefficientTooling toggles between tooling ids', async () => {
    const wrapper = mount(CoefficientTooling, { props: { modelValue: '1' } })
    const checkbox = wrapper.findComponent({ name: 'ElCheckbox' })
    await checkbox.vm.$emit('update:modelValue', true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2'])
    await checkbox.vm.$emit('update:modelValue', false)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['1'])
  })
})

describe('ProcessSelect', () => {
  it('calls other_services but keeps empty list when response is an object', async () => {
    mockJson('/api/v3/other_services', mockOtherServices)
    const wrapper = mount(ProcessSelect, { props: { modelValue: null } })
    await flush()
    expect(wrapper.text()).toContain('Процесс')
    // Current bug: Array.isArray(objectResponse) is false, so options stay empty.
    expect(wrapper.findAll('.el-select-dropdown__item').length).toBe(0)
  })

  it('survives a failed other_services request', async () => {
    mockStatus('/api/v3/other_services', 500)
    const wrapper = mount(ProcessSelect, { props: { modelValue: null } })
    await flush()
    expect(wrapper.text()).toContain('Процесс')
  })
})
