import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useMaterialStore } from '@/stores/material.store'
import { useCoefficientsStore } from '@/stores/coefficients.store'
import { useAuthStore } from '@/stores/auth.store'
import { mockCoefficients, mockMaterials } from '@/test/fixtures'
import { fetchCalls, mockJson, mockRoute, mockStatus } from '@/test/fetch-mock'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
  useAuthStore().setToken('tok', false)
})

describe('material store', () => {
  it('loads materials for a process', async () => {
    mockJson('/api/v3/materials?process=printing', mockMaterials)
    const store = useMaterialStore()
    expect(await store.loadMaterials('printing')).toBe(true)
    expect(store.materials).toEqual([
      { value: '1', label: 'Алюминий Д16Т' },
      { value: '2', label: 'Сталь 45' },
    ])
    expect(store.isLoading).toBe(false)
  })

  it('marks an error when materials cannot be loaded', async () => {
    mockStatus('/api/v3/materials', 500)
    const store = useMaterialStore()
    expect(await store.loadMaterials()).toBe(false)
    expect(store.hasError).toBe(true)
    expect(store.materials).toEqual([])
  })

  it('combines materials from multiple processes into allMaterials', async () => {
    mockJson('/api/v3/materials?process=cnc-lathe', {
      materials: [{ id: '1', label: 'Алюминий Д16Т' }],
    })
    mockJson('/api/v3/materials?process=printing', {
      materials: [
        { id: '1', label: 'Алюминий Д16Т' },
        { id: '3', label: 'PLA' },
      ],
    })
    const store = useMaterialStore()
    await store.setAllMaterials()
    expect(store.allMaterials.map((m) => m.value)).toEqual(['1', '3'])
    expect(store.materials).toHaveLength(2)
  })

  it('reuses allMaterials from storage on later calls', async () => {
    const store = useMaterialStore()
    store.allMaterials = [{ value: 'cached', label: 'Cached' }]
    await store.setAllMaterials()
    expect(store.materials).toEqual([{ value: 'cached', label: 'Cached' }])
  })

  it('sets hasError when combined material lists are empty', async () => {
    mockJson('/api/v3/materials?process=cnc-lathe', { materials: [] })
    mockJson('/api/v3/materials?process=printing', { materials: [] })
    const store = useMaterialStore()
    await store.setAllMaterials()
    expect(store.hasError).toBe(true)
  })

  it('exposes selectedMaterial from the current list', () => {
    const store = useMaterialStore()
    store.setMaterials([{ value: '1', label: 'A' }])
    store.selectedMaterialId = '1'
    expect(store.selectedMaterial).toEqual({ value: '1', label: 'A' })
  })

  it('returns null for selectedMaterial when the id is not in the list', () => {
    const store = useMaterialStore()
    store.setMaterials([{ value: '1', label: 'A' }])
    store.selectedMaterialId = 'missing'
    expect(store.selectedMaterial).toBeNull()
  })

  it('requests /materials without a process filter by default', async () => {
    mockJson('/api/v3/materials', mockMaterials)
    const store = useMaterialStore()
    expect(await store.loadMaterials()).toBe(true)
    expect(fetchCalls('/materials').map((c) => c.url)).toEqual(['/api/v3/materials'])
    expect(store.materials).toHaveLength(2)
  })

  it('treats a payload without materials as an empty list', async () => {
    mockJson('/api/v3/materials?process=printing', {})
    const store = useMaterialStore()
    expect(await store.loadMaterials('printing')).toBe(true)
    expect(store.materials).toEqual([])
    expect(store.hasError).toBe(false)
  })

  it('falls back to static materials when the response body is not JSON', async () => {
    mockRoute('/api/v3/materials', () => new Response('<html>', { status: 200 }))
    const store = useMaterialStore()
    expect(await store.loadMaterials('printing')).toBe(false)
    expect(store.hasError).toBe(true)
    expect(store.isLoading).toBe(false)
    expect(store.materials.map((m) => m.value)).toEqual(['alum_D16T', 'steel_12X18H10T'])
  })

  it('uses the cnc-lathe fallback only for that process when parsing fails', async () => {
    mockRoute('/api/v3/materials', () => new Response('<html>', { status: 200 }))
    const store = useMaterialStore()
    await store.setAllMaterials()
    expect(store.hasError).toBe(false)
    expect(store.materials.map((m) => m.value)).toEqual(['alum_D16T', 'steel_12X18H10T'])
    expect(store.allMaterials).toEqual(store.materials)
  })

  it('keeps the other process when one request fails', async () => {
    mockStatus('/api/v3/materials?process=cnc-lathe', 500)
    mockJson('/api/v3/materials?process=printing', {
      materials: [{ id: '3', label: 'PLA' }],
    })
    const store = useMaterialStore()
    await store.setAllMaterials()
    expect(store.hasError).toBe(false)
    expect(store.materials).toEqual([{ value: '3', label: 'PLA' }])
    expect(store.isLoading).toBe(false)
  })

  it('sets hasError when both process requests fail', async () => {
    mockStatus('/api/v3/materials', 500)
    const store = useMaterialStore()
    await store.setAllMaterials()
    expect(store.hasError).toBe(true)
    expect(store.materials).toEqual([])
    expect(store.allMaterials).toEqual([])
  })
})

describe('coefficients store', () => {
  it('loads and transforms coefficients', async () => {
    mockJson('/api/v3/coefficients', mockCoefficients)
    const store = useCoefficientsStore()
    expect(await store.loadCoefficients()).toBe(true)
    expect(store.coefficients.finish[0]).toEqual({ value: '1', label: 'Ra 0.8' })
    expect(store.allCoefficients.cover[1].label).toBe('Анодирование')
  })

  it('marks an error when the response is not ok', async () => {
    mockStatus('/api/v3/coefficients', 500)
    const store = useCoefficientsStore()
    expect(await store.loadCoefficients()).toBe(false)
    expect(store.hasError).toBe(true)
  })

  it('reuses cached coefficients via setAllCoefficients', async () => {
    const store = useCoefficientsStore()
    store.allCoefficients = {
      finish: [{ value: '1', label: 'cached' }],
      cover: [],
      tolerance: [],
    }
    await store.setAllCoefficients()
    expect(store.coefficients.finish[0].label).toBe('cached')
  })

  it('loads from the API when the cache is empty', async () => {
    mockJson('/api/v3/coefficients', mockCoefficients)
    const store = useCoefficientsStore()
    await store.setAllCoefficients()
    expect(store.coefficients.tolerance.length).toBeGreaterThan(0)
  })

  it('treats missing coefficient groups as empty lists', async () => {
    mockJson('/api/v3/coefficients', { finish: [{ id: 'f', label: 'F' }] })
    const store = useCoefficientsStore()
    expect(await store.loadCoefficients()).toBe(true)
    expect(store.coefficients).toEqual({
      finish: [{ value: 'f', label: 'F' }],
      cover: [],
      tolerance: [],
    })
  })

  it('handles a null payload', async () => {
    mockJson('/api/v3/coefficients', null)
    const store = useCoefficientsStore()
    expect(await store.loadCoefficients()).toBe(true)
    expect(store.coefficients).toEqual({ finish: [], cover: [], tolerance: [] })
  })

  it('marks an error when the response body is not JSON', async () => {
    mockRoute('/api/v3/coefficients', () => new Response('<html>', { status: 200 }))
    const store = useCoefficientsStore()
    expect(await store.loadCoefficients()).toBe(false)
    expect(store.hasError).toBe(true)
    expect(store.isLoading).toBe(false)
    expect(store.allCoefficients).toEqual({ finish: [], cover: [], tolerance: [] })
  })

  it('reuses cached coefficients when only cover or tolerance is filled', async () => {
    const store = useCoefficientsStore()
    store.allCoefficients = { finish: [], cover: [{ value: 'c', label: 'C' }], tolerance: [] }
    await store.setAllCoefficients()
    expect(store.coefficients.cover[0].value).toBe('c')

    store.allCoefficients = { finish: [], cover: [], tolerance: [{ value: 't', label: 'T' }] }
    await store.setAllCoefficients()
    expect(store.coefficients.tolerance[0].value).toBe('t')
    expect(fetchCalls('/coefficients')).toHaveLength(0)
  })

  it('allows manual setCoefficients', () => {
    const store = useCoefficientsStore()
    store.setCoefficients({
      finish: [{ value: 'x', label: 'X' }],
      cover: [],
      tolerance: [],
    })
    expect(store.coefficients.finish[0].value).toBe('x')
  })
})
