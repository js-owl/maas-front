import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  NOINDEX_PATH_PREFIXES,
  SITE_ORIGIN,
  getIndexablePaths,
  getIndexableRoutes,
  getRouteSeoForPath,
  isNoindexPath,
  normalizePath,
} from '@/seo/public-routes'
import { canonicalForPath, pageHasOwnH1, resolveRouteSeo } from '@/seo/route-meta'

describe('normalizePath', () => {
  it('strips hash and trailing slash', () => {
    expect(normalizePath('/print/#section')).toBe('/print')
    expect(normalizePath('/print/')).toBe('/print')
    expect(normalizePath('/')).toBe('/')
    expect(normalizePath('')).toBe('/')
  })
})

describe('isNoindexPath / SEO lookups', () => {
  it('treats /personal as noindex', () => {
    expect(NOINDEX_PATH_PREFIXES).toContain('/personal')
    expect(isNoindexPath('/personal/orders')).toBe(true)
  })

  it('does not treat paths missing from the catalog as noindex', () => {
    expect(isNoindexPath('/totally-unknown-path')).toBe(false)
  })

  it('returns configured SEO for known public paths', () => {
    const home = getRouteSeoForPath('/')
    expect(home?.title).toBeTruthy()
    expect(home?.description).toBeTruthy()
  })

  it('lists only indexable paths and routes', () => {
    const paths = getIndexablePaths()
    expect(paths).toContain('/')
    expect(paths.every((path) => !isNoindexPath(path))).toBe(true)
    expect(getIndexableRoutes().every((route) => paths.includes(route.path))).toBe(true)
  })
})

describe('resolveRouteSeo', () => {
  it('uses dedicated SEO for not-found and personal cabinet', () => {
    expect(resolveRouteSeo('/anything', 'not-found').robots).toContain('noindex')
    expect(resolveRouteSeo('/personal/profile', 'personal-profile').title).toContain('кабинет')
  })

  it('returns catalog SEO for configured public routes', () => {
    const seo = resolveRouteSeo('/mechanical', 'uslugi-mech')
    expect(seo.title).toBeTruthy()
    expect(seo.robots ?? '').not.toContain('noindex')
  })

  it('falls back to default public SEO for unknown public paths', () => {
    const seo = resolveRouteSeo('/totally-unknown-path', 'unknown')
    expect(seo.title).toContain('Производство')
  })
})

describe('pageHasOwnH1 / canonicalForPath', () => {
  it('recognizes pages that render their own H1', () => {
    expect(pageHasOwnH1('/')).toBe(true)
    expect(pageHasOwnH1('/mechanical')).toBe(true)
    expect(pageHasOwnH1('/personal')).toBe(false)
  })

  it('builds an absolute canonical URL', () => {
    // Vitest runs with Vite in development mode, so origin comes from window.
    expect(canonicalForPath('/')).toMatch(/\/$/)
    expect(canonicalForPath('/print')).toMatch(/\/print$/)
  })
})

describe('canonicalForPath environment handling', () => {
  const origin = window.location.origin

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('uses the window origin and root base in development', () => {
    vi.stubEnv('BASE_URL', '/')
    expect(canonicalForPath('/')).toBe(`${origin}/`)
    expect(canonicalForPath('/print/#top')).toBe(`${origin}/print`)
  })

  it('uses the public site origin in production', () => {
    vi.stubEnv('PROD', true)
    vi.stubEnv('BASE_URL', '/')
    expect(canonicalForPath('/')).toBe(`${SITE_ORIGIN}/`)
    expect(canonicalForPath('/print')).toBe(`${SITE_ORIGIN}/print`)
  })

  it('treats an empty BASE_URL as root', () => {
    vi.stubEnv('BASE_URL', '')
    expect(canonicalForPath('/print')).toBe(`${origin}/print`)
  })

  it('prefixes a subpath base with or without a trailing slash', () => {
    vi.stubEnv('BASE_URL', '/site-dev/')
    expect(canonicalForPath('/')).toBe(`${origin}/site-dev/`)
    expect(canonicalForPath('/print')).toBe(`${origin}/site-dev/print`)

    vi.stubEnv('BASE_URL', '/site-dev')
    expect(canonicalForPath('/')).toBe(`${origin}/site-dev/`)
    expect(canonicalForPath('/print/')).toBe(`${origin}/site-dev/print`)
  })
})

describe('resolveRouteSeo diagnostics', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('warns about unknown paths only in development', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    vi.stubEnv('DEV', true)
    resolveRouteSeo('/no-such-page/', 'unknown')
    expect(warn).toHaveBeenCalledWith('[seo] No metadata for path: /no-such-page')

    warn.mockClear()
    vi.stubEnv('DEV', false)
    expect(resolveRouteSeo('/no-such-page', 'unknown').robots).toBeUndefined()
    expect(warn).not.toHaveBeenCalled()
  })

  it('returns the catalog entry, including robots, for noindex catalog pages', () => {
    expect(isNoindexPath('/confirm-email')).toBe(true)
    expect(resolveRouteSeo('/confirm-email', 'confirm-email').robots).toBe('noindex, nofollow')
    expect(getIndexablePaths()).not.toContain('/confirm-email')
  })
})
