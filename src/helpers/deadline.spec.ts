import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatDeadline, parseDeadline } from './deadline'

describe('formatDeadline', () => {
  it('returns ISO string for a date', () => {
    expect(formatDeadline(new Date('2026-03-15T12:00:00.000Z'))).toBe('2026-03-15T12:00:00.000Z')
  })

  it('returns undefined for nullish input', () => {
    expect(formatDeadline(null)).toBeUndefined()
    expect(formatDeadline(undefined)).toBeUndefined()
  })
})

describe('parseDeadline', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-10T15:30:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('prefers an explicit deadline string', () => {
    const date = parseDeadline({ deadline: '2026-02-01T00:00:00.000Z', manufacturing_cycle: 5 })
    expect(date?.toISOString()).toBe('2026-02-01T00:00:00.000Z')
  })

  it('adds manufacturing_cycle days from the start of today', () => {
    const date = parseDeadline({ manufacturing_cycle: 3 })
    expect(date).toEqual(new Date(2026, 0, 13))
  })

  it('returns null when neither field is present', () => {
    expect(parseDeadline({})).toBeNull()
    expect(parseDeadline({ manufacturing_cycle: 0 })).toBeNull()
  })
})
