import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useIsManager } from '@/composables/useIsManager'
import { useAuthStore } from '@/stores/auth.store'
import { useProfileStore } from '@/stores/profile.store'

/** Encodes a JWT-like payload segment (header.payload.signature). */
const tokenWithRole = (role: unknown): string => {
  const header = btoa(JSON.stringify({ alg: 'none' }))
  const payload = btoa(JSON.stringify({ role }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return `${header}.${payload}.sig`
}

describe('useIsManager', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('is false without a token or profile role', () => {
    expect(useIsManager().value).toBe(false)
  })

  it('reads the role from the access token payload', () => {
    useAuthStore().setToken(tokenWithRole('Manager'), false)
    expect(useIsManager().value).toBe(true)
  })

  it('falls back to the profile role when the token has no role', () => {
    useAuthStore().setToken(tokenWithRole(null), false)
    useProfileStore().profile = { role: 'manager' } as never
    expect(useIsManager().value).toBe(true)
  })

  it('ignores a malformed token segment', () => {
    useAuthStore().setToken('not.a.jwt', false)
    expect(useIsManager().value).toBe(false)
  })

  it('ignores a token without a payload segment', () => {
    useAuthStore().setToken('only-one-segment', false)
    expect(useIsManager().value).toBe(false)
  })
})
