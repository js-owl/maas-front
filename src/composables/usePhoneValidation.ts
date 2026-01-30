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
 * Returns an Element Plus rule validator for phone number (digits only, 10–15 length).
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
    if (!/^\d+$/.test(value)) {
      callback(new Error('Телефон должен содержать только цифры'))
      return
    }
    const length = value.length
    if (length < 10 || length > 15) {
      callback(new Error('Введите корректный номер телефона (10–15 цифр)'))
      return
    }
    callback()
  }
}

/**
 * Returns string with only digits. Use in @input to restrict phone input.
 */
export const normalizePhoneInput = (value: string): string =>
  (value || '').replace(/\D/g, '')

/**
 * Formats digits as Russian phone display: +7 (XXX) XXX-XX-XX.
 * Use as el-input formatter for phone fields.
 */
export const formatPhoneDisplay = (value: string): string => {
  if (!value) return value
  const numbers = (value || '').replace(/\D/g, '')
  let cleanNumber = numbers
  if (numbers.startsWith('8') && numbers.length === 11) {
    cleanNumber = '7' + numbers.slice(1)
  } else if (numbers.startsWith('9') && numbers.length === 10) {
    cleanNumber = '7' + numbers
  }
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
  if (!value) return value
  const numbers = (value || '').replace(/\D/g, '')
  return numbers.startsWith('8') ? '7' + numbers.slice(1) : numbers
}
