import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

export const MOBILE_MAX_WIDTH = 768
export const TABLET_MAX_WIDTH = 1300

export function usePageBreakpoints() {
  const { width } = useWindowSize()
  const isMobile = computed(() => width.value <= MOBILE_MAX_WIDTH)
  const isTablet = computed(
    () => width.value > MOBILE_MAX_WIDTH && width.value <= TABLET_MAX_WIDTH
  )

  return { width, isMobile, isTablet }
}
