const MOSCOW_TIME_ZONE = 'Europe/Moscow'
const HAS_TIMEZONE = /[zZ]|[+-]\d{2}:?\d{2}$/

const parseDate = (value?: string | null): Date | null => {
  if (!value) return null
  const trimmed = value.trim()
  const normalized = HAS_TIMEZONE.test(trimmed)
    ? trimmed
    : `${trimmed.replace(' ', 'T')}Z`
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return null
  return date
}

const formatMoscow = (
  value: string | null | undefined,
  options: Intl.DateTimeFormatOptions
): string => {
  const date = parseDate(value)
  if (!date) return ''
  return new Intl.DateTimeFormat('ru-RU', {
    ...options,
    timeZone: MOSCOW_TIME_ZONE,
  }).format(date)
}

export const formatMoscowDateTime = (value?: string | null): string => {
  const datePart = formatMoscow(value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timePart = formatMoscow(value, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  if (!datePart || !timePart) return ''
  return `${datePart}   ${timePart}`
}

export const formatMoscowDate = (value?: string | null): string => {
  const date = parseDate(value)
  if (!date) return ''
  const parts = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: MOSCOW_TIME_ZONE,
  }).formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''
  return `${get('day')}.${get('month')}.${get('year')}`
}

export const formatMoscowTime = (value?: string | null): string =>
  formatMoscow(value, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
