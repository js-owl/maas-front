import { describe, expect, it } from 'vitest'
import {
  EMAIL_NOT_VERIFIED_ERROR,
  EMAIL_VERIFICATION_DETAIL,
  UI_MESSAGES,
  isEmailNotVerifiedError,
  isEmailVerificationDetail,
  normalizeEmail,
  parseTokenFromRoute,
} from './email-verification'

describe('normalizeEmail', () => {
  it('trims and lowercases', () => {
    expect(normalizeEmail('  Legal@Example.COM ')).toBe('legal@example.com')
  })
})

describe('parseTokenFromRoute', () => {
  it('reads a string token', () => {
    expect(parseTokenFromRoute({ token: ' abc ' })).toBe('abc')
  })

  it('reads the first array entry', () => {
    expect(parseTokenFromRoute({ token: ['tok', 'ignored'] })).toBe('tok')
  })

  it('returns null for missing or blank tokens', () => {
    expect(parseTokenFromRoute({})).toBeNull()
    expect(parseTokenFromRoute({ token: '   ' })).toBeNull()
    expect(parseTokenFromRoute({ token: ['  '] })).toBeNull()
    expect(parseTokenFromRoute({ token: [null as unknown as string] })).toBeNull()
  })
})

describe('isEmailVerificationDetail', () => {
  it('matches English and Russian phrasing', () => {
    expect(isEmailVerificationDetail(EMAIL_VERIFICATION_DETAIL)).toBe(true)
    expect(isEmailVerificationDetail('confirm your email')).toBe(true)
    expect(isEmailVerificationDetail('Подтвердите email')).toBe(true)
  })

  it('accepts non-string details via JSON stringify', () => {
    expect(isEmailVerificationDetail({ message: 'email not verified' })).toBe(true)
  })

  it('rejects unrelated details', () => {
    expect(isEmailVerificationDetail('Invalid credentials')).toBe(false)
    expect(isEmailVerificationDetail(null)).toBe(false)
  })
})

describe('isEmailNotVerifiedError', () => {
  it('recognizes only the dedicated error message', () => {
    expect(isEmailNotVerifiedError(new Error(EMAIL_NOT_VERIFIED_ERROR))).toBe(true)
    expect(isEmailNotVerifiedError(new Error('other'))).toBe(false)
    expect(isEmailNotVerifiedError('EMAIL_NOT_VERIFIED')).toBe(false)
  })
})

describe('UI_MESSAGES', () => {
  it('interpolates the registration email', () => {
    expect(UI_MESSAGES.registrationCheckEmail('a@b.c')).toContain('a@b.c')
  })
})
