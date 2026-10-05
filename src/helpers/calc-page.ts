import type { IOrderResponse } from '../interfaces/order.interface'
import { parseFilesQueryToIds } from './parse-files'

export type CalcQueryFiles = {
  /** Document ids from `?files=`; empty when the parameter is absent or has no valid ids. */
  documentIds: number[]
  /** Model file id to select, or undefined to leave the current value untouched. */
  fileId: number | undefined
}

/**
 * Reads `?files=` / `?stp=` of a calculator opened without an order.
 * `?stp=` only applies together with `?files=`; without `?files=` the page
 * falls back to `defaultFileId` (when the calculator has one).
 */
export function resolveCalcQueryFiles(
  query: Record<string, unknown>,
  defaultFileId?: number
): CalcQueryFiles {
  const filesQuery = query.files
  const documentIds = parseFilesQueryToIds(filesQuery)

  if (!filesQuery) return { documentIds, fileId: defaultFileId }

  const stpParam = query.stp
  if (!stpParam) return { documentIds, fileId: undefined }

  const stpId = Number(Array.isArray(stpParam) ? stpParam[0] : stpParam)
  return { documentIds, fileId: Number.isNaN(stpId) ? undefined : stpId }
}

/** Result shown while the calculator has no model to price: keeps data, zeroes prices. */
export function buildEmptyCalcResult(
  current: IOrderResponse | null,
  quantity: number
): IOrderResponse {
  return {
    ...current,
    total_price: 0,
    detail_price: 0,
    detail_price_one: 0,
    quantity,
  } as IOrderResponse
}
