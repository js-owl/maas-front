/** CDEK delivery helpers for kit confirm (PVZ-only). */

export const PVZ_DELIVERY_MODES = new Set([2, 4, 6, 7])

export type CdekCity = {
  code?: number
  city?: string
}

export type CdekPvz = {
  code?: string
  name?: string
  type?: string
  location?: {
    city?: string
    address?: string
    address_full?: string
    postal_code?: string
    latitude?: number
    longitude?: number
  }
}

export type CdekTariff = {
  tariff_code?: number
  tariff_name?: string
  delivery_mode?: number
  delivery_sum?: number
  period_min?: number
  period_max?: number
}

export type DeliveryShipment = {
  id?: number
  kit_id?: number
  status?: string
  status_code?: string | null
  delivery_mode?: string | null
  delivery_point_code?: string | null
  delivery_sum?: number | null
  tariff_code?: number | null
  period_min?: number | null
  period_max?: number | null
  external_uuid?: string | null
  external_number?: string | null
  label_url?: string | null
}

export function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: T[] }).data
  }
  return []
}

export type DeliveryQuoteReadiness = { ready: true } | { ready: false; reason: string }

/** Gate CDEK quote/PVZ calls until kit line items have weight from completed calcs. */
export function kitDeliveryQuoteReadiness(
  rows: Array<{ mat_weight?: number | null }>
): DeliveryQuoteReadiness {
  if (!rows.length) {
    return {
      ready: false,
      reason: 'Добавьте расчёты в заказ, чтобы рассчитать доставку',
    }
  }
  const missingWeight = rows.some((row) => !Number(row.mat_weight) || Number(row.mat_weight) <= 0)
  if (missingWeight) {
    return {
      ready: false,
      reason: 'Дождитесь расчёта веса деталей, чтобы рассчитать доставку',
    }
  }
  return { ready: true }
}

export function pickCityCode(cities: CdekCity[], query: string): number | null {
  const q = query.trim().toLowerCase()
  if (!cities.length) return null
  const exact = cities.find((c) => (c.city || '').trim().toLowerCase() === q)
  const code = exact?.code ?? cities[0]?.code
  return typeof code === 'number' ? code : null
}

/** Russian postal index: digits only, first 6. */
export function normalizePostalCode(value: string | null | undefined): string {
  const digits = (value || '').replace(/\D/g, '')
  return digits.length >= 6 ? digits.slice(0, 6) : ''
}

function pointPostalCode(point: CdekPvz): string {
  return normalizePostalCode(point.location?.postal_code)
}

/** Prefer PVZ in the same index, then same postal district (first 3 digits). */
export function pickDefaultPvzCode(points: CdekPvz[], postal?: string | null): string {
  if (!points.length) return ''
  const target = normalizePostalCode(postal)
  if (!target) return points[0]?.code || ''

  const ranked = [...points].sort((a, b) => pvzPostalScore(b, target) - pvzPostalScore(a, target))
  return ranked[0]?.code || points[0]?.code || ''
}

function pvzPostalScore(point: CdekPvz, target: string): number {
  const pc = pointPostalCode(point)
  if (!pc) return 0
  if (pc === target) return 3
  if (pc.slice(0, 3) === target.slice(0, 3)) return 2
  if (pc.slice(0, 2) === target.slice(0, 2)) return 1
  return 0
}

export function buildDeliveryPointsQuery(cityCode: number, postal?: string | null): string {
  const params = new URLSearchParams({
    city_code: String(cityCode),
    type: 'PVZ',
  })
  const normalized = normalizePostalCode(postal)
  if (normalized) params.set('postal_code', normalized)
  return `/delivery/cdek/delivery-points?${params.toString()}`
}

export function buildDeliveryPointByCodeQuery(code: string): string {
  const params = new URLSearchParams({
    code: code.trim(),
    type: 'PVZ',
  })
  return `/delivery/cdek/delivery-points?${params.toString()}`
}

export function pickCheapestPvzTariff(tariffs: CdekTariff[]): CdekTariff | null {
  const pvz = tariffs.filter(
    (t) =>
      typeof t.tariff_code === 'number' &&
      typeof t.delivery_sum === 'number' &&
      PVZ_DELIVERY_MODES.has(Number(t.delivery_mode))
  )
  if (!pvz.length) return null
  return [...pvz].sort((a, b) => Number(a.delivery_sum) - Number(b.delivery_sum))[0]
}

export function pvzLabel(point: CdekPvz): string {
  return pvzFullLabel(point)
}

/** PVZ code shown in the closed select field (single line). */
export function pvzCodeLabel(point: CdekPvz): string {
  return (point.code || point.name || 'ПВЗ').trim()
}

/** Street line for option list and confirmation block. */
export function pvzStreetLabel(point: CdekPvz): string {
  const addr = (point.location?.address || '').trim()
  const full = (point.location?.address_full || '').trim()
  if (addr) return addr
  if (full) return full
  return (point.name || point.code || '').trim()
}

/** Short label for filters / legacy callers. */
export function pvzCompactLabel(point: CdekPvz): string {
  const code = pvzCodeLabel(point)
  const street = pvzStreetLabel(point)
  if (code && street && street !== code) return `${code} · ${street}`
  return code
}

/** Full readable address for confirmation below the select. */
export function pvzFullLabel(point: CdekPvz): string {
  const code = pvzCodeLabel(point)
  const full = (point.location?.address_full || point.location?.address || point.name || '').trim()
  if (code && full) return `${code} — ${full}`
  return full || code
}

export type PvzCoords = { lat: number; lon: number }

/** WGS-84 coordinates for map links and static preview. */
export function pvzCoordinates(point: CdekPvz | null | undefined): PvzCoords | null {
  const lat = Number(point?.location?.latitude)
  const lon = Number(point?.location?.longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  if (lat === 0 && lon === 0) return null
  return { lat, lon }
}

/** Open in Yandex Maps with a pinned marker (lon,lat). */
export function pvzYandexMapsUrl(point: CdekPvz | null | undefined): string | null {
  const coords = pvzCoordinates(point)
  if (!coords) return null
  const { lat, lon } = coords
  const params = new URLSearchParams({
    ll: `${lon},${lat}`,
    pt: `${lon},${lat},pm2rdm`,
    z: '17',
    l: 'map',
  })
  return `https://yandex.ru/maps/?${params.toString()}`
}

/** Static map preview via Yandex Static API 1.x (no JS SDK; works without apikey). */
export function pvzStaticMapUrl(
  point: CdekPvz | null | undefined,
  size: { width: number; height: number } = { width: 480, height: 200 }
): string | null {
  const coords = pvzCoordinates(point)
  if (!coords) return null
  const { lat, lon } = coords
  const params = new URLSearchParams({
    lang: 'ru_RU',
    ll: `${lon},${lat}`,
    size: `${size.width},${size.height}`,
    z: '16',
    l: 'map',
    pt: `${lon},${lat},pm2rdm`,
  })
  return `https://static-maps.yandex.ru/1.x/?${params.toString()}`
}

/** Searchable text for PVZ code, name, street, and postal index. */
export function pvzSearchText(point: CdekPvz): string {
  return [
    point.code,
    point.name,
    point.location?.address,
    point.location?.address_full,
    point.location?.postal_code,
  ]
    .filter(Boolean)
    .join(' ')
}

function normalizePvzQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ')
}

function fuzzySubsequence(needle: string, haystack: string): boolean {
  if (!needle) return true
  let i = 0
  for (const ch of haystack) {
    if (ch === needle[i]) i += 1
    if (i >= needle.length) return true
  }
  return false
}

/** Higher score = better match (code, then street/name, then fuzzy). */
export function pvzSearchScore(point: CdekPvz, query: string): number {
  const q = normalizePvzQuery(query)
  if (!q) return 0

  const code = (point.code || '').toLowerCase()
  const name = (point.name || '').toLowerCase()
  const addr = (point.location?.address || '').toLowerCase()
  const full = pvzSearchText(point).toLowerCase()

  if (code === q) return 100
  if (code.startsWith(q)) return 90
  if (addr.includes(q) || name.includes(q)) return 80
  if (full.includes(q)) return 70

  const tokens = q.split(/\s+/).filter(Boolean)
  if (tokens.length > 1 && tokens.every((token) => full.includes(token))) return 60

  const compact = q.replace(/\s/g, '')
  if (compact && fuzzySubsequence(compact, full.replace(/\s/g, ''))) return 40

  return -1
}

export function filterPvzPoints(points: CdekPvz[], query: string): CdekPvz[] {
  const q = normalizePvzQuery(query)
  if (!q) return points

  return points
    .map((point) => ({ point, score: pvzSearchScore(point, q) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score)
    .map(({ point }) => point)
}

const FINAL_INVOICE_STATUS = 'FINAL_INVOICE'

export function isFinalInvoiceKitStatus(status: string | null | undefined): boolean {
  if (!status) return false
  const tail = status.includes(':') ? status.split(':').pop()! : status
  return tail.toUpperCase() === FINAL_INVOICE_STATUS
}

/** Short reference when CDEK has not assigned cdek_number yet. */
export function formatCarrierReference(uuid: string | null | undefined): string {
  const value = (uuid || '').trim()
  if (!value) return ''
  if (value.length <= 12) return value
  return `${value.slice(0, 8)}…`
}

/** CDEK carrier status codes (not kit/deal stage). */
const carrierStatusTexts: Record<string, string> = {
  ACCEPTED: 'Принят СДЭК',
  CREATED: 'Создан',
  DELIVERED: 'Доставлен',
  NOT_DELIVERED: 'Не доставлен',
  RECEIVED_AT_SHIPMENT_WAREHOUSE: 'На складе отправителя',
  READY_FOR_SHIPMENT_IN_SENDER_CITY: 'Готов к отправке',
  ACCEPTED_AT_PICK_UP_POINT: 'В пункте выдачи',
}

function formatCarrierStatus(status: string | null | undefined): string {
  const raw = (status || '').trim()
  if (!raw) return ''
  const upper = raw.toUpperCase()
  return carrierStatusTexts[upper] || carrierStatusTexts[raw] || raw
}

/** Label for kit page delivery block (tracking number / carrier status). */
export function formatDeliveryTracking(shipment: DeliveryShipment | null | undefined): string {
  if (!shipment) return ''
  const number = shipment.external_number?.trim()
  const status = formatCarrierStatus(shipment.status_code || shipment.status)
  const ref = formatCarrierReference(shipment.external_uuid)

  if (number && status) return `${number} · ${status}`
  if (number) return number
  if (status && ref) return `${status} · ${ref}`
  if (status) return status
  if (ref) return `Ожидаем номер · ${ref}`
  return ''
}

export function shouldRefreshShipmentOnLoad(
  shipment: DeliveryShipment | null | undefined,
  kitStatus: string | null | undefined
): boolean {
  if (!shipment?.id || !shipment.external_uuid?.trim()) return false
  if (!shipment.external_number?.trim()) return true
  return isFinalInvoiceKitStatus(kitStatus)
}
