import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

export function usePageBreakpoints() {
  const { width } = useWindowSize()
  const isMobile = computed(() => width.value < 768)
  const isTablet = computed(() => width.value >= 768 && width.value <= 1300)

  return { width, isMobile, isTablet }
}
