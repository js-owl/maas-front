import { ref } from 'vue'

/** Component names kept alive while the user is on the calculation breakdown page. */
export const cachedCalcPages = ref<string[]>([])

const ROUTE_COMPONENT: Record<string, string> = {
  other: 'CalculateOtherPage2',
  milling: 'CalculateMillingPage2',
  composite: 'CalculateCompositePage',
  galvanic: 'CalculateGalvanicPage',
  printing: 'CalculatePrintingPage2',
  'personal-calc': 'PersonalCalc',
}

const componentNameForRoute = (routeName: unknown): string | undefined => {
  if (typeof routeName !== 'string') return undefined
  return ROUTE_COMPONENT[routeName]
}

export const isCalcRouteName = (routeName: unknown): boolean =>
  componentNameForRoute(routeName) != null

export const rememberCalcPage = (routeName: unknown) => {
  const name = componentNameForRoute(routeName)
  if (!name || cachedCalcPages.value.includes(name)) return
  cachedCalcPages.value = [...cachedCalcPages.value, name]
}

export const forgetCalcPage = (routeName: unknown) => {
  const name = componentNameForRoute(routeName)
  if (!name) return
  cachedCalcPages.value = cachedCalcPages.value.filter((item) => item !== name)
}

export const clearCalcPageCache = () => {
  cachedCalcPages.value = []
}
