export function unwrapApiData<T>(body: unknown): T {
  if (body && typeof body === 'object' && 'data' in body) {
    const record = body as Record<string, unknown>
    const looksLikeEntity =
      'order_id' in record ||
      'kit_id' in record ||
      'total_price' in record ||
      'total_kit_price' in record
    const data = record.data
    if (!looksLikeEntity && data && typeof data === 'object' && !Array.isArray(data)) {
      return data as T
    }
  }
  return body as T
}

type PriceRow = {
  total_price?: number | string | null
  detail_price?: number | string | null
  detail_price_one?: number | string | null
  quantity?: number | string | null
  total_price_breakdown?: { cost?: number | string | null; [key: string]: unknown } | string | null
}

const toPositiveNumber = (value: unknown): number | null => {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return null
  return n
}

function breakdownRecord(row: PriceRow): Record<string, unknown> | undefined {
  const breakdown = row.total_price_breakdown
  if (breakdown && typeof breakdown === 'object' && !Array.isArray(breakdown)) {
    return breakdown as Record<string, unknown>
  }
  if (typeof breakdown === 'string') {
    try {
      const parsed = JSON.parse(breakdown)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>
      }
    } catch {
      return undefined
    }
  }
  return undefined
}

export function orderLinePrice(row: PriceRow): number {
  const total = toPositiveNumber(row.total_price)
  if (total != null) return total

  const detail = toPositiveNumber(row.detail_price)
  if (detail != null) return detail

  const one = toPositiveNumber(row.detail_price_one)
  const qty = Number(row.quantity)
  if (one != null) return one * (Number.isFinite(qty) && qty > 0 ? qty : 1)

  const breakdown = breakdownRecord(row)
  const cost = toPositiveNumber(breakdown?.cost)
  if (cost != null) return cost
  const included = toPositiveNumber(breakdown?.['total_price (include quantity)'])
  if (included != null) return included

  const fallback = Number(row.total_price)
  return Number.isFinite(fallback) ? fallback : 0
}

export function pickNonZeroCalculation<T extends PriceRow>(
  primary: T | null | undefined,
  fallback: T | null | undefined
): T | null {
  if (primary && orderLinePrice(primary) > 0) return primary
  if (fallback && orderLinePrice(fallback) > 0) return fallback
  return primary ?? fallback ?? null
}
