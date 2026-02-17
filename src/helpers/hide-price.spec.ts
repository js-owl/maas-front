import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { hidePrice, hiddenUsernames, hiddenStatuses } from '@/helpers/hide-price'

describe('hidePrice', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns true when username is in hiddenUsernames and status is in hiddenStatuses', () => {
    expect(hidePrice('AODMZ', 'NEW')).toBe(true)
    expect(hidePrice('KTSPECTR', 'C3:NEW')).toBe(true)
    expect(hidePrice('Kronshtadt', 'C3:PREPARATION')).toBe(true)
  })

  it('returns true when username is in hiddenUsernames and status is null or undefined', () => {
    expect(hidePrice('AODMZ', null)).toBe(true)
    expect(hidePrice('ecolibriaero_legal', undefined)).toBe(true)
  })

  it('returns false when username is not in hiddenUsernames', () => {
    expect(hidePrice('OtherCompany', 'NEW')).toBe(false)
    expect(hidePrice(null, 'NEW')).toBe(false)
    expect(hidePrice(undefined, 'C3:NEW')).toBe(false)
  })

  it('returns false when username is hidden but status is not in hiddenStatuses', () => {
    expect(hidePrice('AODMZ', 'CONFIRMED')).toBe(false)
    expect(hidePrice('KTSPECTR', 'DONE')).toBe(false)
  })
})

describe('hide-price constants', () => {
  it('hiddenUsernames contains expected companies', () => {
    expect(hiddenUsernames).toContain('AODMZ')
    expect(hiddenUsernames).toContain('ecolibriaero_legal')
    expect(hiddenUsernames.length).toBeGreaterThan(0)
  })

  it('hiddenStatuses contains expected statuses', () => {
    expect(hiddenStatuses).toContain('NEW')
    expect(hiddenStatuses).toContain('C3:NEW')
    expect(hiddenStatuses).toContain('C3:PREPARATION')
  })
})
