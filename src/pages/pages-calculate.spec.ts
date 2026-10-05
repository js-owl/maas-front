import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, type Component } from 'vue'
import { ElMessage } from 'element-plus'
import { mockCalculatePrice, mockCoefficients, mockMaterials } from '@/test/fixtures'
import { mockJson } from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import CalculateMillingPage2 from './CalculateMillingPage2.vue'
import CalculatePrintingPage2 from './CalculatePrintingPage2.vue'
import CalculateOtherPage2 from './CalculateOtherPage2.vue'
import CalculateCompositePage from './CalculateCompositePage.vue'
import CalculateGalvanicPage from './CalculateGalvanicPage.vue'

async function flush(ms = 0) {
  await nextTick()
  if (ms) await new Promise((r) => setTimeout(r, ms))
  await nextTick()
}

const calcStubs = {
  UploadFiles: true,
  UploadFiles2: true,
  DocumentShowByIds: true,
  DocumentShowByIds2: true,
  CadShowById: true,
  CadPreview: true,
  CalculateResults: true,
  CalculateResultSpecialist: true,
  CalculateSubmit2: true,
  DialogLogin: true,
  SuitableMachines: true,
  CoefficientOtk2: true,
  CoefficientCover2: true,
  Input: true,
  SelectCalc: true,
  SelectGroup: true,
  Loader: true,
  teleport: false,
}

const routes = [
  { path: '/', name: 'home', component: { template: '<div />' } },
  { path: '/milling', name: 'milling', component: { template: '<div />' } },
  { path: '/printing', name: 'printing', component: { template: '<div />' } },
  { path: '/other', name: 'other', component: { template: '<div />' } },
  { path: '/composite', name: 'composite', component: { template: '<div />' } },
  { path: '/galvanic', name: 'galvanic', component: { template: '<div />' } },
]

function mockCalcApis() {
  mockJson('/api/v3/calculate-price', mockCalculatePrice)
  mockJson('/api/v3/coefficients', mockCoefficients)
  mockJson('/api/v3/materials', mockMaterials)
  mockJson('/api/v3/other_services', { other_services: [] })
  mockJson('/api/v3/operations_available', {
    values: [
      {
        id: 'ep_zinc',
        group: 'zinc',
        path: ['zinc'],
        label: 'Цинкование',
        max_part_size_label: '500',
        max_weight_kg: 10,
      },
    ],
  })
  mockJson('/api/v3/electroplating_material_families', {
    values: [{ id: 'alum', label: 'Алюминий' }],
  })
}

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(ElMessage, 'success').mockImplementation(() => undefined as never)
  vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)
  vi.spyOn(ElMessage, 'warning').mockImplementation(() => undefined as never)
  mockCalcApis()
})

async function mountCalc(Page: Component, path: string) {
  const { wrapper } = await mountWithPlugins(Page, {
    stubs: calcStubs,
    stubActions: false,
    routes,
    initialRoute: path,
  })
  // Calculate pages enforce MIN_LOADING_MS ≈ 1s before clearing the loader.
  await flush(1100)
  return wrapper
}

describe('Calculate* pages', () => {
  it.each([
    [CalculateMillingPage2, '/milling'],
    [CalculatePrintingPage2, '/printing'],
    [CalculateOtherPage2, '/other'],
    [CalculateCompositePage, '/composite'],
    [CalculateGalvanicPage, '/galvanic'],
  ] as const)('mounts and bootstraps %s', async (Page, path) => {
    const wrapper = await mountCalc(Page, path)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html().length).toBeGreaterThan(80)
  })
})
