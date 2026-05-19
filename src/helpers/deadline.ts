const MS_IN_DAY = 24 * 60 * 60 * 1000

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const addDays = (date: Date, days: number) =>
  new Date(startOfDay(date).getTime() + days * MS_IN_DAY)

export interface ManufacturingDeadlineSource {
  manufacturing_deadline?: string
  deadline?: string
  manufacturing_cycle?: number
}

export const formatManufacturingDeadline = (date: Date | null | undefined): string | undefined =>
  date ? date.toISOString() : undefined

export const parseManufacturingDeadline = (data: ManufacturingDeadlineSource): Date | null => {
  if (data.manufacturing_deadline) return new Date(data.manufacturing_deadline)
  if (data.deadline) return new Date(data.deadline)
  if (data.manufacturing_cycle) return addDays(new Date(), data.manufacturing_cycle)
  return null
}
