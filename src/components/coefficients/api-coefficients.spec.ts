import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearCoefficientsCache, getCoefficients } from './api-coefficients'
import { mockCoefficients } from '@/test/fixtures'
import { fetchCalls, mockJson, mockNetworkError, mockStatus } from '@/test/fetch-mock'

beforeEach(() => {
  clearCoefficientsCache()
})

describe('api-coefficients', () => {
  it('fetches, transforms and caches coefficients', async () => {
    mockJson('/api/v3/coefficients', mockCoefficients)
    const first = await getCoefficients()
    expect(first.finish).toEqual([
      { value: '1', label: 'Ra 0.8' },
      { value: '2', label: 'Ra 1.6' },
      { value: '3', label: 'Ra 6.3' },
    ])
    expect(first.cover[0]).toEqual({ value: '1', label: 'Без покрытия' })
    expect(first.tolerance[1]).toEqual({ value: '4', label: 'h12' })

    const second = await getCoefficients()
    expect(second).toBe(first)
    expect(fetchCalls('/api/v3/coefficients')).toHaveLength(1)
  })

  it('deduplicates in-flight requests', async () => {
    mockJson('/api/v3/coefficients', mockCoefficients)
    const [a, b] = await Promise.all([getCoefficients(), getCoefficients()])
    expect(a).toBe(b)
    expect(fetchCalls('/api/v3/coefficients')).toHaveLength(1)
  })

  it('clears cache so the next call refetches', async () => {
    mockJson('/api/v3/coefficients', mockCoefficients)
    await getCoefficients()
    clearCoefficientsCache()
    mockJson('/api/v3/coefficients', mockCoefficients)
    await getCoefficients()
    expect(fetchCalls('/api/v3/coefficients')).toHaveLength(2)
  })

  it('rethrows after a failed load and allows retry', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockStatus('/api/v3/coefficients', 500)
    await expect(getCoefficients()).rejects.toThrow()
    spy.mockRestore()

    mockJson('/api/v3/coefficients', mockCoefficients)
    const data = await getCoefficients()
    expect(data.finish).toHaveLength(3)
  })

  it('allows retry after a network error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockNetworkError('/api/v3/coefficients')
    await expect(getCoefficients()).rejects.toThrow()
    spy.mockRestore()

    mockJson('/api/v3/coefficients', mockCoefficients)
    await expect(getCoefficients()).resolves.toMatchObject({ finish: expect.any(Array) })
  })
})
