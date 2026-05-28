import { ElMessage } from 'element-plus'
import { useAuthStore } from './stores/auth.store'
import router from './router'
import { isEmailVerificationDetail } from './helpers/email-verification'

// API Base URLs
// Auto-detect based on environment
export const API_BASE = import.meta.env.VITE_API_BASE || '/api/v3';

type AuthResponse = {
  access_token: string
  token_type: string
  must_change_password: boolean
}

let refreshTokenPromise: Promise<boolean> | null = null

const redirectToLogin = (options?: { verify?: boolean }) => {
  const authStore = useAuthStore()
  authStore.clearToken()

  const query: Record<string, string> = { login: '1' }
  if (options?.verify) query.verify = '1'

  const current = router.currentRoute.value
  const sameTarget =
    current.name === 'home' &&
    current.query.login === '1' &&
    (!options?.verify || current.query.verify === '1')

  if (!sameTarget) {
    router.push({ name: 'home', query }).catch(() => undefined)
  }
}

async function parseResponseDetail(res: Response): Promise<string> {
  try {
    const data = await res.json()
    const detail = data?.detail ?? data?.message ?? ''
    return typeof detail === 'string' ? detail : JSON.stringify(detail)
  } catch {
    return ''
  }
}

export async function handleEmailVerificationBlocked(res: Response): Promise<boolean> {
  if (res.status !== 403) return false
  const detail = await parseResponseDetail(res.clone())
  if (!isEmailVerificationDetail(detail)) return false
  redirectToLogin({ verify: true })
  return true
}

const refreshAccessToken = async (): Promise<boolean> => {
  if (refreshTokenPromise) return refreshTokenPromise

  refreshTokenPromise = (async () => {
    const authStore = useAuthStore()
    const res = await fetch(`${API_BASE}/refresh`, {
      method: 'POST',
      credentials: 'include',
    })

    if (res.status === 403 && (await handleEmailVerificationBlocked(res))) return false

    if (res.status === 401 || !res.ok) return false

    const data = (await res.json()) as AuthResponse
    if (!data.access_token) return false

    authStore.setToken(data.access_token)
    authStore.setMustChangePassword(data.must_change_password)
    return true
  })().finally(() => {
    refreshTokenPromise = null
  })

  return refreshTokenPromise
}

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const authStore = useAuthStore()
  const headers = new Headers(options.headers)

  if (authStore.getToken) {
    headers.set('Authorization', `Bearer ${authStore.getToken}`)
  }

  const requestOptions: RequestInit = {
    ...options,
    headers,
    credentials: options.credentials ?? 'include',
  }

  const res = await fetch(`${API_BASE}${endpoint}`, requestOptions)
  if (res.status === 403 && (await handleEmailVerificationBlocked(res))) {
    throw new Error('Email not verified')
  }
  if (res.status !== 401) return res

  const refreshed = await refreshAccessToken()
  if (!refreshed) {
    redirectToLogin()
    throw new Error('Authentification failed')
  }

  const retryHeaders = new Headers(options.headers)
  if (authStore.getToken) {
    retryHeaders.set('Authorization', `Bearer ${authStore.getToken}`)
  }

  const retryRes = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: retryHeaders,
    credentials: options.credentials ?? 'include',
  })

  if (retryRes.status === 401) {
    redirectToLogin()
    throw new Error('Authentification failed')
  }

  return retryRes
}

// Helper function to convert object to URL-encoded string
// @deprecated - Use JSON format for v3.0.0 API
const toUrlEncoded = (o: any): string => {
  return Object.keys(o)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(o[key])}`)
    .join('&')
}

// @deprecated - Use req_json for v3.0.0 API
export async function req_urlencoded(
  endpoint: string,
  method: string = 'POST',
  data?: any
): Promise<Response | undefined> {
  try {
    const headers = new Headers()
    headers.append('Content-Type', 'application/x-www-form-urlencoded')

    const body = data ? toUrlEncoded(data) : undefined

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body,
    })
    console.log('req_urlencoded', res.status)

    if (res.status >= 500 && res.status < 600) {
      ElMessage.error('Ошибка сервера 500')
      throw new Error('Server error')
    }
    if (!res.ok) {
      throw new Error('http error')
    }
    return res
  } catch (error) {
    if (error instanceof Error && error.name === 'TypeError' && error.message.includes('fetch')) {
      ElMessage.error(`Ошибка сервера`)
    }
  }
}

// @deprecated - Use req_json_auth for v3.0.0 API
export async function req_urlencoded_auth(
  endpoint: string,
  method: string = 'POST',
  data?: any
): Promise<Response | undefined> {
  try {
    const authStore = useAuthStore()
    const headers = new Headers()
    headers.append('Content-Type', 'application/x-www-form-urlencoded')

    if (authStore.getToken) {
      headers.append('Authorization', `Bearer ${authStore.getToken}`)
    }

    const body = data ? toUrlEncoded(data) : undefined

    const res = await fetchWithAuth(endpoint, {
      method,
      headers,
      body,
    })
    console.log('req_urlencoded_auth', { res })
    if (res.status >= 500 && res.status < 600) {
      console.log('req_urlencoded', res.status)
      ElMessage.error('Ошибка сервера 500')
      throw new Error('Server error')
    }
    if (!res.ok) {
      throw new Error('http error')
    }
    return res
  } catch (error) {
    if (error instanceof Error && error.name === 'TypeError' && error.message.includes('fetch')) {
      ElMessage.error(`Ошибка сервера`)
    }
  }
}

export async function req_json_auth(
  endpoint: string,
  method: string = 'POST',
  data?: any,
  allowErrorStatuses: number[] = []
): Promise<Response | undefined> {
  try {
    const authStore = useAuthStore()
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    if (authStore.getToken) {
      headers.append('Authorization', `Bearer ${authStore.getToken}`)
    }

    const body = data ? JSON.stringify(data) : undefined

    const res = await fetchWithAuth(endpoint, {
      method,
      headers,
      body,
    })
    console.log('req_json_auth', { res })
    if (res.status >= 500 && res.status < 600) {
      console.log('req_urlencoded', res.status)
      ElMessage.error('Ошибка сервера 500')
      throw new Error('Server error')
    }
    if (allowErrorStatuses.includes(res.status)) {
      return res
    }
    if (!res.ok) {
      throw new Error('http error')
    }
    return res
  } catch (error) {
    if (error instanceof Error && error.name === 'TypeError' && error.message.includes('fetch')) {
      ElMessage.error(`Ошибка сервера`)
    }
  }
}

export async function req_json(
  endpoint: string,
  method: string = 'POST',
  data?: any,
  allowErrorStatuses: number[] = []
): Promise<Response | undefined> {
  try {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const body = data ? JSON.stringify(data) : undefined

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body,
    })
    console.log('req_json', { res })
    if (res.status >= 500 && res.status < 600) {
      console.log('req_urlencoded', res.status)
      ElMessage.error('Ошибка сервера 500')
      throw new Error('Server error')
    }
    if (allowErrorStatuses.includes(res.status)) {
      return res
    }
    if (!res.ok) {
      throw new Error('http error')
    }
    return res
  } catch (error) {
    if (error instanceof Error && error.name === 'TypeError' && error.message.includes('fetch')) {
      ElMessage.error(`Ошибка сервера`)
    }
  }
}

// File upload with base64
export async function uploadFile3D(
  fileName: string,
  fileData: string,
  fileType: string
): Promise<Response | undefined> {
  return await req_json_auth('/files', 'POST', {
    file_name: fileName,
    file_data: fileData,
    file_type: fileType
  });
}

// Document upload with base64
export async function uploadDocument(
  documentName: string,
  documentData: string,
  category?: string
): Promise<Response | undefined> {
  return await req_json_auth('/documents', 'POST', {
    document_name: documentName,
    document_data: documentData,
    document_category: category
  });
}

// File to base64 converter
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}