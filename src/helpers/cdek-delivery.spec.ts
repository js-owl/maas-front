import { describe, it, expect } from 'vitest'
import {
  filterPvzPoints,
  kitDeliveryQuoteReadiness,
  pvzCodeLabel,
  pvzCompactLabel,
  pvzCoordinates,
  pvzFullLabel,
  pvzSearchScore,
  pvzStaticMapUrl,
  pvzStreetLabel,
  pvzYandexMapsUrl,
  type CdekPvz,
} from '@/helpers/cdek-delivery'

const points: CdekPvz[] = [
  {
    code: 'MSK16',
    name: 'MSK16, Москва, ул. Мясницкая',
    location: { address: 'ул. Мясницкая, 24', postal_code: '101000' },
  },
  {
    code: 'MSK65',
    name: 'MSK65, Москва, ул. Динамовская',
    location: { address: 'ул. Динамовская, 1А', postal_code: '109044' },
  },
]

describe('pvzCodeLabel', () => {
  it('shows only code in the closed select', () => {
    expect(pvzCodeLabel(points[0])).toBe('MSK16')
    expect(pvzStreetLabel(points[0])).toBe('ул. Мясницкая, 24')
    expect(pvzCompactLabel(points[0])).toBe('MSK16 · ул. Мясницкая, 24')
    expect(pvzFullLabel(points[0])).toContain('MSK16')
  })
})

describe('pvz map helpers', () => {
  const pointWithCoords: CdekPvz = {
    code: 'MSK16',
    location: {
      address: 'ул. Мясницкая, 24',
      latitude: 55.7588,
      longitude: 37.6342,
    },
  }

  it('builds coordinates and map urls', () => {
    expect(pvzCoordinates(pointWithCoords)).toEqual({ lat: 55.7588, lon: 37.6342 })
    const yandex = pvzYandexMapsUrl(pointWithCoords)!
    expect(yandex).toContain('yandex.ru/maps')
    expect(yandex).toContain('pt=37.6342%2C55.7588%2Cpm2rdm')
    expect(yandex).toContain('ll=37.6342%2C55.7588')
    const staticMap = pvzStaticMapUrl(pointWithCoords)!
    expect(staticMap).toContain('static-maps.yandex.ru')
    expect(staticMap).toContain('pm2rdm')
  })

  it('returns null without coordinates', () => {
    expect(pvzCoordinates({ code: 'X' })).toBeNull()
    expect(pvzStaticMapUrl({ code: 'X' })).toBeNull()
  })
})

describe('pvzSearchScore', () => {
  it('prefers exact PVZ code match', () => {
    expect(pvzSearchScore(points[0], 'msk16')).toBeGreaterThan(pvzSearchScore(points[1], 'msk16'))
  })

  it('matches street substring', () => {
    expect(pvzSearchScore(points[1], 'динамов')).toBeGreaterThan(0)
    expect(pvzSearchScore(points[0], 'динамов')).toBe(-1)
  })
})

describe('filterPvzPoints', () => {
  it('returns all points for empty query', () => {
    expect(filterPvzPoints(points, '')).toHaveLength(2)
  })

  it('filters by code prefix', () => {
    const filtered = filterPvzPoints(points, 'msk1')
    expect(filtered).toHaveLength(1)
    expect(filtered[0].code).toBe('MSK16')
  })

  it('filters by street and ranks best match first', () => {
    const filtered = filterPvzPoints(points, 'динамовская')
    expect(filtered[0].code).toBe('MSK65')
  })
})

describe('kitDeliveryQuoteReadiness', () => {
  it('blocks empty kits', () => {
    const result = kitDeliveryQuoteReadiness([])
    expect(result.ready).toBe(false)
    if (!result.ready) expect(result.reason).toMatch(/расчёты/)
  })

  it('blocks rows without mat_weight', () => {
    const result = kitDeliveryQuoteReadiness([{ mat_weight: 0 }, { mat_weight: 1.2 }])
    expect(result.ready).toBe(false)
  })

  it('allows kits with positive weight on every row', () => {
    expect(kitDeliveryQuoteReadiness([{ mat_weight: 0.5 }]).ready).toBe(true)
  })
})
