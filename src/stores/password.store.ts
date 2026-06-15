import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { API_BASE, req_json } from '../api'
import {
  normalizeEmail,
  RESEND_COOLDOWN_MS,
  UI_MESSAGES,
} from '../helpers/password-recovery'

type SendRecoveryResponse = {
  message: string
}

type ResetPasswordResponse = {
  message: string
}

async function parseErrorDetail(res: Response): Promise<string> {
  try {
    const errorData = await res.json()
    if (errorData?.detail && typeof errorData.detail === 'string') {
      return errorData.detail
    }
    if (Array.isArray(errorData?.detail)) {
      const first = errorData.detail[0]
      if (first?.msg && typeof first.msg === 'string') return first.msg
    }
    if (errorData?.message && typeof errorData.message === 'string') {
      return errorData.message
    }
  } catch {
    // keep fallback
  }
  return ''
}

export const usePasswordStore = defineStore('password', () => {
  const lastSentAt = ref<number | null>(null)

  function canResend(): boolean {
    if (!lastSentAt.value) return true
    return Date.now() - lastSentAt.value >= RESEND_COOLDOWN_MS
  }

  function resendCooldownRemainingMs(): number {
    if (!lastSentAt.value) return 0
    const remaining = RESEND_COOLDOWN_MS - (Date.now() - lastSentAt.value)
    return Math.max(0, remaining)
  }

  async function sendRecovery(email: string): Promise<SendRecoveryResponse> {
    if (!canResend()) {
      throw new Error(UI_MESSAGES.resendCooldown)
    }

    const normalized = normalizeEmail(email)
    const res = await req_json('/password/send-recovery', 'POST', {
      personal_email: normalized,
    }, [429, 503])

    if (!res) {
      throw new Error('Не удалось отправить письмо')
    }

    if (res.status === 429) {
      const detail = await parseErrorDetail(res)
      throw new Error(detail || UI_MESSAGES.rateLimit)
    }

    if (res.status === 503) {
      const detail = await parseErrorDetail(res)
      throw new Error(detail || UI_MESSAGES.recoveryFeatureDisabled)
    }

    const data = (await res.json()) as SendRecoveryResponse
    lastSentAt.value = Date.now()
    return {
      message: data.message || UI_MESSAGES.recoverySendSuccess,
    }
  }

  async function resetPassword(token: string, password: string): Promise<ResetPasswordResponse> {
    const res = await fetch(`${API_BASE}/password/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    if (res.status === 400) {
      const detail = (await parseErrorDetail(res)) || UI_MESSAGES.recoveryInvalidLink
      throw new Error(detail)
    }

    if (res.status === 422) {
      const detail = await parseErrorDetail(res)
      throw new Error(detail || 'Пароль должен содержать минимум 6 символов')
    }

    if (res.status === 429) {
      const detail = (await parseErrorDetail(res)) || UI_MESSAGES.rateLimit
      throw new Error(detail)
    }

    if (res.status === 503) {
      const detail = (await parseErrorDetail(res)) || UI_MESSAGES.recoveryFeatureDisabled
      throw new Error(detail)
    }

    if (res.status >= 500) {
      ElMessage.error('Ошибка сервера')
      throw new Error('Server error')
    }

    if (!res.ok) {
      throw new Error('Не удалось изменить пароль')
    }

    const data = (await res.json()) as ResetPasswordResponse
    return {
      message: data.message || UI_MESSAGES.recoveryResetSuccess,
    }
  }

  return {
    lastSentAt,
    canResend,
    resendCooldownRemainingMs,
    sendRecovery,
    resetPassword,
  }
})
