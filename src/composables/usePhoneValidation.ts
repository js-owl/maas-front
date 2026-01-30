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
