import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { usePasswordStore } from '@/stores/password.store'
import { useEmailStore } from '@/stores/email.store'
import { useRegStore } from '@/stores/reg.store'
import { UI_MESSAGES as PASSWORD_UI } from '@/helpers/password-recovery'
import { UI_MESSAGES as EMAIL_UI } from '@/helpers/email-verification'
import { mockJson, mockStatus } from '@/test/fetch-mock'

vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('password store', () => {
  it('sends a recovery letter and starts the cooldown', async () => {
    mockJson('/api/v3/password/send-recovery', { message: 'ok' })
    const store = usePasswordStore()
    const result = await store.sendRecovery(' Legal@Example.com ')
    expect(result.message).toBe(PASSWORD_UI.recoverySendSuccess)
    expect(store.canResend()).toBe(false)
    expect(store.resendCooldownRemainingMs()).toBeGreaterThan(0)
  })

  it('blocks a second send while the cooldown is active', async () => {
    mockJson('/api/v3/password/send-recovery', { message: 'ok' })
    const store = usePasswordStore()
    await store.sendRecovery('a@b.c')
    await expect(store.sendRecovery('a@b.c')).rejects.toThrow(PASSWORD_UI.resendCooldown)
  })

  it('maps 429 and 503 on send-recovery', async () => {
    const store = usePasswordStore()
    mockStatus('/api/v3/password/send-recovery', 429, { detail: 'too many' })
    await expect(store.sendRecovery('a@b.c')).rejects.toThrow('too many')

    store.lastSentAt = null
    mockStatus('/api/v3/password/send-recovery', 503)
    await expect(store.sendRecovery('a@b.c')).rejects.toThrow(PASSWORD_UI.recoveryFeatureDisabled)
  })

  it('resets the password and maps known error statuses', async () => {
    const store = usePasswordStore()
    mockJson('/api/v3/password/reset', { message: 'done' })
    expect(await store.resetPassword('tok', 'secret1')).toEqual({ message: 'done' })

    mockStatus('/api/v3/password/reset', 400, { detail: 'bad link' })
    await expect(store.resetPassword('tok', 'x')).rejects.toThrow('bad link')

    mockStatus('/api/v3/password/reset', 422, {
      detail: [{ msg: 'too short' }],
    })
    await expect(store.resetPassword('tok', 'x')).rejects.toThrow('too short')

    mockStatus('/api/v3/password/reset', 429)
    await expect(store.resetPassword('tok', 'x')).rejects.toThrow(PASSWORD_UI.rateLimit)

    mockStatus('/api/v3/password/reset', 503)
    await expect(store.resetPassword('tok', 'x')).rejects.toThrow(
      PASSWORD_UI.recoveryFeatureDisabled
    )

    mockStatus('/api/v3/password/reset', 500)
    await expect(store.resetPassword('tok', 'x')).rejects.toThrow('Server error')
  })
})

describe('email store', () => {
  it('sends confirmation and confirms a token', async () => {
    mockJson('/api/v3/email/send-confirmation', { message: 'ok' })
    const store = useEmailStore()
    expect(await store.sendConfirmation('A@B.C')).toEqual({
      message: EMAIL_UI.sendConfirmationSuccess,
    })
    expect(store.canResend()).toBe(false)

    mockJson('/api/v3/email/confirm', { message: 'ok', email_verified: true })
    expect(await store.confirmEmail('tok')).toEqual({
      message: EMAIL_UI.confirmSuccess,
      email_verified: true,
    })
  })

  it('maps confirmation error statuses', async () => {
    const store = useEmailStore()
    mockStatus('/api/v3/email/confirm', 400)
    await expect(store.confirmEmail('bad')).rejects.toThrow(EMAIL_UI.confirmInvalidLink)

    mockStatus('/api/v3/email/confirm', 429, { message: 'slow' })
    await expect(store.confirmEmail('bad')).rejects.toThrow('slow')

    mockStatus('/api/v3/email/confirm', 503)
    await expect(store.confirmEmail('bad')).rejects.toThrow(EMAIL_UI.featureDisabled)

    mockStatus('/api/v3/email/confirm', 500)
    await expect(store.confirmEmail('bad')).rejects.toThrow('Server error')
  })

  it('maps send-confirmation 429/503', async () => {
    const store = useEmailStore()
    mockStatus('/api/v3/email/send-confirmation', 429)
    await expect(store.sendConfirmation('a@b.c')).rejects.toThrow(EMAIL_UI.rateLimit)

    store.lastSentAt = null
    mockStatus('/api/v3/email/send-confirmation', 503, { detail: 'off' })
    await expect(store.sendConfirmation('a@b.c')).rejects.toThrow('off')
  })
})

describe('registration store', () => {
  it('normalizes email and phone before posting', async () => {
    mockJson('/api/v3/register', { id: 1 })
    const form = ref({
      full_name: '  Иванов  ',
      personal_email: ' Legal@Example.com ',
      personal_phone_number: '8 (900) 123-45-67',
      password: 'secret1',
    })
    const result = await useRegStore().register(form)
    expect(result).toEqual({ email: 'legal@example.com' })
  })

  it('reports a duplicate email for 409/400', async () => {
    mockStatus('/api/v3/register', 409, { detail: 'personal email already registered' })
    const form = ref({
      full_name: 'A',
      personal_email: 'a@b.c',
      personal_phone_number: '79001234567',
      password: 'secret1',
    })
    await expect(useRegStore().register(form)).rejects.toThrow(
      'Такой email уже зарегистрирован'
    )
  })

  it('passes through an unrelated registration error', async () => {
    mockStatus('/api/v3/register', 422, { detail: 'weak password' })
    const form = ref({
      full_name: 'A',
      personal_email: 'a@b.c',
      personal_phone_number: '79001234567',
      password: 'x',
    })
    await expect(useRegStore().register(form)).rejects.toThrow('weak password')
  })
})
