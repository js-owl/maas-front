import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { usePasswordStore } from '@/stores/password.store'
import { useEmailStore } from '@/stores/email.store'
import { useRegStore } from '@/stores/reg.store'
import { UI_MESSAGES as PASSWORD_UI } from '@/helpers/password-recovery'
import { RESEND_COOLDOWN_MS, UI_MESSAGES as EMAIL_UI } from '@/helpers/email-verification'
import { fetchCalls, lastFetchBody, mockJson, mockRoute, mockStatus } from '@/test/fetch-mock'

vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)
vi.spyOn(console, 'log').mockImplementation(() => undefined)

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

  it('posts the normalized email and reset payload', async () => {
    mockJson('/api/v3/password/send-recovery', { message: 'ok' })
    mockJson('/api/v3/password/reset', { message: 'done' })
    const store = usePasswordStore()
    await store.sendRecovery(' Legal@Example.com ')
    expect(lastFetchBody('/send-recovery')).toEqual({ personal_email: 'legal@example.com' })
    await store.resetPassword('tok', 'secret1')
    expect(lastFetchBody('/password/reset')).toEqual({ token: 'tok', password: 'secret1' })
  })

  it('reports no cooldown before anything was sent', () => {
    const store = usePasswordStore()
    expect(store.canResend()).toBe(true)
    expect(store.resendCooldownRemainingMs()).toBe(0)
  })

  it('counts the cooldown down with time and allows a resend afterwards', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    try {
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
      mockJson('/api/v3/password/send-recovery', { message: 'ok' })
      const store = usePasswordStore()
      await store.sendRecovery('a@b.c')
      expect(store.resendCooldownRemainingMs()).toBe(RESEND_COOLDOWN_MS)

      vi.setSystemTime(new Date(Date.now() + 20_000))
      expect(store.resendCooldownRemainingMs()).toBe(RESEND_COOLDOWN_MS - 20_000)
      expect(store.canResend()).toBe(false)

      vi.setSystemTime(new Date(Date.now() + RESEND_COOLDOWN_MS))
      expect(store.resendCooldownRemainingMs()).toBe(0)
      expect(store.canResend()).toBe(true)
      await expect(store.sendRecovery('a@b.c')).resolves.toEqual({
        message: PASSWORD_UI.recoverySendSuccess,
      })
      expect(fetchCalls('/send-recovery')).toHaveLength(2)
    } finally {
      vi.useRealTimers()
    }
  })

  it('accepts a send-recovery response without a JSON body', async () => {
    mockRoute('/api/v3/password/send-recovery', () => new Response('', { status: 200 }))
    const store = usePasswordStore()
    await expect(store.sendRecovery('a@b.c')).resolves.toEqual({
      message: PASSWORD_UI.recoverySendSuccess,
    })
    expect(store.lastSentAt).not.toBeNull()
  })

  it('fails send-recovery when the request is rejected outright', async () => {
    mockStatus('/api/v3/password/send-recovery', 400)
    const store = usePasswordStore()
    await expect(store.sendRecovery('a@b.c')).rejects.toThrow('Не удалось отправить письмо')
    expect(store.lastSentAt).toBeNull()
  })

  it('uses fallback messages and the message field on send-recovery errors', async () => {
    const store = usePasswordStore()
    mockStatus('/api/v3/password/send-recovery', 429)
    await expect(store.sendRecovery('a@b.c')).rejects.toThrow(PASSWORD_UI.rateLimit)

    mockStatus('/api/v3/password/send-recovery', 503, { message: 'maintenance' })
    await expect(store.sendRecovery('a@b.c')).rejects.toThrow('maintenance')
    expect(store.lastSentAt).toBeNull()
  })

  it('extracts error details from every supported shape', async () => {
    const store = usePasswordStore()
    // Array detail without msg falls through to message.
    mockStatus('/api/v3/password/reset', 400, { detail: [{ loc: ['body'] }], message: 'from message' })
    await expect(store.resetPassword('tok', 'x')).rejects.toThrow('from message')

    // Array detail with a non-string msg and a non-string message: no detail at all.
    mockStatus('/api/v3/password/reset', 400, { detail: [{ msg: 1 }], message: 2 })
    await expect(store.resetPassword('tok', 'x')).rejects.toThrow(PASSWORD_UI.recoveryInvalidLink)

    // Empty array detail.
    mockStatus('/api/v3/password/reset', 400, { detail: [] })
    await expect(store.resetPassword('tok', 'x')).rejects.toThrow(PASSWORD_UI.recoveryInvalidLink)

    // Body that is not JSON.
    mockRoute('/api/v3/password/reset', () => new Response('oops', { status: 400 }))
    await expect(store.resetPassword('tok', 'x')).rejects.toThrow(PASSWORD_UI.recoveryInvalidLink)
  })

  it('uses fallback messages on reset errors without details', async () => {
    const store = usePasswordStore()
    mockStatus('/api/v3/password/reset', 422)
    await expect(store.resetPassword('tok', 'x')).rejects.toThrow(
      'Пароль должен содержать минимум 6 символов'
    )

    mockStatus('/api/v3/password/reset', 429, { detail: 'slow down' })
    await expect(store.resetPassword('tok', 'x')).rejects.toThrow('slow down')

    mockStatus('/api/v3/password/reset', 503, { detail: 'disabled' })
    await expect(store.resetPassword('tok', 'x')).rejects.toThrow('disabled')
  })

  it('shows a server error toast for 5xx', async () => {
    mockStatus('/api/v3/password/reset', 502)
    await expect(usePasswordStore().resetPassword('tok', 'x')).rejects.toThrow('Server error')
    expect(ElMessage.error).toHaveBeenCalledWith('Ошибка сервера')
  })

  it('rejects other non-ok reset responses', async () => {
    mockStatus('/api/v3/password/reset', 404)
    await expect(usePasswordStore().resetPassword('tok', 'x')).rejects.toThrow(
      'Не удалось изменить пароль'
    )
  })

  it('uses the localized success text when the reset response has no message', async () => {
    mockJson('/api/v3/password/reset', {})
    expect(await usePasswordStore().resetPassword('tok', 'secret1')).toEqual({
      message: PASSWORD_UI.recoveryResetSuccess,
    })
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

  it('uses detail on 429 and the fallback on a bare 503', async () => {
    const store = useEmailStore()
    mockStatus('/api/v3/email/send-confirmation', 429, { detail: 'wait' })
    await expect(store.sendConfirmation('a@b.c')).rejects.toThrow('wait')

    mockStatus('/api/v3/email/send-confirmation', 503, { detail: { code: 1 }, message: 5 })
    await expect(store.sendConfirmation('a@b.c')).rejects.toThrow(EMAIL_UI.featureDisabled)
    expect(store.lastSentAt).toBeNull()
  })

  it('posts the normalized email', async () => {
    mockJson('/api/v3/email/send-confirmation', { message: 'ok' })
    await useEmailStore().sendConfirmation(' A@B.C ')
    expect(lastFetchBody('/send-confirmation')).toEqual({ personal_email: 'a@b.c' })
  })

  it('fails when the send-confirmation request is rejected outright', async () => {
    mockStatus('/api/v3/email/send-confirmation', 400)
    const store = useEmailStore()
    await expect(store.sendConfirmation('a@b.c')).rejects.toThrow('Не удалось отправить письмо')
    expect(store.canResend()).toBe(true)
  })

  it('reports no cooldown before anything was sent', () => {
    const store = useEmailStore()
    expect(store.canResend()).toBe(true)
    expect(store.resendCooldownRemainingMs()).toBe(0)
  })

  it('enforces the resend cooldown over time', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    try {
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
      mockJson('/api/v3/email/send-confirmation', { message: 'ok' })
      const store = useEmailStore()
      await store.sendConfirmation('a@b.c')
      expect(store.resendCooldownRemainingMs()).toBe(RESEND_COOLDOWN_MS)

      vi.setSystemTime(new Date(Date.now() + 15_000))
      expect(store.resendCooldownRemainingMs()).toBe(RESEND_COOLDOWN_MS - 15_000)
      await expect(store.sendConfirmation('a@b.c')).rejects.toThrow(EMAIL_UI.resendCooldown)
      expect(fetchCalls('/send-confirmation')).toHaveLength(1)

      vi.setSystemTime(new Date(Date.now() + RESEND_COOLDOWN_MS))
      expect(store.resendCooldownRemainingMs()).toBe(0)
      expect(store.canResend()).toBe(true)
      await store.sendConfirmation('a@b.c')
      expect(fetchCalls('/send-confirmation')).toHaveLength(2)
    } finally {
      vi.useRealTimers()
    }
  })

  it('maps remaining confirmation statuses and fallbacks', async () => {
    const store = useEmailStore()
    mockStatus('/api/v3/email/confirm', 400, { detail: 'expired' })
    await expect(store.confirmEmail('t')).rejects.toThrow('expired')

    mockStatus('/api/v3/email/confirm', 429)
    await expect(store.confirmEmail('t')).rejects.toThrow(EMAIL_UI.rateLimit)

    mockStatus('/api/v3/email/confirm', 503, { detail: 'paused' })
    await expect(store.confirmEmail('t')).rejects.toThrow('paused')

    mockStatus('/api/v3/email/confirm', 404)
    await expect(store.confirmEmail('t')).rejects.toThrow('Не удалось подтвердить email')
  })

  it('shows a server error toast on 5xx confirmation', async () => {
    mockStatus('/api/v3/email/confirm', 502)
    await expect(useEmailStore().confirmEmail('t')).rejects.toThrow('Server error')
    expect(ElMessage.error).toHaveBeenCalledWith('Ошибка сервера')
  })

  it('sends the token and defaults email_verified to true', async () => {
    mockJson('/api/v3/email/confirm', { message: 'ok' })
    expect(await useEmailStore().confirmEmail('tok-9')).toEqual({
      message: EMAIL_UI.confirmSuccess,
      email_verified: true,
    })
    expect(lastFetchBody('/email/confirm')).toEqual({ token: 'tok-9' })

    mockJson('/api/v3/email/confirm', { message: 'ok', email_verified: false })
    expect((await useEmailStore().confirmEmail('tok-9')).email_verified).toBe(false)
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

  it('reports a duplicate email for 409', async () => {
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

  const regForm = () =>
    ref({
      full_name: '  Иванов Иван  ',
      personal_email: 'A@B.C',
      personal_phone_number: '+7 900 123-45-67',
      password: 'secret1',
    })

  it('posts the trimmed, normalized payload', async () => {
    mockJson('/api/v3/register', { id: 1 })
    await useRegStore().register(regForm())
    expect(lastFetchBody('/register')).toEqual({
      full_name: 'Иванов Иван',
      personal_email: 'a@b.c',
      personal_phone_number: '79001234567',
      password: 'secret1',
    })
  })

  it('reports a duplicate email for a 400 whose detail says so', async () => {
    mockStatus('/api/v3/register', 400, { detail: 'personal email already registered' })
    await expect(useRegStore().register(regForm())).rejects.toThrow(
      'Такой email уже зарегистрирован'
    )
  })

  it('shows the real reason for an unrelated 400 instead of a duplicate-email message', async () => {
    mockStatus('/api/v3/register', 400, { detail: 'bad request' })
    await expect(useRegStore().register(regForm())).rejects.toThrow('bad request')
  })

  it('reports a duplicate email when the message says it already exists', async () => {
    mockStatus('/api/v3/register', 422, { message: 'Пользователь уже существует' })
    await expect(useRegStore().register(regForm())).rejects.toThrow(
      'Такой email уже зарегистрирован'
    )
  })

  it('uses the message field for unrelated errors', async () => {
    mockStatus('/api/v3/register', 422, { message: 'phone invalid' })
    await expect(useRegStore().register(regForm())).rejects.toThrow('phone invalid')
  })

  it('stringifies a structured detail', async () => {
    const detail = [{ loc: ['body', 'password'], msg: 'too short' }]
    mockStatus('/api/v3/register', 422, { detail })
    await expect(useRegStore().register(regForm())).rejects.toThrow(JSON.stringify(detail))
  })

  it('falls back to the status line for empty, null or non-JSON bodies', async () => {
    mockStatus('/api/v3/register', 422, {})
    await expect(useRegStore().register(regForm())).rejects.toThrow(/Registration failed: 422/)

    mockStatus('/api/v3/register', 422, null)
    await expect(useRegStore().register(regForm())).rejects.toThrow(/Registration failed: 422/)

    mockRoute('/api/v3/register', () => new Response('<html>', { status: 500 }))
    await expect(useRegStore().register(regForm())).rejects.toThrow(/Registration failed: 500/)
  })
})
