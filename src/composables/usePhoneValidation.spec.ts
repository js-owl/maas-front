import { describe, expect, it } from 'vitest'
import {
  createPhoneNumberValidator,
  ensureRuPhoneModelValue,
  formatPhoneDisplay,
  isRuPhoneOnlyPrefix,
  normalizePhoneInput,
  normalizeRuPhoneDigits,
  parsePhoneToDigits,
} from '@/composables/usePhoneValidation'

const collect = (value: string, allowEmpty = false): Error | undefined => {
  let error: Error | undefined
  createPhoneNumberValidator({ allowEmpty })({}, value, (err) => {
    error = err
  })
  return error
}

describe('normalizeRuPhoneDigits', () => {
  it('returns empty for blank input', () => {
    expect(normalizeRuPhoneDigits('')).toBe('')
    expect(normalizeRuPhoneDigits('abc')).toBe('')
  })

  it('converts 8XXXXXXXXXX and 9XXXXXXXXX to 7…', () => {
    expect(normalizeRuPhoneDigits('89001234567')).toBe('79001234567')
    expect(normalizeRuPhoneDigits('9001234567')).toBe('79001234567')
  })

  it('prefixes a leading 7 when missing and truncates to 11 digits', () => {
    expect(normalizeRuPhoneDigits('4951234567')).toBe('74951234567')
    expect(normalizeRuPhoneDigits('812345678901234')).toBe('71234567890')
    expect(normalizeRuPhoneDigits('7900123456789')).toBe('79001234567')
  })
})

describe('isRuPhoneOnlyPrefix / ensureRuPhoneModelValue', () => {
  it('treats empty and bare 7 as prefix-only', () => {
    expect(isRuPhoneOnlyPrefix('')).toBe(true)
    expect(isRuPhoneOnlyPrefix('7')).toBe(true)
    expect(isRuPhoneOnlyPrefix('+7 (900)')).toBe(false)
  })

  it('ensures a model value always starts with 7', () => {
    expect(ensureRuPhoneModelValue()).toBe('7')
    expect(ensureRuPhoneModelValue('9001234567')).toBe('79001234567')
  })
})

describe('createPhoneNumberValidator', () => {
  it('allows an empty optional field', () => {
    expect(collect('7', true)).toBeUndefined()
  })

  it('requires a full number for a mandatory field', () => {
    expect(collect('7')?.message).toBe('Введите телефон')
    expect(collect('79001234567')).toBeUndefined()
  })

  it('rejects numbers that are not 7 + 10 digits', () => {
    expect(collect('7123')?.message).toMatch(/формате 7XXXXXXXXXX/)
  })

  it('treats the field as mandatory when called without options', () => {
    const results: Array<Error | undefined> = []
    const validate = createPhoneNumberValidator()
    validate({}, '', (err) => results.push(err))
    validate({}, '+7 (900) 123-45-67', (err) => results.push(err))
    expect(results[0]?.message).toBe('Введите телефон')
    expect(results[1]).toBeUndefined()
  })

  it('still validates a non-empty optional field', () => {
    expect(collect('7900', true)?.message).toMatch(/формате 7XXXXXXXXXX/)
    expect(collect('8 (900) 123-45-67', true)).toBeUndefined()
  })
})

describe('display helpers', () => {
  it('formats progressive display masks', () => {
    expect(formatPhoneDisplay('7')).toBe('+7')
    expect(formatPhoneDisplay('7900')).toBe('+7 (900')
    expect(formatPhoneDisplay('7900123')).toBe('+7 (900) 123')
    expect(formatPhoneDisplay('790012345')).toBe('+7 (900) 123-45')
    expect(formatPhoneDisplay('79001234567')).toBe('+7 (900) 123-45-67')
  })

  it('formats an empty or non-digit value as the bare prefix', () => {
    expect(formatPhoneDisplay('')).toBe('+7')
    expect(formatPhoneDisplay('abc')).toBe('+7')
  })

  it('parses display values back to digits with a fixed prefix', () => {
    expect(parsePhoneToDigits('')).toBe('7')
    expect(parsePhoneToDigits('+7 (900) 123-45-67')).toBe('79001234567')
    expect(normalizePhoneInput('8 (900) 123-45-67')).toBe('79001234567')
  })
})
