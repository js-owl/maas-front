import { describe, expect, it, vi } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import {
  filterPvzPoints,
  pickDefaultPvzCode,
  pvzCompactLabel,
  pvzCoordinates,
  pvzSearchScore,
  pvzStreetLabel,
  type CdekPvz,
} from './cdek-delivery'
import {
  buildPersonalCalcPropertyValues,
  getPersonalCalcPropertyFields,
  isOtherLikeServiceId,
  resolveCompositeMaterialLabels,
  resolveMaterialProcessForService,
} from './personal-calc-properties'
import type { IOrderResponse } from '@/interfaces/order.interface'
import { canonicalForPath } from '@/seo/route-meta'

describe('cdek remaining branches', () => {
  it('falls back through address_full / name for street and compact labels', () => {
    expect(pvzStreetLabel({ location: { address_full: 'полный адрес' } })).toBe('полный адрес')
    expect(pvzStreetLabel({ name: 'только имя' })).toBe('только имя')
    expect(pvzCompactLabel({ code: 'X' })).toBe('X')
    expect(pvzCoordinates({ location: { latitude: 0, longitude: 0 } })).toBeNull()
  })

  it('ranks multi-token and full-text search matches', () => {
    const point: CdekPvz = {
      code: 'SPB1',
      name: 'Пункт',
      location: { address: 'Невский', postal_code: '190000' },
    }
    expect(pvzSearchScore(point, '190000')).toBe(70)
    expect(pvzSearchScore(point, 'невский пункт')).toBe(60)
    expect(filterPvzPoints([point, { code: 'MSK' }], 'невский пункт')[0].code).toBe('SPB1')
  })

  it('falls back when no postal code is available on points', () => {
    expect(pickDefaultPvzCode([{ code: 'A' }, { code: 'B' }], '101000')).toBe('A')
  })
})

describe('personal-calc remaining branches', () => {
  const coefficients = { finish: [], cover: [], tolerance: [] }

  it('covers empty / unknown service and sparse order fields', () => {
    expect(isOtherLikeServiceId(undefined)).toBe(false)
    expect(resolveMaterialProcessForService('unknown-service')).toBeUndefined()
    expect(getPersonalCalcPropertyFields('mystery')).toEqual(getPersonalCalcPropertyFields())

    const values = buildPersonalCalcPropertyValues({
      order: { order_id: 1, service_id: 'cnc-milling' } as IOrderResponse,
      technologyLabel: 'SLS',
      coefficients,
    })
    expect(values.technology).toBe('SLS')
    expect(values.dimensions).toBeUndefined()
    expect(values.partVolume).toBeUndefined()
    expect(values.billableWeight).toBeUndefined()
    expect(values.finishTreatment).toBeUndefined()
  })

  it('returns only a base label when the material has no impregnation', () => {
    expect(
      resolveCompositeMaterialLabels({ material_id: 'm3' } as IOrderResponse, [
        { value: 'm3', label: 'Карбон' },
      ])
    ).toEqual({ base: 'Карбон' })
  })
})

describe('seo remaining branches', () => {
  it('includes BASE_URL when building a canonical URL', () => {
    vi.stubEnv('BASE_URL', '/site-dev/')
    expect(canonicalForPath('/print')).toContain('/site-dev/print')
    expect(canonicalForPath('/')).toMatch(/\/site-dev\/$/)
    vi.unstubAllEnvs()
  })
})

describe('local STP: load existing IndexedDB rows', () => {
  it('hydrates the in-memory cache from IndexedDB when there is no localStorage legacy data', async () => {
    globalThis.indexedDB = new IDBFactory()
    localStorage.clear()
    vi.resetModules()

    const seed = await import('./local-stp-files')
    await seed.saveFile3D('seeded.stp', 'SEED', 'stp')

    vi.resetModules()
    const mod = await import('./local-stp-files')
    await mod.ensureLocalStpCacheReady()

    expect(mod.getLocalStpFiles()[0]?.file_name).toBe('seeded.stp')
  })

  it('refuses to treat a locally cached positive id as a server file id', async () => {
    globalThis.indexedDB = new IDBFactory()
    localStorage.setItem(
      'uploaded_stp_files',
      JSON.stringify([
        {
          id: 99,
          file_name: 'cached.stp',
          file_data: 'X',
          file_type: 'stp',
          created_at: '2026-01-01T00:00:00.000Z',
        },
      ])
    )
    vi.resetModules()
    const mod = await import('./local-stp-files')
    await mod.ensureLocalStpCacheReady()

    expect(mod.getLocalStpFileById(99)?.file_name).toBe('cached.stp')
    expect(mod.isServerFileId(99)).toBe(false)
  })
})
