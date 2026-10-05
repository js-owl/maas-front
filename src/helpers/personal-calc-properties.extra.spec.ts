import { describe, expect, it } from 'vitest'
import type { IOrderResponse } from '@/interfaces/order.interface'
import {
  COMPOSITE_SERVICE_LABEL,
  ELECTROPLATING_SERVICE_LABEL,
  buildPersonalCalcPropertyValues,
  formatElectroplatingCoatingLabel,
  formatPrintingServiceLabel,
  getPersonalCalcPropertyFields,
  isOtherLikeServiceId,
  normalizeOtherServicesResponse,
  resolveCompositeMaterialLabels,
  resolveElectroplatingLabelsFromOperation,
  resolveMaterialProcessForService,
  resolveOtherServiceLabel,
} from './personal-calc-properties'

const coefficients = {
  finish: [{ value: '3', label: 'Ra 6.3' }],
  cover: [
    { value: '1', label: 'Без покрытия' },
    { value: '2', label: 'Анодирование' },
  ],
  tolerance: [{ value: '4', label: 'h12' }],
}

const baseOrder = {
  order_id: 1,
  service_id: 'cnc-milling',
  length: 10,
  width: 20,
  height: 30,
  mat_volume: 0.000001,
  mat_weight: 1.5,
  finish_id: '3',
  tolerance_id: '4',
  cover_id: ['1', '2'],
  k_otk: '1.0',
} as IOrderResponse

describe('formatPrintingServiceLabel / coating label', () => {
  it('defaults printing technology to SLS and uppercases unknowns', () => {
    expect(formatPrintingServiceLabel()).toBe('3D печать (SLS)')
    expect(formatPrintingServiceLabel('fdm')).toBe('3D печать (FDM)')
  })

  it('joins electroplating path segments', () => {
    expect(formatElectroplatingCoatingLabel(['Анод', 'Цвет'], 'x')).toBe('Анод - Цвет')
    expect(formatElectroplatingCoatingLabel(['Анод'])).toBe('Анод')
    expect(formatElectroplatingCoatingLabel([], 'fallback')).toBe('fallback')
  })
})

describe('other services helpers', () => {
  const otherServices = [
    { id: '101', label: 'Сварка', service: 'welding' },
    { id: '102', label: 'Гибка', service: 'bending' },
  ]

  it('normalizes array and wrapped responses', () => {
    expect(normalizeOtherServicesResponse(otherServices)).toEqual(otherServices)
    expect(normalizeOtherServicesResponse({ other_services: otherServices })).toEqual(otherServices)
    expect(normalizeOtherServicesResponse(null)).toEqual([])
  })

  it('resolves a label by service_id or process_id', () => {
    const order = { ...baseOrder, service_id: 'welding' } as IOrderResponse
    expect(resolveOtherServiceLabel(order, otherServices)).toBe('Сварка')
    expect(
      resolveOtherServiceLabel({ ...baseOrder, service_id: 'other', process_id: 'bending' }, otherServices)
    ).toBe('Гибка')
  })

  it('detects other-like services and maps them to machining materials', () => {
    expect(isOtherLikeServiceId('other')).toBe(true)
    expect(isOtherLikeServiceId('welding', otherServices)).toBe(true)
    expect(isOtherLikeServiceId('cnc-milling', otherServices)).toBe(false)
    expect(resolveMaterialProcessForService('welding', otherServices)).toBe('cnc-milling')
    expect(resolveMaterialProcessForService('printing')).toBe('printing')
    expect(resolveMaterialProcessForService('composite')).toBe('composite')
  })
})

describe('getPersonalCalcPropertyFields', () => {
  it('returns the field set for each service family', () => {
    expect(getPersonalCalcPropertyFields().map((f) => f.key)).toContain('roughness')
    expect(getPersonalCalcPropertyFields('printing').map((f) => f.key)).not.toContain('roughness')
    expect(getPersonalCalcPropertyFields('composite').map((f) => f.key)).toContain('base')
    expect(getPersonalCalcPropertyFields('electroplating').map((f) => f.key)).toContain('coatingType')
    expect(
      getPersonalCalcPropertyFields('welding', [{ id: '1', label: 'Сварка', service: 'welding' }]).map(
        (f) => f.key
      )
    ).toContain('finishTreatment')
  })
})

describe('resolveElectroplatingLabelsFromOperation', () => {
  it('uses the operation path or falls back to material id', () => {
    expect(
      resolveElectroplatingLabelsFromOperation(
        { id: '1', group: 'Алюминий', path: ['Анод', 'Чёрный'], label: 'x' },
        'mat-1'
      )
    ).toEqual({ coatingTypeLabel: 'Анод - Чёрный', blankMaterialLabel: 'Алюминий' })
    expect(resolveElectroplatingLabelsFromOperation(undefined, 'mat-1')).toEqual({
      coatingTypeLabel: 'mat-1',
    })
  })
})

describe('resolveCompositeMaterialLabels', () => {
  it('prefers impregnation_label on the order, then on the material', () => {
    const materials = [
      {
        value: 'm1',
        label: 'Карбон / Эпоксид',
        impregnation: 'epoxy',
        impregnation_label: 'Эпоксидная',
      },
    ]
    expect(
      resolveCompositeMaterialLabels(
        { ...baseOrder, material_id: 'm1', impregnation_label: 'Из заказа' } as IOrderResponse,
        materials
      )
    ).toEqual({ base: 'Карбон / Эпоксид', impregnation: 'Из заказа' })

    expect(
      resolveCompositeMaterialLabels({ ...baseOrder, material_id: 'm1' } as IOrderResponse, materials)
    ).toEqual({ base: 'Карбон / Эпоксид', impregnation: 'Эпоксидная' })
  })

  it('splits a combined label when impregnation fields are absent', () => {
    expect(
      resolveCompositeMaterialLabels({ ...baseOrder, material_id: 'm2' } as IOrderResponse, [
        { value: 'm2', label: 'Стекло / Полиэфир' },
      ])
    ).toEqual({ base: 'Стекло', impregnation: 'Полиэфир' })
  })
})

describe('buildPersonalCalcPropertyValues', () => {
  it('builds machining property values', () => {
    const values = buildPersonalCalcPropertyValues({
      order: baseOrder,
      serviceLabel: 'Фрезеровка',
      materialLabel: 'Д16Т',
      coefficients,
    })
    expect(values.service).toBe('Фрезеровка')
    expect(values.material).toBe('Д16Т')
    expect(values.dimensions).toBe('10 х 20 х 30')
    expect(values.partVolume).toBe('1.00 см³')
    expect(values.billableWeight).toBe('1.50 кг')
    expect(values.roughness).toBe('Ra 6.3')
    expect(values.tolerance).toBe('h12')
    expect(values.finishTreatment).toBe('Без покрытия, Анодирование')
    expect(values.controlType).toBe('Изготовитель')
  })

  it('uses dedicated labels for composite, printing and electroplating', () => {
    expect(
      buildPersonalCalcPropertyValues({
        order: { ...baseOrder, service_id: 'composite', is_need_special_equipment: true },
        baseLabel: 'Карбон',
        impregnationLabel: 'Эпоксид',
        coefficients,
      }).service
    ).toBe(COMPOSITE_SERVICE_LABEL)

    expect(
      buildPersonalCalcPropertyValues({
        order: { ...baseOrder, service_id: 'printing', process_id: 'sls' },
        coefficients,
      }).service
    ).toMatch(/3D печать/)

    const galv = buildPersonalCalcPropertyValues({
      order: { ...baseOrder, service_id: 'electroplating_auto' },
      blankMaterialLabel: 'Алюминий',
      coatingTypeLabel: 'Анод',
      coefficients,
    })
    expect(galv.service).toBe(ELECTROPLATING_SERVICE_LABEL)
    expect(galv.material).toBe('Алюминий')
    expect(galv.coatingType).toBe('Анод')
  })

  it('falls back to breakdown weight and unknown cover ids', () => {
    const values = buildPersonalCalcPropertyValues({
      order: {
        ...baseOrder,
        mat_weight: undefined,
        total_price_breakdown: { billable_weight_kg: 0.25 },
        cover_id: ['missing'],
        k_otk: 'custom',
        is_need_special_equipment: false,
      } as unknown as IOrderResponse,
      coefficients,
    })
    expect(values.billableWeight).toBe('0.25 кг')
    expect(values.finishTreatment).toBe('missing')
    expect(values.controlType).toBe('custom')
    expect(values.specialEquipment).toBe('Не требуется')
  })

  it('falls back to raw order ids when labels are not provided', () => {
    const values = buildPersonalCalcPropertyValues({
      order: {
        ...baseOrder,
        service_id: 'cnc-lathe',
        material_id: 'mat-7',
        finish_id: 'unknown-finish',
        is_need_special_equipment: true,
      } as IOrderResponse,
      coefficients,
    })
    expect(values.service).toBe('cnc-lathe')
    expect(values.material).toBe('mat-7')
    expect(values.roughness).toBe('unknown-finish')
    expect(values.specialEquipment).toBe('Требуется изготовление')
  })

  it('omits every property that the order does not carry', () => {
    const values = buildPersonalCalcPropertyValues({
      order: { order_id: 2, cover_id: [] } as unknown as IOrderResponse,
      coefficients,
    })
    expect(values).toEqual({})
  })

  it('uses the composite material id as base and handles missing tooling info', () => {
    const composite = buildPersonalCalcPropertyValues({
      order: { ...baseOrder, service_id: 'composite', material_id: 'carbon' } as IOrderResponse,
      coefficients,
    })
    expect(composite.base).toBe('carbon')
    expect(composite.impregnation).toBeUndefined()
    expect(composite.tooling).toBeUndefined()
    expect(composite.specialEquipment).toBeUndefined()

    const noMaterial = buildPersonalCalcPropertyValues({
      order: {
        ...baseOrder,
        service_id: 'composite',
        material_id: undefined,
        is_need_special_equipment: 0,
      } as unknown as IOrderResponse,
      coefficients,
    })
    expect(noMaterial.base).toBeUndefined()
    expect(noMaterial.tooling).toBe('Не требуется')
  })

  it('leaves the electroplating blank material empty without a label', () => {
    const values = buildPersonalCalcPropertyValues({
      order: { ...baseOrder, service_id: 'electroplating', material_id: 'raw-id' } as IOrderResponse,
      coefficients,
    })
    expect(values.service).toBe(ELECTROPLATING_SERVICE_LABEL)
    expect(values.material).toBeUndefined()
  })
})

describe('electroplating / composite label fallbacks', () => {
  it('returns no labels without an operation or material id', () => {
    expect(resolveElectroplatingLabelsFromOperation(undefined)).toEqual({})
  })

  it('falls back to material id when the operation has no path or label', () => {
    expect(
      resolveElectroplatingLabelsFromOperation(
        { id: '1', group: '', path: [], label: undefined } as unknown as Parameters<
          typeof resolveElectroplatingLabelsFromOperation
        >[0],
        'mat-1'
      )
    ).toEqual({ coatingTypeLabel: 'mat-1', blankMaterialLabel: undefined })
  })

  it('uses the order material id when an impregnation label exists but the material is unknown', () => {
    expect(
      resolveCompositeMaterialLabels(
        { ...baseOrder, material_id: 'ghost', impregnation_label: 'Эпоксид' } as IOrderResponse,
        []
      )
    ).toEqual({ base: 'ghost', impregnation: 'Эпоксид' })
  })

  it('falls back to the raw impregnation code and to plain labels', () => {
    expect(
      resolveCompositeMaterialLabels({ ...baseOrder, material_id: 'm1' } as IOrderResponse, [
        { value: 'm1', label: 'Карбон', impregnation: 'epoxy' },
      ])
    ).toEqual({ base: 'Карбон', impregnation: 'epoxy' })

    expect(
      resolveCompositeMaterialLabels({ ...baseOrder, material_id: 'm2' } as IOrderResponse, [
        { value: 'm2', label: 'Стекловолокно' },
      ])
    ).toEqual({ base: 'Стекловолокно' })

    expect(
      resolveCompositeMaterialLabels({ ...baseOrder, material_id: 'm3' } as IOrderResponse, [])
    ).toEqual({ base: 'm3' })
  })
})
