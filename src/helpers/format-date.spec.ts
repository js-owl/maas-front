import { describe, expect, it } from 'vitest'
import {
  formatMoscowDate,
  formatMoscowDateTime,
  formatMoscowTime,
} from '@/helpers/format-date'

describe('format-date Moscow timezone', () => {
  it('converts UTC timestamps to Moscow time', () => {
    const utc = '2026-08-25T09:28:00.000Z'

    expect(formatMoscowTime(utc)).toBe('12:28')
    expect(formatMoscowDate(utc)).toBe('25.08.2026')
    expect(formatMoscowDateTime(utc)).toBe('25 августа 2026 г.   12:28')
  })

  it('treats timezone-less timestamps as UTC', () => {
    expect(formatMoscowTime('2026-08-25T12:44:00')).toBe('15:44')
    expect(formatMoscowTime('2026-08-25 12:44:00')).toBe('15:44')
    expect(formatMoscowDateTime('2026-08-25T12:44:00')).toBe(
      '25 августа 2026 г.   15:44'
    )
  })

  it('returns empty string for missing or invalid values', () => {
    expect(formatMoscowDateTime()).toBe('')
    expect(formatMoscowDate(null)).toBe('')
    expect(formatMoscowTime('not-a-date')).toBe('')
  })
})
