import { describe, expect, it } from 'vitest'
import {
  buildDeliveryPointByCodeQuery,
  buildDeliveryPointsQuery,
  filterPvzPoints,
  formatCarrierReference,
  formatDeliveryTracking,
  isFinalInvoiceKitStatus,
  normalizePostalCode,
  pickCheapestPvzTariff,
  pickCityCode,
  pickDefaultPvzCode,
  pvzCodeLabel,
  pvzFullLabel,
  pvzSearchScore,
  pvzStreetLabel,
  pvzYandexMapsUrl,
  shouldRefreshShipmentOnLoad,
  unwrapList,
  pvzLabel,
  pvzSearchText,
  type CdekCity,
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

  it('does not refresh shipments without an id or a non-blank carrier uuid', () => {
    expect(shouldRefreshShipmentOnLoad({ external_uuid: 'u' }, 'FINAL_INVOICE')).toBe(false)
    expect(shouldRefreshShipmentOnLoad({ id: 1, external_uuid: '   ' }, 'FINAL_INVOICE')).toBe(false)
  })

  it('keeps unknown carrier statuses verbatim and maps lowercase known ones', () => {
    expect(formatDeliveryTracking({ status_code: 'IN_TRANSIT' })).toBe('IN_TRANSIT')
    expect(formatDeliveryTracking({ status_code: ' delivered ' })).toBe('Доставлен')
    expect(formatDeliveryTracking({ status_code: null, status: 'CREATED' })).toBe('Создан')
    expect(formatDeliveryTracking({ external_number: '  ', status: '  ' })).toBe('')
    expect(formatDeliveryTracking({})).toBe('')
  })
})

describe('pickCityCode edge cases', () => {
  it('tolerates cities without a name and rejects non-numeric codes', () => {
    expect(pickCityCode([{ code: 5 }], 'Москва')).toBe(5)
    expect(pickCityCode([{ city: 'Москва' }, { code: 7, city: 'Тверь' }], 'москва')).toBeNull()
    expect(pickCityCode([{ code: '44', city: 'Москва' } as unknown as CdekCity], 'Москва')).toBeNull()
  })
})

describe('pickDefaultPvzCode edge cases', () => {
  it('returns empty when the chosen point has no code', () => {
    expect(pickDefaultPvzCode([{ name: 'Без кода' }], null)).toBe('')
    expect(
      pickDefaultPvzCode([{ name: 'Без кода', location: { postal_code: '101000' } }], '101000')
    ).toBe('')
  })

  it('ranks a same-region (first two digits) index above unrelated and unknown ones', () => {
    const points: CdekPvz[] = [
      { code: 'NOPOSTAL' },
      { code: 'FAR', location: { postal_code: '690000' } },
      { code: 'REGION', location: { postal_code: '105000' } },
    ]
    expect(pickDefaultPvzCode(points, '101000')).toBe('REGION')
  })
})

describe('PVZ label fallbacks', () => {
  it('falls back from code to name to a generic label', () => {
    expect(pvzCodeLabel({ name: ' Пункт ' })).toBe('Пункт')
    expect(pvzCodeLabel({})).toBe('ПВЗ')
  })

  it('falls back from street to full address, name and code', () => {
    expect(pvzStreetLabel({ location: { address_full: ' г. Москва ' } })).toBe('г. Москва')
    expect(pvzStreetLabel({ name: 'Склад' })).toBe('Склад')
    expect(pvzStreetLabel({ code: 'MSK1' })).toBe('MSK1')
    expect(pvzStreetLabel({})).toBe('')
  })

  it('builds the full label from whichever address field is present', () => {
    expect(pvzFullLabel({ code: 'C', location: { address: 'ул. А' } })).toBe('C — ул. А')
    expect(pvzFullLabel({ code: 'C', name: 'Склад' })).toBe('C — Склад')
    expect(pvzFullLabel({ code: '   ', location: { address_full: 'г. Москва' } })).toBe('г. Москва')
    expect(pvzFullLabel({ code: '   ' })).toBe('')
  })

  it('returns no Yandex link without coordinates', () => {
    expect(pvzYandexMapsUrl({ code: 'X' })).toBeNull()
    expect(pvzYandexMapsUrl(null)).toBeNull()
  })
})

describe('PVZ search scoring edge cases', () => {
  it('scores blank queries as neutral', () => {
    expect(pvzSearchScore({ code: 'MSK1' }, '   ')).toBe(0)
  })

  it('matches points without a code by street, postal index and multiple tokens', () => {
    const point: CdekPvz = {
      name: 'Склад',
      location: { address: 'ул. Ленина, 5', postal_code: '101000' },
    }
    expect(pvzSearchScore(point, 'ленина')).toBe(80)
    expect(pvzSearchScore(point, '101000')).toBe(70)
    expect(pvzSearchScore(point, 'склад 101000')).toBe(60)
  })

  it('orders several matches by score', () => {
    const points: CdekPvz[] = [
      { code: 'X1', name: 'Рядом с msk65' },
      { code: 'Y2', name: 'Другой' },
      { code: 'MSK65' },
    ]
    expect(filterPvzPoints(points, 'MSK65').map((p) => p.code)).toEqual(['MSK65', 'X1'])
  })
})
