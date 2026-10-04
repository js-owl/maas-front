import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ElMessage } from 'element-plus'
import {
  fetchWithAuth,
  fileToBase64,
  handleEmailVerificationBlocked,
  req_json,
  req_json_auth,
  req_urlencoded,
  req_urlencoded_auth,
  uploadDocument,
  uploadFile3D,
} from '@/api'
import { useAuthStore } from '@/stores/auth.store'
import { EMAIL_VERIFICATION_DETAIL } from '@/helpers/email-verification'
import { fetchCalls, lastFetchCall, mockJson, mockNetworkError, mockStatus } from '@/test/fetch-mock'
import router from '@/router'

vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)
vi.spyOn(router, 'push').mockResolvedValue(undefined as never)

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('handleEmailVerificationBlocked', () => {
  it('ignores non-403 responses', async () => {
    expect(await handleEmailVerificationBlocked(new Response(null, { status: 401 }))).toBe(false)
  })

  it('redirects to login with verify=1 on an unverified-email 403', async () => {
    useAuthStore().setToken('old', false)
    const res = new Response(JSON.stringify({ detail: EMAIL_VERIFICATION_DETAIL }), { status: 403 })
    expect(await handleEmailVerificationBlocked(res)).toBe(true)
    expect(useAuthStore().getToken).toBeUndefined()
    expect(router.push).toHaveBeenCalledWith({
      name: 'home',
      query: { login: '1', verify: '1' },
    })
  })

  it('ignores a 403 with an unrelated detail', async () => {
    const res = new Response(JSON.stringify({ detail: 'Forbidden' }), { status: 403 })
    expect(await handleEmailVerificationBlocked(res)).toBe(false)
    expect(router.push).not.toHaveBeenCalled()
  })
})

describe('fetchWithAuth', () => {
  it('attaches the bearer token and returns a successful response', async () => {
    useAuthStore().setToken('tok-1', false)
    mockJson('/api/v3/profile', { id: 1 })

    const res = await fetchWithAuth('/profile', { method: 'GET' })
    expect(res.ok).toBe(true)
    expect(lastFetchCall('/profile')?.headers.authorization).toBe('Bearer tok-1')
  })

  it('refreshes once on 401 and retries with the new token', async () => {
    useAuthStore().setToken('expired', false)
    // Register the success response first (deeper), then a once-401 on top.
    mockJson('/api/v3/profile', { id: 1 })
    mockStatus('/api/v3/profile', 401, {}, { once: true })
    mockJson('/api/v3/refresh', {
      access_token: 'fresh',
      token_type: 'bearer',
      must_change_password: false,
    })

    const res = await fetchWithAuth('/profile', { method: 'GET' })
    expect(res.ok).toBe(true)
    expect(useAuthStore().getToken).toBe('fresh')
    expect(fetchCalls('/profile')).toHaveLength(2)
    expect(fetchCalls('/refresh')).toHaveLength(1)
  })

  it('deduplicates parallel refresh calls', async () => {
    useAuthStore().setToken('expired', false)
    mockJson('/api/v3/a', { ok: true })
    mockJson('/api/v3/b', { ok: true })
    mockStatus('/api/v3/a', 401, {}, { once: true })
    mockStatus('/api/v3/b', 401, {}, { once: true })
    mockJson('/api/v3/refresh', {
      access_token: 'fresh',
      token_type: 'bearer',
      must_change_password: true,
    })

    await Promise.all([fetchWithAuth('/a'), fetchWithAuth('/b')])
    expect(fetchCalls('/refresh')).toHaveLength(1)
    expect(useAuthStore().getMustChangePassword).toBe(true)
  })

  it('redirects to login when refresh fails', async () => {
    useAuthStore().setToken('expired', false)
    mockStatus('/api/v3/profile', 401)
    mockStatus('/api/v3/refresh', 401)

    await expect(fetchWithAuth('/profile')).rejects.toThrow('Authentification failed')
    expect(router.push).toHaveBeenCalledWith({ name: 'home', query: { login: '1' } })
    expect(useAuthStore().getToken).toBeUndefined()
  })

  it('throws when the retry after refresh is still 401', async () => {
    useAuthStore().setToken('expired', false)
    mockStatus('/api/v3/profile', 401)
    mockJson('/api/v3/refresh', {
      access_token: 'fresh',
      token_type: 'bearer',
      must_change_password: false,
    })
    // The retry hits the same 401 route again (not once-only).
    await expect(fetchWithAuth('/profile')).rejects.toThrow('Authentification failed')
  })

  it('throws when email verification blocks the request', async () => {
    mockStatus('/api/v3/profile', 403, { detail: EMAIL_VERIFICATION_DETAIL })
    await expect(fetchWithAuth('/profile')).rejects.toThrow('Email not verified')
  })

  it('treats a refresh without access_token as failure', async () => {
    useAuthStore().setToken('expired', false)
    mockStatus('/api/v3/profile', 401, {}, { once: true })
    mockJson('/api/v3/refresh', { token_type: 'bearer', must_change_password: false })
    await expect(fetchWithAuth('/profile')).rejects.toThrow('Authentification failed')
  })
})

describe('req_json / req_json_auth', () => {
  it('posts JSON and returns the response', async () => {
    mockJson('/api/v3/ping', { ok: true })
    const res = await req_json('/ping', 'POST', { a: 1 })
    expect(await res!.json()).toEqual({ ok: true })
    expect(lastFetchCall('/ping')?.body).toBe('{"a":1}')
  })

  it('allows selected error statuses through, including 503', async () => {
    mockStatus('/api/v3/ping', 429, { detail: 'slow down' })
    const res = await req_json('/ping', 'POST', {}, [429])
    expect(res?.status).toBe(429)

    mockStatus('/api/v3/ping', 503, { detail: 'off' })
    const res503 = await req_json('/ping', 'POST', {}, [503])
    expect(res503?.status).toBe(503)
  })

  it('swallows http errors and shows a network message on TypeError', async () => {
    mockStatus('/api/v3/ping', 400)
    expect(await req_json('/ping')).toBeUndefined()

    mockNetworkError('/api/v3/down')
    expect(await req_json('/down')).toBeUndefined()
    expect(ElMessage.error).toHaveBeenCalled()
  })

  it('rejects 5xx with a server error message', async () => {
    mockStatus('/api/v3/boom', 500)
    expect(await req_json('/boom')).toBeUndefined()
    expect(ElMessage.error).toHaveBeenCalledWith('Ошибка сервера 500')
  })

  it('sends authenticated JSON via fetchWithAuth', async () => {
    useAuthStore().setToken('tok', false)
    mockJson('/api/v3/secure', { ok: true })
    const res = await req_json_auth('/secure', 'GET')
    expect(res?.ok).toBe(true)
    expect(lastFetchCall('/secure')?.headers.authorization).toBe('Bearer tok')
  })

  it('allows 422 through on authenticated requests', async () => {
    useAuthStore().setToken('tok', false)
    mockStatus('/api/v3/secure', 422, { detail: 'validation' })
    const res = await req_json_auth('/secure', 'PUT', { x: 1 }, [422])
    expect(res?.status).toBe(422)
  })
})

describe('req_urlencoded helpers', () => {
  it('encodes the body and returns ok responses', async () => {
    mockJson('/api/v3/form', { ok: true })
    const res = await req_urlencoded('/form', 'POST', { a: 'b c' })
    expect(res?.ok).toBe(true)
    expect(lastFetchCall('/form')?.body).toBe('a=b%20c')
  })

  it('sends authenticated urlencoded requests and maps 5xx/http errors', async () => {
    useAuthStore().setToken('tok', false)
    mockJson('/api/v3/form-auth', { ok: true })
    const res = await req_urlencoded_auth('/form-auth', 'POST', { q: 1 })
    expect(res?.ok).toBe(true)
    expect(lastFetchCall('/form-auth')?.headers.authorization).toBe('Bearer tok')

    mockStatus('/api/v3/form-auth', 500)
    expect(await req_urlencoded_auth('/form-auth', 'POST', { q: 1 })).toBeUndefined()
    expect(ElMessage.error).toHaveBeenCalledWith('Ошибка сервера 500')

    mockStatus('/api/v3/form-auth', 400)
    expect(await req_urlencoded_auth('/form-auth', 'POST', { q: 1 })).toBeUndefined()
  })

  it('maps urlencoded 5xx and network errors', async () => {
    mockStatus('/api/v3/form', 503)
    expect(await req_urlencoded('/form', 'POST', { a: 1 })).toBeUndefined()

    mockNetworkError('/api/v3/form')
    expect(await req_urlencoded('/form', 'POST', { a: 1 })).toBeUndefined()
    expect(ElMessage.error).toHaveBeenCalled()
  })

  it('maps authenticated JSON http and network errors', async () => {
    useAuthStore().setToken('tok', false)
    mockStatus('/api/v3/secure', 400)
    expect(await req_json_auth('/secure', 'GET')).toBeUndefined()

    mockNetworkError('/api/v3/secure')
    expect(await req_json_auth('/secure', 'GET')).toBeUndefined()
  })
})

describe('uploads and fileToBase64', () => {
  it('posts file and document payloads through req_json_auth', async () => {
    useAuthStore().setToken('tok', false)
    mockJson('/api/v3/files', { id: 1 })
    mockJson('/api/v3/documents', { id: 2 })

    await uploadFile3D('a.stp', 'AAA', 'stp')
    await uploadDocument('doc.pdf', 'BBB', 'drawing')

    expect(lastFetchCall('/files')?.body).toContain('file_name')
    expect(lastFetchCall('/documents')?.body).toContain('document_category')
  })

  it('reads a File as base64 without the data-url prefix', async () => {
    const file = new File(['hello'], 'a.txt', { type: 'text/plain' })
    // jsdom FileReader may not populate result synchronously; polyfill for the test.
    const original = FileReader
    class FakeReader {
      result: string | null = null
      onload: ((ev: ProgressEvent<FileReader>) => void) | null = null
      onerror: ((ev: ProgressEvent<FileReader>) => void) | null = null
      readAsDataURL() {
        this.result = 'data:text/plain;base64,aGVsbG8='
        this.onload?.({} as ProgressEvent<FileReader>)
      }
    }
    vi.stubGlobal('FileReader', FakeReader)
    await expect(fileToBase64(file)).resolves.toBe('aGVsbG8=')
    vi.stubGlobal('FileReader', original)
  })
})
