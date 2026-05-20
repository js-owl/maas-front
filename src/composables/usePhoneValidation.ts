/**
 * Composable for phone number validation and input normalization.
 * Use with Element Plus form rules and @input handlers.
 */

export const RU_PHONE_PREFIX = '7'
export const RU_PHONE_LENGTH = 11

type RuleValidator = (
  rule: unknown,
  value: string,
  callback: (error?: Error) => void
) => void

type CreatePhoneNumberValidatorOptions = {
  allowEmpty?: boolean
}

export const isRuPhoneOnlyPrefix = (value?: string): boolean => {
  const digits = (value || '').replace(/\D/g, '')
  return !digits || digits === RU_PHONE_PREFIX
}

/**
 * Normalizes phone input to Russian digits-only format:
 * - always starts with `7` when non-empty
 * - max length 11 (7 + 10 digits)
 * - converts pasted `8...` / `9...` to `7...`
 */
export const normalizeRuPhoneDigits = (value: string): string => {
  const digits = (value || '').replace(/\D/g, '')
  if (!digits) return ''

  if (digits.length === 11 && digits.startsWith('8')) return `7${digits.slice(1)}`
  if (digits.length === 10 && digits.startsWith('9')) return `7${digits}`.slice(0, RU_PHONE_LENGTH)

  if (!digits.startsWith('7')) {
    if (digits.startsWith('8')) {
      return `7${digits.slice(1)}`.slice(0, RU_PHONE_LENGTH)
    }
    return `7${digits}`.slice(0, RU_PHONE_LENGTH)
  }

  return digits.slice(0, RU_PHONE_LENGTH)
}

/** Model value for phone inputs: existing number or fixed country prefix. */
export const ensureRuPhoneModelValue = (value?: string): string => {
  return normalizeRuPhoneDigits(value || '') || RU_PHONE_PREFIX
}

/**
 * Returns an Element Plus rule validator for Russian phone number.
 * @param options.allowEmpty - if true, empty value passes validation (for optional fields)
 */
export const createPhoneNumberValidator = (
  options?: CreatePhoneNumberValidatorOptions
): RuleValidator => {
  const allowEmpty = options?.allowEmpty ?? false

  return (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (allowEmpty && isRuPhoneOnlyPrefix(value)) {
      callback()
      return
    }
    const digits = normalizeRuPhoneDigits(value)
    if (!digits || isRuPhoneOnlyPrefix(digits)) {
      callback(new Error('Введите телефон'))
      return
    }
    if (!/^\d+$/.test(digits)) {
      callback(new Error('Телефон должен содержать только цифры'))
      return
    }
    if (!/^7\d{10}$/.test(digits)) {
      callback(new Error('Введите телефон в формате 7XXXXXXXXXX (10 цифр после 7)'))
      return
    }
    callback()
  }
}

/**
 * Returns string with only digits. Use in @input to restrict phone input.
 * Does not force country prefix — use parsePhoneToDigits with formatter for that.
 */
export const normalizePhoneInput = (value: string): string => normalizeRuPhoneDigits(value)

/**
 * Formats digits as Russian phone display: +7 (XXX) XXX-XX-XX.
 * Use as el-input formatter for phone fields.
 */
export const formatPhoneDisplay = (value: string): string => {
  const cleanNumber = normalizeRuPhoneDigits(value) || RU_PHONE_PREFIX
  if (cleanNumber.length <= 1) return '+7'
  if (cleanNumber.length <= 4) return `+7 (${cleanNumber.slice(1)}`
  if (cleanNumber.length <= 7) return `+7 (${cleanNumber.slice(1, 4)}) ${cleanNumber.slice(4)}`
  if (cleanNumber.length <= 9) {
    return `+7 (${cleanNumber.slice(1, 4)}) ${cleanNumber.slice(4, 7)}-${cleanNumber.slice(7)}`
  }
  return `+7 (${cleanNumber.slice(1, 4)}) ${cleanNumber.slice(4, 7)}-${cleanNumber.slice(7, 9)}-${cleanNumber.slice(9, 11)}`
}

/**
 * Parses display value to digits; keeps fixed country prefix `7` (user does not type it).
 * Use as el-input parser for phone fields.
 */
export const parsePhoneToDigits = (value: string): string => {
  const digits = normalizeRuPhoneDigits(value)
  if (!digits) return RU_PHONE_PREFIX
  if (!digits.startsWith(RU_PHONE_PREFIX)) {
    return `${RU_PHONE_PREFIX}${digits}`.slice(0, RU_PHONE_LENGTH)
  }
  return digits
}
