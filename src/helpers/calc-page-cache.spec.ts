import { describe, expect, it, beforeEach } from 'vitest'
import {
  cachedCalcPages,
  clearCalcPageCache,
  forgetCalcPage,
  isCalcRouteName,
  rememberCalcPage,
} from './calc-page-cache'

describe('calc-page-cache', () => {
  beforeEach(() => {
    clearCalcPageCache()
  })

  it('remembers calculator pages opened before the breakdown', () => {
    rememberCalcPage('milling')
    rememberCalcPage('personal-calc')

    expect(cachedCalcPages.value).toEqual(['CalculateMillingPage2', 'PersonalCalc'])
  })

  it('forgets a page when leaving it outside the breakdown', () => {
    rememberCalcPage('galvanic')
    forgetCalcPage('galvanic')

    expect(cachedCalcPages.value).toEqual([])
    expect(isCalcRouteName('printing')).toBe(true)
    expect(isCalcRouteName('personal-orders')).toBe(false)
  })
})
