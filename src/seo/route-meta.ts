import {
  SITE_ORIGIN,
  getRouteSeoForPath,
  isNoindexPath,
  normalizePath,
  type RouteSeo,
} from './public-routes'

export { SITE_ORIGIN, normalizePath, type RouteSeo }

const personalSeo: RouteSeo = {
  title: 'Личный кабинет — Аэромакс',
  description: 'Управление заказами, расчётами и профилем в сервисе MaaS.',
  robots: 'noindex, nofollow',
}

const notFoundSeo: RouteSeo = {
  title: 'Страница не найдена — Аэромакс',
  description: 'Запрошенная страница отсутствует. Вернитесь на главную или выберите раздел в меню.',
  robots: 'noindex, nofollow',
}

const defaultPublicSeo: RouteSeo = {
  title: 'Производство на заказ — Аэромакс',
  description:
    'Manufacturing as a Service: услуги производства на заказ, онлайн-расчёт и сопровождение заказов.',
}

const pagesWithOwnH1 = new Set(['/', '/license', '/offer-client', '/policy'])

export function pageHasOwnH1(path: string): boolean {
  return pagesWithOwnH1.has(normalizePath(path))
}

export function resolveRouteSeo(path: string, routeName: string | symbol | undefined | null): RouteSeo {
  const normalized = normalizePath(path)

  if (routeName === 'not-found') {
    return notFoundSeo
  }
  if (normalized.startsWith('/personal')) {
    return personalSeo
  }

  const configured = getRouteSeoForPath(normalized)
  if (configured) {
    return configured
  }

  if (import.meta.env.DEV) {
    console.warn(`[seo] No metadata for path: ${normalized}`)
  }

  if (isNoindexPath(normalized)) {
    return notFoundSeo
  }

  return defaultPublicSeo
}

/** Абсолютный canonical для текущего маршрута (учёт BASE_URL в dev/subpath). */
export function canonicalForPath(path: string): string {
  const normalized = normalizePath(path)
  const origin =
    import.meta.env.PROD || typeof window === 'undefined' ? SITE_ORIGIN : window.location.origin

  const rawBase = import.meta.env.BASE_URL || '/'
  const base =
    rawBase === '/' ? '' : rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase

  if (!base) {
    return normalized === '/' ? `${origin}/` : `${origin}${normalized}`
  }
  return normalized === '/' ? `${origin}${base}/` : `${origin}${base}${normalized}`
}
