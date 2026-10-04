import { describe, expect, it } from 'vitest'
import {
  NOINDEX_PATH_PREFIXES,
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
