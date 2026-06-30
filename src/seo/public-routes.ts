import routeCatalog from './public-routes.json'

export const SITE_ORIGIN = routeCatalog.siteOrigin

export type RouteSeo = {
  title: string
  description: string
  robots?: string
}

type RouteCatalogEntry = RouteSeo & {
  path: string
  indexable?: boolean
}

const routes = routeCatalog.routes as RouteCatalogEntry[]

const byPath = Object.fromEntries(routes.map((entry) => [entry.path, entry])) as Record<
  string,
  RouteCatalogEntry
>

/** Paths that must not appear in sitemap or search indexes. */
export const NOINDEX_PATH_PREFIXES = ['/personal'] as const

export function normalizePath(path: string): string {
  const withoutHash = path.split('#')[0] ?? path
  if (withoutHash.length > 1 && withoutHash.endsWith('/')) {
    return withoutHash.slice(0, -1)
  }
  return withoutHash || '/'
}

export function isNoindexPath(path: string): boolean {
  const normalized = normalizePath(path)
  if (NOINDEX_PATH_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
    return true
  }
  const entry = byPath[normalized]
  if (!entry) return false
  return entry.indexable === false || entry.robots?.includes('noindex') === true
}

export function getRouteSeoForPath(path: string): RouteSeo | undefined {
  const entry = byPath[normalizePath(path)]
  if (!entry) return undefined
  return {
    title: entry.title,
    description: entry.description,
    robots: entry.robots,
  }
}

export function getIndexablePaths(): string[] {
  return routes
    .filter((entry) => entry.indexable !== false && !entry.robots?.includes('noindex'))
    .map((entry) => entry.path)
}

export function getIndexableRoutes(): RouteCatalogEntry[] {
  return routes.filter(
    (entry) => entry.indexable !== false && !entry.robots?.includes('noindex'),
  )
}
