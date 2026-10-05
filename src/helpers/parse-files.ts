export const parseFilesQueryToIds = (value: unknown): number[] => {
  if (!value) return []

  if (typeof value === 'string') {
    const trimmed = value.trim()

    // JSON-массив вида "[1,2]" или "[\"1\",\"2\"]"
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        // A string wrapped in [ ] that parses as JSON is always an array.
        const parsed = JSON.parse(trimmed) as unknown[]
        return parsed
          .map((v) => Number(v))
          .filter((id) => !Number.isNaN(id))
      } catch {
        // игнорируем ошибку и пойдём дальше
      }
    }
  }

  const parts: string[] = Array.isArray(value)
    ? value.flatMap((v) => String(v).split(','))
    : String(value).split(',')

  return parts
    .map((v) => Number(v.trim()))
    .filter((id) => !Number.isNaN(id))
}

