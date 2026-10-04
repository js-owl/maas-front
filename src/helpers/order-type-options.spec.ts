import { describe, expect, it } from 'vitest'
import { orderTypeOptions } from './order-type-options'
import { PASSWORD_JUST_RESET_KEY, UI_MESSAGES } from './password-recovery'
import { RESEND_COOLDOWN_MS, normalizeEmail, parseTokenFromRoute } from './password-recovery'

describe('orderTypeOptions', () => {
  it('lists every calculator entry with a route and service id', () => {
    expect(orderTypeOptions.map((item) => item.value)).toEqual([
      'milling',
      'printing',
      'composite',
      'galvanic',
      'other',
    ])
    for (const option of orderTypeOptions) {
      expect(option.routePath).toMatch(/^\//)
      expect(option.serviceId).toBeTruthy()
      expect(option.label).toBeTruthy()
    }
  })
})

describe('password-recovery re-exports', () => {
  it('exposes shared email helpers and its own UI copy', () => {
    expect(PASSWORD_JUST_RESET_KEY).toBe('password-just-reset')
    expect(RESEND_COOLDOWN_MS).toBe(60_000)
    expect(normalizeEmail(' A@B.C ')).toBe('a@b.c')
    expect(parseTokenFromRoute({ token: 'reset' })).toBe('reset')
    expect(UI_MESSAGES.recoveryResetSuccess).toMatch(/Пароль/)
    expect(UI_MESSAGES.rateLimit).toBeTruthy()
  })
})
