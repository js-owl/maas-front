import { describe, expect, it } from 'vitest'
import {
  VERSION_CONFIG,
  compareVersions,
  getFullVersionInfo,
  getVersionDisplay,
  isApiVersionCompatible,
} from '@/config/version'

describe('compareVersions', () => {
  it('orders semver-like strings', () => {
    expect(compareVersions('3.0.0', '3.0.0')).toBe(0)
    expect(compareVersions('3.1.0', '3.0.9')).toBe(1)
    expect(compareVersions('2.9.9', '3.0.0')).toBe(-1)
    expect(compareVersions('3.0', '3.0.0')).toBe(0)
    expect(compareVersions('3.0.1', '3')).toBe(1)
  })
})

describe('isApiVersionCompatible', () => {
  it('accepts versions at or above the minimum', () => {
    expect(isApiVersionCompatible(VERSION_CONFIG.MIN_API_VERSION)).toBe(true)
    expect(isApiVersionCompatible('9.0.0')).toBe(true)
    expect(isApiVersionCompatible('1.0.0')).toBe(false)
  })
})

describe('version display helpers', () => {
  it('formats the short and full version info', () => {
    expect(getVersionDisplay()).toBe(`v${VERSION_CONFIG.APP_VERSION}`)
    expect(getFullVersionInfo()).toEqual({
      app: VERSION_CONFIG.APP_VERSION,
      api: VERSION_CONFIG.API_VERSION,
      build: VERSION_CONFIG.BUILD_INFO,
    })
  })
})
