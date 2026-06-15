// UI-сообщения и переиспользуемые утилиты для flow восстановления пароля.
export {
  normalizeEmail,
  parseTokenFromRoute,
  RESEND_COOLDOWN_MS,
} from './email-verification'

import { UI_MESSAGES as EMAIL_UI_MESSAGES } from './email-verification'

export const PASSWORD_JUST_RESET_KEY = 'password-just-reset'

export const UI_MESSAGES = {
  recoverySendSuccess:
    'Если email зарегистрирован, на него отправлено письмо со ссылкой для восстановления пароля.',
  recoveryInvalidLink: 'Ссылка недействительна или устарела.',
  recoveryMissingToken: 'В ссылке отсутствует код восстановления.',
  recoveryResetSuccess: 'Пароль изменён. Войдите с новым паролем.',
  recoveryFeatureDisabled: 'Восстановление пароля временно недоступно.',
  resendCooldown: EMAIL_UI_MESSAGES.resendCooldown,
  rateLimit: EMAIL_UI_MESSAGES.rateLimit,
} as const
