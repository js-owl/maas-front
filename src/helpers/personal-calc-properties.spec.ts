import { describe, it, expect } from 'vitest'
import {
  getPersonalCalcPropertyFields,
  isElectroplatingServiceId,
  resolveMaterialProcessForService,
} from './personal-calc-properties'

describe('isElectroplatingServiceId', () => {
  it('recognizes both electroplating service ids', () => {
    expect(isElectroplatingServiceId('electroplating')).toBe(true)
    expect(isElectroplatingServiceId('electroplating_auto')).toBe(true)
    expect(isElectroplatingServiceId('cnc-milling')).toBe(false)
    expect(isElectroplatingServiceId(undefined)).toBe(false)
  })
})

describe('getPersonalCalcPropertyFields', () => {
  it('uses coating fields for electroplating_auto', () => {
    const keys = getPersonalCalcPropertyFields('electroplating_auto').map((field) => field.key)
    expect(keys).toContain('coatingType')
    expect(keys).toEqual(getPersonalCalcPropertyFields('electroplating').map((field) => field.key))
  })
})

describe('resolveMaterialProcessForService', () => {
  it('does not load machining materials for electroplating_auto', () => {
    expect(resolveMaterialProcessForService('electroplating_auto')).toBeUndefined()
    expect(resolveMaterialProcessForService('electroplating')).toBeUndefined()
  })
})
