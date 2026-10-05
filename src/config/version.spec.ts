import { afterEach, describe, expect, it, vi } from 'vitest'
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

describe('BUILD_INFO', () => {
  const buildGlobals = ['__VERSION__', '__BUILD_DATE__', '__GIT_HASH__', '__GIT_BRANCH__'] as const

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.useRealTimers()
    vi.resetModules()
  })

  it('uses build-time values when they are defined', async () => {
    vi.stubGlobal('__VERSION__', '9.9.9')
    vi.stubGlobal('__BUILD_DATE__', '2026-01-01T00:00:00.000Z')
    vi.stubGlobal('__GIT_HASH__', 'abc1234')
    vi.stubGlobal('__GIT_BRANCH__', 'release')
    vi.stubEnv('MODE', 'production')
    vi.resetModules()

    const { VERSION_CONFIG: fresh } = await import('@/config/version')
    expect(fresh.BUILD_INFO).toEqual({
      version: '9.9.9',
      buildDate: '2026-01-01T00:00:00.000Z',
      gitHash: 'abc1234',
      gitBranch: 'release',
      environment: 'production',
    })
  })

  it('falls back to defaults when build-time globals and MODE are missing', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-05T04:00:00.000Z'))
    for (const name of buildGlobals) vi.stubGlobal(name, undefined)
    vi.stubEnv('MODE', '')
    vi.resetModules()

    const { VERSION_CONFIG: fresh } = await import('@/config/version')
    expect(fresh.BUILD_INFO).toEqual({
      version: '3.0.0',
      buildDate: '2026-10-05T04:00:00.000Z',
      gitHash: 'unknown',
      gitBranch: 'unknown',
      environment: 'development',
    })
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
