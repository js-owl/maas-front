import { describe, expect, it } from 'vitest'
import type { IOrderResponse } from '../interfaces/order.interface'
import { buildEmptyCalcResult, resolveCalcQueryFiles } from './calc-page'

describe('resolveCalcQueryFiles', () => {
  it('falls back to the default file when no files are passed', () => {
    expect(resolveCalcQueryFiles({}, 2)).toEqual({ documentIds: [], fileId: 2 })
  })

  it('has no file at all when there is neither a query nor a default', () => {
    expect(resolveCalcQueryFiles({})).toEqual({ documentIds: [], fileId: undefined })
  })

  it('ignores ?stp= when ?files= is missing', () => {
    expect(resolveCalcQueryFiles({ stp: '9' }, 2)).toEqual({ documentIds: [], fileId: 2 })
  })

  it('reads document ids and the stp id together', () => {
    expect(resolveCalcQueryFiles({ files: '4,5', stp: '7' }, 2)).toEqual({
      documentIds: [4, 5],
      fileId: 7,
    })
  })

  it('takes the first value of a repeated ?stp=', () => {
    expect(resolveCalcQueryFiles({ files: '1', stp: ['8', '9'] }, 2).fileId).toBe(8)
  })

  it('leaves the file untouched when ?files= has no ?stp=', () => {
    expect(resolveCalcQueryFiles({ files: '[1,2]' }, 2)).toEqual({
      documentIds: [1, 2],
      fileId: undefined,
    })
  })

  it('leaves the file untouched when ?stp= is not a number', () => {
    expect(resolveCalcQueryFiles({ files: '1', stp: 'abc' }, 2).fileId).toBeUndefined()
  })
})

describe('buildEmptyCalcResult', () => {
  it('zeroes the prices and keeps the rest of the previous result', () => {
    const previous = { order_id: 5, total_price: 900, detail_price: 100 } as IOrderResponse
    expect(buildEmptyCalcResult(previous, 3)).toMatchObject({
      order_id: 5,
      total_price: 0,
      detail_price: 0,
      detail_price_one: 0,
      quantity: 3,
    })
  })

  it('works without a previous result', () => {
    expect(buildEmptyCalcResult(null, 1)).toEqual({
      total_price: 0,
      detail_price: 0,
      detail_price_one: 0,
      quantity: 1,
    })
  })
})
