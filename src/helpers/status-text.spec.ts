import { describe, expect, it } from 'vitest'
import {
  formatKitStatusLabel,
  getKitStatusCode,
  kitMatchesPaidTab,
  kitMatchesUnpaidTab,
  kitStatusChipClass,
  kitStatusTail,
} from './status-text'

describe('kitStatusTail', () => {
  it('uppercases the segment after a colon', () => {
    expect(kitStatusTail('C3:WON')).toBe('WON')
    expect(kitStatusTail('executing')).toBe('EXECUTING')
  })

  it('returns empty for blank input', () => {
    expect(kitStatusTail(null)).toBe('')
    expect(kitStatusTail('   ')).toBe('')
  })
})

describe('formatKitStatusLabel', () => {
  it('prefers a mapped status_name', () => {
    expect(formatKitStatusLabel({ status_name: 'pending' })).toBe('Ожидает оплаты')
    expect(formatKitStatusLabel({ status_name: 'EXECUTING' })).toBe('В производстве')
    expect(formatKitStatusLabel({ status_name: 'C3:WIN' })).toBe('Завершен')
  })

  it('falls back to the status code tail', () => {
    expect(formatKitStatusLabel({ status: 'C3:LOSE' })).toBe('Отменён')
    expect(formatKitStatusLabel({ status: 'CUSTOM' })).toBe('CUSTOM')
  })

  it('returns empty for nullish input', () => {
    expect(formatKitStatusLabel(null)).toBe('')
    expect(formatKitStatusLabel({})).toBe('')
  })

  it('resolves a prefixed status_name by its tail, else shows it verbatim', () => {
    expect(formatKitStatusLabel({ status_name: 'C7:EXECUTING' })).toBe('В производстве')
    expect(formatKitStatusLabel({ status_name: ' Свой статус ' })).toBe('Свой статус')
  })
})

describe('getKitStatusCode', () => {
  it('prefers status_name over status', () => {
    expect(getKitStatusCode({ status_name: 'pending', status: 'C3:NEW' })).toBe('pending')
    expect(getKitStatusCode({ status: 'C3:NEW' })).toBe('C3:NEW')
    expect(getKitStatusCode(null)).toBe('')
    expect(getKitStatusCode({})).toBe('')
    expect(getKitStatusCode({ status_name: '', status: ' C3:NEW ' })).toBe('C3:NEW')
  })
})

describe('kitStatusChipClass', () => {
  it('maps named statuses to chip modifiers', () => {
    expect(kitStatusChipClass({ status_name: 'completed' })).toBe('status-chip--completed')
    expect(kitStatusChipClass({ status_name: 'cancelled' })).toBe('status-chip--cancelled')
    expect(kitStatusChipClass({ status_name: 'processing' })).toBe('status-chip--processing')
    expect(kitStatusChipClass({ status_name: 'pending' })).toBe('status-chip--pending')
  })

  it('maps Bitrix tails to chip modifiers', () => {
    expect(kitStatusChipClass({ status: 'C3:WON' })).toBe('status-chip--completed')
    expect(kitStatusChipClass({ status: 'C3:LOSE' })).toBe('status-chip--cancelled')
    expect(kitStatusChipClass({ status: 'C3:APOLOGY' })).toBe('status-chip--cancelled')
    expect(kitStatusChipClass({ status: 'C3:EXECUTING' })).toBe('status-chip--processing')
    expect(kitStatusChipClass({ status: 'C3:AWAITING_CONFIRMATION' })).toBe('status-chip--pending')
    expect(kitStatusChipClass({ status: 'UNKNOWN' })).toBe('status-chip--default')
  })
})

describe('paid / unpaid tabs', () => {
  it('matches paid kits by name or WON tail', () => {
    expect(kitMatchesPaidTab({ status_name: 'completed' })).toBe(true)
    expect(kitMatchesPaidTab({ status_name: 'C3:WIN' })).toBe(true)
    expect(kitMatchesPaidTab({ status: 'C3:WON' })).toBe(true)
    expect(kitMatchesPaidTab({ status: 'C3:NEW' })).toBe(false)
  })

  it('matches unpaid kits by pending names or processing stages', () => {
    expect(kitMatchesUnpaidTab({ status_name: 'pending' })).toBe(true)
    expect(kitMatchesUnpaidTab({ status_name: 'in-progress' })).toBe(true)
    expect(kitMatchesUnpaidTab({ status: 'C3:PREPAYMENT_INVOICE' })).toBe(true)
    expect(kitMatchesUnpaidTab({ status: 'C3:AWAITING_CONFIRMATION' })).toBe(true)
    expect(kitMatchesUnpaidTab({ status: 'C3:WON' })).toBe(false)
  })
})
