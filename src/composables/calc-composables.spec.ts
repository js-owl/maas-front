import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useMinLoading } from './useMinLoading'
import { useQuantityInput } from './useQuantityInput'

describe('useMinLoading', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts in the loading state', () => {
    expect(useMinLoading().isLoading.value).toBe(true)
  })

  it('keeps the loader until the minimum duration has passed', async () => {
    const { isLoading, startLoading, stopLoading } = useMinLoading(1000)
    startLoading()
    vi.advanceTimersByTime(300)

    const stopped = stopLoading()
    await vi.advanceTimersByTimeAsync(699)
    expect(isLoading.value).toBe(true)

    await vi.advanceTimersByTimeAsync(1)
    await stopped
    expect(isLoading.value).toBe(false)
  })

  it('stops immediately when the work took longer than the minimum', async () => {
    const { isLoading, startLoading, stopLoading } = useMinLoading(1000)
    startLoading()
    vi.advanceTimersByTime(1500)

    await stopLoading()
    expect(isLoading.value).toBe(false)
  })

  it('can be restarted after it stopped', async () => {
    const { isLoading, startLoading, stopLoading } = useMinLoading(0)
    startLoading()
    await stopLoading()
    expect(isLoading.value).toBe(false)

    startLoading()
    expect(isLoading.value).toBe(true)
  })
})

describe('useQuantityInput', () => {
  it('exposes the quantity as a string', () => {
    expect(useQuantityInput(ref(4)).value).toBe('4')
  })

  it('writes a valid number back to the quantity', () => {
    const quantity = ref(1)
    const input = useQuantityInput(quantity)
    input.value = '12'
    expect(quantity.value).toBe(12)
  })

  it.each(['0', '-3', 'abc', ''])('falls back to 1 for %j', (raw) => {
    const quantity = ref(5)
    const input = useQuantityInput(quantity)
    input.value = raw
    expect(quantity.value).toBe(1)
  })
})
