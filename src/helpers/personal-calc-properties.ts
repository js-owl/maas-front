import type { IOrderResponse } from '../interfaces/order.interface'

export type PersonalCalcPropertyKey =
  | 'service'
  | 'material'
  | 'dimensions'
  | 'partVolume'
  | 'billableWeight'
  | 'roughness'
  | 'tolerance'
  | 'finishTreatment'
  | 'controlType'
  | 'technology'
  | 'coatingType'
  | 'specialEquipment'

export type PersonalCalcPropertyField = {
  key: PersonalCalcPropertyKey
  label: string
  valueClass?: string
}

export const OTK_LABELS: Record<string, string> = {
  '1.0': 'Изготовитель',
  '1.2': 'Заказчика на площадке изготовителя',
  '1.15': 'Независимой приемкой',
  '1.3': 'Фиксация первой инспекции изделия',
}

const MACHINING_FIELDS: PersonalCalcPropertyField[] = [
  { key: 'service', label: 'Услуга' },
  { key: 'material', label: 'Материал заготовки' },
  { key: 'dimensions', label: 'Габаритные размеры, мм' },
  { key: 'partVolume', label: 'Объем заготовки' },
  { key: 'billableWeight', label: 'Масса материала на 1 деталь' },
  { key: 'roughness', label: 'Шероховатость' },
  { key: 'tolerance', label: 'Квалитет точности' },
  { key: 'finishTreatment', label: 'Финишная обработка' },
  { key: 'controlType', label: 'Вид контроля', valueClass: 'property-value--compact' },
]

const PRINTING_FIELDS: PersonalCalcPropertyField[] = [
  { key: 'service', label: 'Услуга' },
  { key: 'material', label: 'Материал' },
  { key: 'dimensions', label: 'Габаритные размеры, мм' },
  { key: 'partVolume', label: 'Объем заготовки' },
  { key: 'billableWeight', label: 'Масса материала на 1 деталь' },
  { key: 'finishTreatment', label: 'Финишная обработка' },
  { key: 'controlType', label: 'Вид контроля', valueClass: 'property-value--compact' },
]

const COMPOSITE_FIELDS: PersonalCalcPropertyField[] = [
  { key: 'service', label: 'Услуга' },
  { key: 'material', label: 'Материал' },
  { key: 'dimensions', label: 'Габаритные размеры, мм' },
  { key: 'partVolume', label: 'Объем заготовки' },
  { key: 'billableWeight', label: 'Масса материала на 1 деталь' },
  { key: 'specialEquipment', label: 'Наличие оснастки' },
  { key: 'finishTreatment', label: 'Финишная обработка' },
  { key: 'controlType', label: 'Вид контроля', valueClass: 'property-value--compact' },
]

const ELECTROPLATING_FIELDS: PersonalCalcPropertyField[] = [
  { key: 'service', label: 'Услуга' },
  { key: 'coatingType', label: 'Вид покрытия' },
  { key: 'controlType', label: 'Вид контроля', valueClass: 'property-value--compact' },
]

const OTHER_FIELDS: PersonalCalcPropertyField[] = [
  { key: 'service', label: 'Услуга' },
  { key: 'material', label: 'Материал' },
  { key: 'technology', label: 'Технология' },
  { key: 'dimensions', label: 'Габаритные размеры, мм' },
  { key: 'partVolume', label: 'Объем заготовки' },
  { key: 'billableWeight', label: 'Масса материала на 1 деталь' },
  { key: 'finishTreatment', label: 'Финишная обработка' },
  { key: 'controlType', label: 'Вид контроля', valueClass: 'property-value--compact' },
]

const SERVICE_PROPERTY_FIELDS: Record<string, PersonalCalcPropertyField[]> = {
  'cnc-milling': MACHINING_FIELDS,
  'cnc-lathe': MACHINING_FIELDS,
  printing: PRINTING_FIELDS,
  composite: COMPOSITE_FIELDS,
  electroplating: ELECTROPLATING_FIELDS,
  other: OTHER_FIELDS,
}

export const getPersonalCalcPropertyFields = (serviceId?: string): PersonalCalcPropertyField[] => {
  if (!serviceId) return MACHINING_FIELDS
  return SERVICE_PROPERTY_FIELDS[serviceId] ?? MACHINING_FIELDS
}

type CoefficientItem = { value: string; label: string }

export type PersonalCalcPropertyValues = Partial<Record<PersonalCalcPropertyKey, string>>

type BuildPropertyValuesOptions = {
  order: IOrderResponse
  serviceLabel?: string
  materialLabel?: string
  technologyLabel?: string
  coatingTypeLabel?: string
  coefficients: {
    finish: CoefficientItem[]
    cover: CoefficientItem[]
    tolerance: CoefficientItem[]
  }
}

const formatDimensions = (order: IOrderResponse): string | undefined => {
  if (!order.length || !order.width || !order.height) return undefined
  return `${order.length} х ${order.width} х ${order.height}`
}

const formatPartVolume = (matVolume?: number): string | undefined => {
  if (matVolume == null) return undefined
  const volumeInCm3 = matVolume * 1_000_000
  return `${volumeInCm3.toFixed(2)} см³`
}

const formatBillableWeight = (order: IOrderResponse): string | undefined => {
  if (order.mat_weight != null) {
    return `${order.mat_weight.toFixed(2)} кг`
  }
  const billableWeight = order.total_price_breakdown?.billable_weight_kg
  if (billableWeight != null) {
    return `${billableWeight.toFixed(2)} кг`
  }
  return undefined
}

const resolveCoefficientLabel = (
  items: CoefficientItem[],
  id?: string
): string | undefined => {
  if (!id) return undefined
  return items.find((item) => item.value === id)?.label ?? id
}

const resolveCoverLabels = (order: IOrderResponse, coverItems: CoefficientItem[]): string | undefined => {
  if (!Array.isArray(order.cover_id) || !order.cover_id.length) return undefined

  const labels = order.cover_id
    .map((id) => coverItems.find((cover) => cover.value === id)?.label)
    .filter((label): label is string => Boolean(label))

  return labels.length ? labels.join(', ') : order.cover_id.join(', ')
}

export const buildPersonalCalcPropertyValues = ({
  order,
  serviceLabel,
  materialLabel,
  technologyLabel,
  coatingTypeLabel,
  coefficients,
}: BuildPropertyValuesOptions): PersonalCalcPropertyValues => {
  const values: PersonalCalcPropertyValues = {}

  if (serviceLabel || order.service_id) {
    values.service = serviceLabel ?? order.service_id
  }
  if (materialLabel || order.material_id) {
    values.material = materialLabel ?? order.material_id
  }
  if (technologyLabel) {
    values.technology = technologyLabel
  }
  if (coatingTypeLabel) {
    values.coatingType = coatingTypeLabel
  }

  const dimensions = formatDimensions(order)
  if (dimensions) values.dimensions = dimensions

  const partVolume = formatPartVolume(order.mat_volume)
  if (partVolume) values.partVolume = partVolume

  const billableWeight = formatBillableWeight(order)
  if (billableWeight) values.billableWeight = billableWeight

  const roughness = resolveCoefficientLabel(coefficients.finish, order.finish_id)
  if (roughness) values.roughness = roughness

  const tolerance = resolveCoefficientLabel(coefficients.tolerance, order.tolerance_id)
  if (tolerance) values.tolerance = tolerance

  const finishTreatment = resolveCoverLabels(order, coefficients.cover)
  if (finishTreatment) values.finishTreatment = finishTreatment

  if (order.k_otk) {
    values.controlType = OTK_LABELS[order.k_otk] ?? order.k_otk
  }

  if (order.is_need_special_equipment != null) {
    values.specialEquipment = order.is_need_special_equipment
      ? 'Требуется изготовление'
      : 'Не требуется'
  }

  return values
}
