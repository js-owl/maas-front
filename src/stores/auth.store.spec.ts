import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import { EMAIL_NOT_VERIFIED_ERROR, EMAIL_VERIFICATION_DETAIL } from '@/helpers/email-verification'
import { lastFetchBody, lastFetchCall, mockJson, mockStatus } from '@/test/fetch-mock'
import { mockAuthResponse, mockLegalProfile } from '@/test/fixtures'

const credentials = { username: 'Legal@Example.com ', password: 'pw' }

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('login failure messages', () => {
  it('reports wrong credentials on 401', async () => {
    mockStatus('/api/v3/login', 401, { detail: 'Invalid credentials' })
    await expect(useAuthStore().login(credentials, false)).rejects.toThrow(
      'Неправильный email или пароль'
    )
  })

  it('reports wrong credentials when the body has no detail', async () => {
    mockStatus('/api/v3/login', 401)
    await expect(useAuthStore().login(credentials, false)).rejects.toThrow(
      'Неправильный email или пароль'
    )
  })

  it('reports wrong credentials when the server wording is Russian', async () => {
    mockStatus('/api/v3/login', 400, { detail: 'Неверный пароль' })
    await expect(useAuthStore().login(credentials, false)).rejects.toThrow(
      'Неправильный email или пароль'
    )
  })

  it('flags an unverified email separately from bad credentials', async () => {
    mockStatus('/api/v3/login', 403, { detail: EMAIL_VERIFICATION_DETAIL })
    await expect(useAuthStore().login(credentials, false)).rejects.toThrow(
      EMAIL_NOT_VERIFIED_ERROR
    )
  })

  it('passes through an unrelated server detail', async () => {
    mockStatus('/api/v3/login', 400, { detail: 'Аккаунт заблокирован' })
    await expect(useAuthStore().login(credentials, false)).rejects.toThrow(
      'Аккаунт заблокирован'
    )
  })

  it('falls back to the status line when there is no JSON body', async () => {
    mockStatus('/api/v3/login', 500)
    await expect(useAuthStore().login(credentials, false)).rejects.toThrow(/Login failed: 500/)
  })
})

describe('successful login', () => {
  beforeEach(() => {
    mockJson('/api/v3/login', mockAuthResponse)
    mockJson('/api/v3/profile', mockLegalProfile)
  })

  it('normalizes the email before sending it', async () => {
    await useAuthStore().login(credentials, false)
    expect(lastFetchBody<{ personal_email: string }>('/login')!.personal_email).toBe(
      'legal@example.com'
    )
  })

  it('keeps the token in sessionStorage when rememberMe is off', async () => {
    const auth = useAuthStore()
    await auth.login(credentials, false)

    expect(auth.getToken).toBe(mockAuthResponse.access_token)
    expect(sessionStorage.getItem('token-store')).toBe(mockAuthResponse.access_token)
    expect(localStorage.getItem('token-store')).toBeNull()
    expect(localStorage.getItem('token-persistence')).toBe('session')
  })

  it('keeps the token in localStorage when rememberMe is on', async () => {
    const auth = useAuthStore()
    await auth.login(credentials, true)

    expect(localStorage.getItem('token-store')).toBe(mockAuthResponse.access_token)
    expect(sessionStorage.getItem('token-store')).toBeNull()
    expect(localStorage.getItem('token-persistence')).toBe('local')
  })

  it('still succeeds when loading the profile fails', async () => {
    mockStatus('/api/v3/profile', 500)
    const auth = useAuthStore()
    await expect(auth.login(credentials, false)).resolves.toBeUndefined()
    expect(auth.getToken).toBe(mockAuthResponse.access_token)
  })
})

describe('clearToken', () => {
  it('drops the token from both storages', async () => {
    mockJson('/api/v3/login', mockAuthResponse)
    mockJson('/api/v3/profile', mockLegalProfile)
    const auth = useAuthStore()
    await auth.login(credentials, true)

    auth.clearToken()

    expect(auth.getToken).toBeUndefined()
    expect(localStorage.getItem('token-store')).toBeNull()
    expect(sessionStorage.getItem('token-store')).toBeNull()
    expect(localStorage.getItem('token-persistence')).toBeNull()
  })
})

describe('login failure detail parsing', () => {
  it('uses the message field when detail is absent', async () => {
    mockStatus('/api/v3/login', 400, { message: 'Сервис недоступен' })
    await expect(useAuthStore().login(credentials, false)).rejects.toThrow('Сервис недоступен')
  })

  it('stringifies a structured detail', async () => {
    mockStatus('/api/v3/login', 422, { detail: [{ msg: 'field required' }] })
    await expect(useAuthStore().login(credentials, false)).rejects.toThrow(
      JSON.stringify([{ msg: 'field required' }])
    )
  })

  it('falls back to the status line for an empty or null JSON body', async () => {
    mockStatus('/api/v3/login', 418, {})
    await expect(useAuthStore().login(credentials, false)).rejects.toThrow(/Login failed: 418/)

    mockStatus('/api/v3/login', 418, null)
    await expect(useAuthStore().login(credentials, false)).rejects.toThrow(/Login failed: 418/)
  })

  it('does not treat an unrelated 403 as an unverified email', async () => {
    mockStatus('/api/v3/login', 403, { detail: 'Доступ запрещён' })
    await expect(useAuthStore().login(credentials, false)).rejects.toThrow('Доступ запрещён')
  })

  it('sends an empty email when the username is missing', async () => {
    mockStatus('/api/v3/login', 401)
    await expect(useAuthStore().login({ password: 'pw' })).rejects.toThrow()
    expect(lastFetchBody<{ personal_email: string; remember_me: boolean }>('/login')).toEqual({
      personal_email: '',
      password: 'pw',
      remember_me: true,
    })
  })
})

describe('token rehydration', () => {
  it('restores a remembered token from localStorage', () => {
    localStorage.setItem('token-persistence', 'local')
    localStorage.setItem('token-store', 'saved-local')
    sessionStorage.setItem('token-store', 'ignored-session')
    setActivePinia(createPinia())
    expect(useAuthStore().getToken).toBe('saved-local')
  })

  it('restores a session token when persistence is not local', () => {
    localStorage.setItem('token-store', 'ignored-local')
    sessionStorage.setItem('token-store', 'saved-session')
    setActivePinia(createPinia())
    expect(useAuthStore().getToken).toBe('saved-session')
  })

  it('starts without a token when storage is empty', () => {
    expect(useAuthStore().getToken).toBeUndefined()
  })

  it('setToken defaults to the persisted storage type', () => {
    localStorage.setItem('token-persistence', 'local')
    setActivePinia(createPinia())
    const auth = useAuthStore()
    auth.setToken('next')
    expect(localStorage.getItem('token-store')).toBe('next')
    expect(sessionStorage.getItem('token-store')).toBeNull()
  })
})

describe('mustChangePassword', () => {
  it('is taken from the login response and can be overridden', async () => {
    mockJson('/api/v3/login', { ...mockAuthResponse, must_change_password: true })
    mockJson('/api/v3/profile', mockLegalProfile)
    const auth = useAuthStore()
    await auth.login(credentials, false)
    expect(auth.getMustChangePassword).toBe(true)

    auth.setMustChangePassword(false)
    expect(auth.getMustChangePassword).toBe(false)

    auth.setMustChangePassword(true)
    auth.clearToken()
    expect(auth.getMustChangePassword).toBe(false)
  })
})

describe('logout', () => {
  it('sends the bearer token when logged in', async () => {
    mockJson('/api/v3/logout', {})
    const auth = useAuthStore()
    auth.setToken('tok-1', false)
    await auth.logout()
    expect(lastFetchCall('/logout')!.headers.authorization).toBe('Bearer tok-1')
    expect(auth.getToken).toBeUndefined()
  })

  it('omits the Authorization header without a token', async () => {
    mockJson('/api/v3/logout', {})
    await useAuthStore().logout()
    expect(lastFetchCall('/logout')!.headers.authorization).toBeUndefined()
  })

  it('clears local state even if the request fails', async () => {
    mockJson('/api/v3/login', mockAuthResponse)
    mockJson('/api/v3/profile', mockLegalProfile)
    const auth = useAuthStore()
    await auth.login(credentials, false)

    mockStatus('/api/v3/logout', 500)
    await auth.logout()

    expect(auth.getToken).toBeUndefined()
    expect(sessionStorage.getItem('token-store')).toBeNull()
  })
})
