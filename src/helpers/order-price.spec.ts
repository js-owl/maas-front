import { describe, it, expect } from 'vitest'
import { orderLinePrice, pickNonZeroCalculation, unwrapApiData } from './order-price'

describe('unwrapApiData', () => {
  it('unwraps nested data objects', () => {
    expect(unwrapApiData({ data: { order_id: 1 } })).toEqual({ order_id: 1 })
    expect(unwrapApiData({ order_id: 1 })).toEqual({ order_id: 1 })
  })

  it('does not unwrap an order that already has a data field', () => {
    const order = { order_id: 7, total_price: 4400, data: { nested: true } }
    expect(unwrapApiData(order)).toEqual(order)
  })
})

describe('orderLinePrice', () => {
  it('prefers total_price when it is positive', () => {
    expect(orderLinePrice({ total_price: 1200, detail_price: 1 })).toBe(1200)
  })

  it('falls back when total_price is zero', () => {
    expect(orderLinePrice({ total_price: 0, detail_price: 800, quantity: 2 })).toBe(800)
    expect(orderLinePrice({ total_price: 0, detail_price_one: 150, quantity: 3 })).toBe(450)
    expect(orderLinePrice({ total_price: 0, total_price_breakdown: { cost: 990 } })).toBe(990)
    expect(
      orderLinePrice({
        total_price: 0,
        total_price_breakdown: JSON.stringify({ 'total_price (include quantity)': 2100 }),
      }),
    ).toBe(2100)
  })
})

describe('pickNonZeroCalculation', () => {
  it('keeps the live price when recalculation returns zero', () => {
    expect(pickNonZeroCalculation({ total_price: 0 }, { total_price: 4400 })?.total_price).toBe(4400)
    expect(pickNonZeroCalculation({ total_price: 120 }, { total_price: 4400 })?.total_price).toBe(120)
  })
})
