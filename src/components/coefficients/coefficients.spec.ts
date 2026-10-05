import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { clearCoefficientsCache } from './api-coefficients'
import { mockCoefficients } from '@/test/fixtures'
import { mockJson, mockStatus } from '@/test/fetch-mock'
import CoefficientCover2 from './CoefficientCover2.vue'
import CoefficientOtk2 from './CoefficientOtk2.vue'

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

describe('static coefficient selects', () => {
  it('CoefficientOtk2 renders its label', () => {
    const wrapper = mount(CoefficientOtk2, { props: { modelValue: '1.0' } })
    expect(wrapper.text()).toContain('Изготовитель')
  })
})
