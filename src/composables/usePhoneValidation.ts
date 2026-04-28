/**
 * Composable for phone number validation and input normalization.
 * Use with Element Plus form rules and @input handlers.
 */

type RuleValidator = (
  rule: unknown,
  value: string,
  callback: (error?: Error) => void
) => void

type CreatePhoneNumberValidatorOptions = {
  allowEmpty?: boolean
}

/**
 * Normalizes phone input to Russian digits-only format:
 * - always starts with `7`
 * - max length 11 (7 + 10 digits)
 * - converts leading `8` -> `7`
 * - if user enters 10-digit mobile starting with `9`, prefixes `7`
 */
export const normalizeRuPhoneDigits = (value: string): string => {
  const digits = (value || '').replace(/\D/g, '')
  if (!digits) return ''

  // Handle common Russian input forms first.
  if (digits.length === 11 && digits.startsWith('8')) return `7${digits.slice(1)}`
  if (digits.length === 10 && digits.startsWith('9')) return `7${digits}`.slice(0, 11)

  // Ensure first digit is 7 without growing the number unexpectedly.
  if (!digits.startsWith('7')) {
    const normalized = `7${digits.slice(1)}`
    return normalized.slice(0, 11)
  }

  return digits.slice(0, 11)
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
    if (allowEmpty && !value) {
      callback()
      return
    }
    const digits = normalizeRuPhoneDigits(value)
    if (!digits) {
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
 */
export const normalizePhoneInput = (value: string): string => normalizeRuPhoneDigits(value)

/**
 * Formats digits as Russian phone display: +7 (XXX) XXX-XX-XX.
 * Use as el-input formatter for phone fields.
 */
export const formatPhoneDisplay = (value: string): string => {
  if (!value) return value
  const cleanNumber = normalizeRuPhoneDigits(value)
  if (cleanNumber.length <= 1) return cleanNumber
  if (cleanNumber.length <= 4) return `+7 (${cleanNumber.slice(1)}`
  if (cleanNumber.length <= 7) return `+7 (${cleanNumber.slice(1, 4)}) ${cleanNumber.slice(4)}`
  if (cleanNumber.length <= 9) {
    return `+7 (${cleanNumber.slice(1, 4)}) ${cleanNumber.slice(4, 7)}-${cleanNumber.slice(7)}`
  }
  return `+7 (${cleanNumber.slice(1, 4)}) ${cleanNumber.slice(4, 7)}-${cleanNumber.slice(7, 9)}-${cleanNumber.slice(9, 11)}`
}

/**
 * Parses display value to digits only; normalizes 8 to 7 for Russian numbers.
 * Use as el-input parser for phone fields.
 */
export const parsePhoneToDigits = (value: string): string => {
  return normalizeRuPhoneDigits(value)
}
