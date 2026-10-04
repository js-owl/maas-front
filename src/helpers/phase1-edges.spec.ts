import { describe, expect, it } from 'vitest'
import { clearCalcPageCache, forgetCalcPage, isCalcRouteName, rememberCalcPage } from './calc-page-cache'
import { orderLinePrice, pickNonZeroCalculation, unwrapApiData } from './order-price'

describe('calc-page-cache edge cases', () => {
  it('ignores unknown route names and duplicate remembers', () => {
    clearCalcPageCache()
    rememberCalcPage(123)
    rememberCalcPage('unknown')
    rememberCalcPage('milling')
    rememberCalcPage('milling')
    forgetCalcPage('unknown')
    forgetCalcPage(null)
    expect(isCalcRouteName('composite')).toBe(true)
    expect(isCalcRouteName(undefined)).toBe(false)
  })
})

describe('order-price remaining branches', () => {
  it('unwraps only nested envelopes that are not already entities', () => {
    expect(unwrapApiData({ data: { nested: true } })).toEqual({ nested: true })
    expect(unwrapApiData({ kit_id: 1, data: { nested: true } })).toEqual({
      kit_id: 1,
      data: { nested: true },
    })
    expect(unwrapApiData({ total_kit_price: 10, data: { x: 1 } })).toEqual({
      total_kit_price: 10,
      data: { x: 1 },
    })
  })

  it('handles invalid breakdown JSON and zero fallbacks', () => {
    expect(orderLinePrice({ total_price: 0, total_price_breakdown: '{bad' })).toBe(0)
    expect(orderLinePrice({ total_price: 0, detail_price_one: 50, quantity: 'x' })).toBe(50)
    expect(orderLinePrice({ total_price: 'NaN' })).toBe(0)
    expect(pickNonZeroCalculation({ total_price: 0 }, { total_price: 0 })).toEqual({ total_price: 0 })
    expect(pickNonZeroCalculation(null, null)).toBeNull()
    expect(pickNonZeroCalculation(undefined, { total_price: 10 })?.total_price).toBe(10)
  })
})
