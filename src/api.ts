import { ElMessage } from 'element-plus'
import { useAuthStore } from './stores/auth.store'
import router from './router'

// API Base URLs
// Auto-detect based on environment
export const API_BASE = import.meta.env.VITE_API_BASE || '/api/v3';

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

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body,
    })
    console.log('req_urlencoded_auth', { res })
    if (res.status === 401) {
      authStore.clearToken()
      router.push('/')
      throw new Error('Authentification failed')
    }
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
  data?: any
): Promise<Response | undefined> {
  try {
    const authStore = useAuthStore()
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    if (authStore.getToken) {
      headers.append('Authorization', `Bearer ${authStore.getToken}`)
    }

    const body = data ? JSON.stringify(data) : undefined

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body,
    })
    console.log('req_json_auth', { res })
    if (res.status === 401) {
      authStore.clearToken()
      router.push('/')
      throw new Error('Authentification failed')
    }
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

export async function req_json(
  endpoint: string,
  method: string = 'POST',
  data?: any
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