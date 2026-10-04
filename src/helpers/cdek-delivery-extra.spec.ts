import { describe, expect, it } from 'vitest'
import {
  buildDeliveryPointByCodeQuery,
  buildDeliveryPointsQuery,
  formatCarrierReference,
  formatDeliveryTracking,
  isFinalInvoiceKitStatus,
  normalizePostalCode,
  pickCheapestPvzTariff,
  pickCityCode,
  pickDefaultPvzCode,
  shouldRefreshShipmentOnLoad,
  unwrapList,
  pvzLabel,
  pvzSearchText,
  type CdekPvz,
  type CdekTariff,
} from './cdek-delivery'

describe('unwrapList', () => {
  it('accepts bare arrays and { data: [] } envelopes', () => {
    expect(unwrapList([1, 2])).toEqual([1, 2])
    expect(unwrapList({ data: [3] })).toEqual([3])
    expect(unwrapList({ data: 'x' })).toEqual([])
    expect(unwrapList(null)).toEqual([])
  })
})

describe('city / postal helpers', () => {
  it('picks an exact city match or falls back to the first entry', () => {
    const cities = [
      { code: 44, city: 'Москва' },
      { code: 137, city: 'Санкт-Петербург' },
    ]
    expect(pickCityCode(cities, 'санкт-петербург')).toBe(137)
    expect(pickCityCode(cities, 'unknown')).toBe(44)
    expect(pickCityCode([], 'Москва')).toBeNull()
  })

  it('normalizes Russian postal indexes to 6 digits', () => {
    expect(normalizePostalCode('101-000')).toBe('101000')
    expect(normalizePostalCode('123')).toBe('')
    expect(normalizePostalCode(null)).toBe('')
  })

  it('prefers a PVZ in the same postal index', () => {
    const points: CdekPvz[] = [
      { code: 'A', location: { postal_code: '109044' } },
      { code: 'B', location: { postal_code: '101000' } },
      { code: 'C', location: { postal_code: '101999' } },
    ]
    expect(pickDefaultPvzCode(points, '101000')).toBe('B')
    expect(pickDefaultPvzCode(points, '101111')).toBe('B')
    expect(pickDefaultPvzCode(points, null)).toBe('A')
    expect(pickDefaultPvzCode([], '101000')).toBe('')
  })
})

describe('delivery point queries', () => {
  it('builds list and by-code query strings', () => {
    expect(buildDeliveryPointsQuery(44, '101-000')).toContain('city_code=44')
    expect(buildDeliveryPointsQuery(44, '101-000')).toContain('postal_code=101000')
    expect(buildDeliveryPointsQuery(44)).not.toContain('postal_code')
    expect(buildDeliveryPointByCodeQuery(' MSK16 ')).toContain('code=MSK16')
  })
})

describe('pickCheapestPvzTariff', () => {
  it('keeps only PVZ delivery modes and picks the cheapest', () => {
    const tariffs: CdekTariff[] = [
      { tariff_code: 1, delivery_mode: 1, delivery_sum: 100 },
      { tariff_code: 2, delivery_mode: 2, delivery_sum: 500 },
      { tariff_code: 3, delivery_mode: 4, delivery_sum: 200 },
      { tariff_code: 4, delivery_mode: 2, delivery_sum: undefined },
    ]
    expect(pickCheapestPvzTariff(tariffs)?.tariff_code).toBe(3)
    expect(pickCheapestPvzTariff([])).toBeNull()
  })
})

describe('labels / search text', () => {
  it('builds readable labels from address fields', () => {
    const point: CdekPvz = {
      code: 'MSK16',
      name: 'MSK16 name',
      location: { address: 'ул. А', address_full: 'г. Москва, ул. А' },
    }
    expect(pvzLabel(point)).toContain('MSK16')
    expect(pvzSearchText(point)).toContain('ул. А')
  })
})

describe('shipment tracking helpers', () => {
  it('detects FINAL_INVOICE kit status with or without a Bitrix prefix', () => {
    expect(isFinalInvoiceKitStatus('C3:FINAL_INVOICE')).toBe(true)
    expect(isFinalInvoiceKitStatus('final_invoice')).toBe(true)
    expect(isFinalInvoiceKitStatus('EXECUTING')).toBe(false)
    expect(isFinalInvoiceKitStatus(null)).toBe(false)
  })

  it('shortens long carrier UUIDs', () => {
    expect(formatCarrierReference('short')).toBe('short')
    expect(formatCarrierReference('1234567890abcdef')).toBe('12345678…')
    expect(formatCarrierReference('')).toBe('')
  })

  it('formats tracking labels from number, status and reference', () => {
    expect(
      formatDeliveryTracking({
        external_number: '123',
        status_code: 'DELIVERED',
      })
    ).toBe('123 · Доставлен')
    expect(formatDeliveryTracking({ external_number: '123' })).toBe('123')
    expect(
      formatDeliveryTracking({
        status_code: 'CREATED',
        external_uuid: '1234567890abcdef',
      })
    ).toBe('Создан · 12345678…')
    expect(formatDeliveryTracking({ status: 'ACCEPTED' })).toBe('Принят СДЭК')
    expect(formatDeliveryTracking({ external_uuid: 'abcdefghijklm' })).toBe(
      'Ожидаем номер · abcdefgh…'
    )
    expect(formatDeliveryTracking(null)).toBe('')
  })

  it('refreshes shipment when number is missing or kit is on final invoice', () => {
    expect(shouldRefreshShipmentOnLoad(null, 'FINAL_INVOICE')).toBe(false)
    expect(
      shouldRefreshShipmentOnLoad({ id: 1, external_uuid: 'u', external_number: null }, 'NEW')
    ).toBe(true)
    expect(
      shouldRefreshShipmentOnLoad(
        { id: 1, external_uuid: 'u', external_number: '123' },
        'C3:FINAL_INVOICE'
      )
    ).toBe(true)
    expect(
      shouldRefreshShipmentOnLoad(
        { id: 1, external_uuid: 'u', external_number: '123' },
        'EXECUTING'
      )
    ).toBe(false)
  })
})
