export const parseFilesQueryToIds = (value: unknown): number[] => {
  if (!value) return []

  if (typeof value === 'string') {
    const trimmed = value.trim()

    // JSON-массив вида "[1,2]" или "[\"1\",\"2\"]"
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed
            .map((v) => Number(v))
            .filter((id) => !Number.isNaN(id))
        }
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

