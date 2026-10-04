import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mockMaterials } from '@/test/fixtures'
import { fetchCalls, mockJson, mockStatus } from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import MaterialMachining from './MaterialMachining.vue'
import MaterialMilling from './MaterialMilling.vue'
import MaterialPrinting from './MaterialPrinting.vue'

async function flush() {
  await nextTick()
  await new Promise((r) => setTimeout(r, 0))
  await nextTick()
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

describe('MaterialMachining', () => {
  it('loads materials via store and defaults selection', async () => {
    mockJson('/api/v3/materials', mockMaterials)
    const { wrapper } = await mountWithPlugins(MaterialMachining, {
      props: { modelValue: null },
      stubActions: false,
      initialState: { auth: { token: 'tok' } },
    })
    await flush()
    expect(wrapper.text()).toContain('Материал')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1'])
  })
})

describe('MaterialMilling / MaterialPrinting', () => {
  it('MaterialMilling loads cnc-milling materials', async () => {
    mockJson('/api/v3/materials?process=cnc-milling', mockMaterials)
    const { wrapper } = await mountWithPlugins(MaterialMilling, {
      props: { modelValue: null },
      stubActions: false,
      initialState: { auth: { token: 'tok' } },
      stubs: { teleport: false, transition: false },
    })
    await flush()
    expect(wrapper.text()).toContain('Материал')
    expect(fetchCalls('/api/v3/materials?process=cnc-milling').length).toBeGreaterThan(0)
    const labels = wrapper.findAllComponents({ name: 'ElOption' }).map((o) => o.props('label'))
    expect(labels).toContain('Алюминий Д16Т')
  })

  it('MaterialPrinting loads printing materials', async () => {
    mockJson('/api/v3/materials?process=printing', mockMaterials)
    const { wrapper } = await mountWithPlugins(MaterialPrinting, {
      props: { modelValue: null },
      stubActions: false,
      initialState: { auth: { token: 'tok' } },
      stubs: { teleport: false, transition: false },
    })
    await flush()
    expect(wrapper.text()).toContain('Материал')
    expect(fetchCalls('/api/v3/materials?process=printing').length).toBeGreaterThan(0)
    const labels = wrapper.findAllComponents({ name: 'ElOption' }).map((o) => o.props('label'))
    expect(labels).toContain('Сталь 45')
  })

  it('leaves options empty when the request fails (fallback is unreachable)', async () => {
    mockStatus('/api/v3/materials?process=cnc-milling', 500)
    const { wrapper } = await mountWithPlugins(MaterialMilling, {
      props: { modelValue: null },
      stubActions: false,
      initialState: { auth: { token: 'tok' } },
      stubs: { teleport: false, transition: false },
    })
    await flush()
    expect(wrapper.findAllComponents({ name: 'ElOption' })).toHaveLength(0)
  })
})
