import { describe, expect, it } from 'vitest'
import {
  getFileExtension,
  getGuestAcceptAttribute,
  getGuestModelOnlyMessage,
  getGuestSingleModelMessage,
  getIncompatibleModelMessage,
  getModelExtensionsForService,
  getModelFormatsLabel,
  isAllowedModelFile,
  isPrintingService,
  resolveCadViewerType,
} from './model-file-types'

describe('getFileExtension', () => {
  it('returns the lowercased extension', () => {
    expect(getFileExtension('part.STP')).toBe('stp')
    expect(getFileExtension('noext')).toBe('noext')
  })
})

describe('resolveCadViewerType', () => {
  it('detects stl and stp from extension or bare type', () => {
    expect(resolveCadViewerType('model.stl')).toBe('stl')
    expect(resolveCadViewerType('.STEP')).toBe('stp')
    expect(resolveCadViewerType(null, 'stp')).toBe('stp')
    expect(resolveCadViewerType(undefined, '', 'obj')).toBeNull()
  })
})

describe('printing vs machining rules', () => {
  it('switches extensions and guest messages by service', () => {
    expect(isPrintingService('printing')).toBe(true)
    expect(isPrintingService('cnc-milling')).toBe(false)

    expect(getModelExtensionsForService('printing')).toEqual(['stl'])
    expect(getModelExtensionsForService('cnc-milling')).toEqual(['stp', 'step'])

    expect(isAllowedModelFile('a.stl', 'printing')).toBe(true)
    expect(isAllowedModelFile('a.stp', 'printing')).toBe(false)
    expect(isAllowedModelFile('a.stp', 'cnc-milling')).toBe(true)
    expect(isAllowedModelFile('.', 'cnc-milling')).toBe(false)

    expect(getGuestAcceptAttribute('printing')).toBe('.stl')
    expect(getGuestAcceptAttribute('other')).toBe('.stp')

    expect(getGuestModelOnlyMessage('printing')).toContain('STL')
    expect(getGuestModelOnlyMessage('other')).toContain('STP')
    expect(getGuestSingleModelMessage('printing')).toContain('один STL')
    expect(getGuestSingleModelMessage('other')).toContain('один STP')
    expect(getIncompatibleModelMessage('printing')).toContain('STL')
    expect(getIncompatibleModelMessage('other')).toContain('STP')
  })

  it('keeps a shared formats label for every service', () => {
    expect(getModelFormatsLabel('printing')).toContain('STEP')
    expect(getModelFormatsLabel()).toBe(getModelFormatsLabel('printing'))
  })
})
