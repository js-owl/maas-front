import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { API_BASE, req_json } from '../api'
import {
  normalizeEmail,
  RESEND_COOLDOWN_MS,
  UI_MESSAGES,
} from '../helpers/email-verification'

type SendConfirmationResponse = {
  message: string
}

type ConfirmEmailResponse = {
  message: string
  email_verified: boolean
}

export const useEmailStore = defineStore('email', () => {
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

  async function sendConfirmation(email: string): Promise<SendConfirmationResponse> {
    if (!canResend()) {
      throw new Error(UI_MESSAGES.resendCooldown)
    }

    const normalized = normalizeEmail(email)
    const res = await req_json('/email/send-confirmation', 'POST', { email: normalized })

    if (!res) {
      throw new Error('Не удалось отправить письмо')
    }

    const data = (await res.json()) as SendConfirmationResponse
    lastSentAt.value = Date.now()
    return {
      message:
        data.message ||
        'If the email is registered, a confirmation message has been sent.',
    }
  }

  async function confirmEmail(token: string): Promise<ConfirmEmailResponse> {
    const res = await fetch(`${API_BASE}/email/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    if (res.status === 400) {
      let detail = UI_MESSAGES.confirmInvalidLink
      try {
        const errorData = await res.json()
        if (errorData?.detail && typeof errorData.detail === 'string') {
          detail = errorData.detail
        }
      } catch {
        // keep fallback
      }
      throw new Error(detail)
    }

    if (res.status >= 500) {
      ElMessage.error('Ошибка сервера')
      throw new Error('Server error')
    }

    if (!res.ok) {
      throw new Error('Не удалось подтвердить email')
    }

    const data = (await res.json()) as ConfirmEmailResponse
    return {
      message: data.message || 'Email confirmed.',
      email_verified: data.email_verified ?? true,
    }
  }

  return {
    lastSentAt,
    canResend,
    resendCooldownRemainingMs,
    sendConfirmation,
    confirmEmail,
  }
})
