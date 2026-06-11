import type { LocationQuery } from 'vue-router'

export const EMAIL_NOT_VERIFIED_ERROR = 'EMAIL_NOT_VERIFIED'

export const EMAIL_VERIFICATION_DETAIL =
  'Email address not verified. Please confirm your email before accessing your account.'

export const EMAIL_JUST_CONFIRMED_KEY = 'email-just-confirmed'

export const RESEND_COOLDOWN_MS = 60_000

export const UI_MESSAGES = {
  confirmLoading: 'Подтверждаем email…',
  confirmSuccess: 'Email подтверждён. Теперь вы можете войти в аккаунт.',
  confirmInvalidLink: 'Ссылка недействительна или устарела.',
  confirmMissingToken: 'В ссылке отсутствует код подтверждения.',
  registrationCheckEmail: (email: string) =>
    `На ${email} отправлено письмо. Перейдите по ссылке для подтверждения, затем войдите в аккаунт.`,
  loginEmailNotVerified:
    'Подтвердите email перед входом. Проверьте почту или отправьте письмо повторно.',
  profileEmailNotVerified:
    'Email не подтверждён. Подтвердите адрес по ссылке из письма или отправьте письмо повторно.',
  resendCooldown: 'Повторная отправка будет доступна через минуту.',
  rateLimit: 'Слишком много запросов. Попробуйте позже.',
  featureDisabled: 'Подтверждение email временно недоступно.',
} as const

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function parseTokenFromRoute(query: LocationQuery): string | null {
  const raw = query.token
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  if (Array.isArray(raw) && typeof raw[0] === 'string' && raw[0].trim()) return raw[0].trim()
  return null
}

export function isEmailVerificationDetail(detail: unknown): boolean {
  const detailStr = typeof detail === 'string' ? detail : JSON.stringify(detail ?? '')
  return /email.*not verified|confirm your email|подтвердите.*email/i.test(detailStr)
}

export function isEmailNotVerifiedError(error: unknown): boolean {
  return error instanceof Error && error.message === EMAIL_NOT_VERIFIED_ERROR
}
