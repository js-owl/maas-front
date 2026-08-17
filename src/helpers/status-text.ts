export const statusTexts: Record<string, string> = {
  pending: 'Ожидает оплаты',
  processing: 'Обработка',
  'in-progress': 'В работе',
  completed: 'Завершен',
  'C3:WIN': 'Завершен',
  'C3:LOSE': 'Отменен',
  cancelled: 'Отменен',
}

/** MaaS / Bitrix deal stage codes (tail after `C{n}:`). */
export const kitStageTexts: Record<string, string> = {
  AWAITING_CONFIRMATION: 'Подтвердите заказ',
  NEW: 'Новый',
  PREPARATION: 'Подготовка',
  PREPAYMENT_INVOICE: 'Счёт на предоплату',
  EXECUTING: 'В производстве',
  FINAL_INVOICE: 'Финальный счёт',
  WON: 'Завершён',
  LOSE: 'Отменён',
  APOLOGY: 'Отменён',
}

const PROCESSING_STAGES = new Set([
  'NEW',
  'PREPARATION',
  'PREPAYMENT_INVOICE',
  'EXECUTING',
  'FINAL_INVOICE',
])

export function kitStatusTail(status: string | null | undefined): string {
  if (!status) return ''
  const raw = status.trim()
  if (!raw) return ''
  return (raw.includes(':') ? raw.split(':').pop()! : raw).toUpperCase()
}

export type KitStatusSource = {
  status?: string | null
  status_name?: string | null
}

/** Human-readable kit/deal status for list and detail pages. */
export function formatKitStatusLabel(input: KitStatusSource | null | undefined): string {
  if (!input) return ''
  const named = input.status_name?.trim()
  if (named) {
    return statusTexts[named] || kitStageTexts[named] || kitStageTexts[kitStatusTail(named)] || named
  }
  const tail = kitStatusTail(input.status)
  return kitStageTexts[tail] || input.status?.trim() || ''
}

/** Raw status code for API / price-hiding logic. */
export function getKitStatusCode(input: KitStatusSource | null | undefined): string {
  if (!input) return ''
  return (input.status_name || input.status || '').trim()
}

export function kitStatusChipClass(input: KitStatusSource | null | undefined): string {
  const named = input?.status_name?.trim()
  if (named && statusTexts[named]) {
    const mapped = statusTexts[named]
    if (mapped === statusTexts.completed) return 'status-chip--completed'
    if (mapped === statusTexts.cancelled) return 'status-chip--cancelled'
    if (mapped === statusTexts.processing || mapped === statusTexts['in-progress']) {
      return 'status-chip--processing'
    }
    return 'status-chip--pending'
  }

  const tail = kitStatusTail(input?.status)
  if (tail === 'WON') return 'status-chip--completed'
  if (tail === 'LOSE' || tail === 'APOLOGY') return 'status-chip--cancelled'
  if (PROCESSING_STAGES.has(tail) || tail === 'FINAL_INVOICE') return 'status-chip--processing'
  if (tail === 'AWAITING_CONFIRMATION') return 'status-chip--pending'
  return 'status-chip--default'
}

export function kitMatchesPaidTab(input: KitStatusSource): boolean {
  const named = input.status_name?.trim() || ''
  if (named === 'completed' || named === 'C3:WIN') return true
  return kitStatusTail(input.status) === 'WON'
}

export function kitMatchesUnpaidTab(input: KitStatusSource): boolean {
  const named = input.status_name?.trim() || ''
  if (['pending', 'processing', 'in-progress'].includes(named)) return true
  const tail = kitStatusTail(input.status)
  return tail === 'AWAITING_CONFIRMATION' || PROCESSING_STAGES.has(tail)
}
