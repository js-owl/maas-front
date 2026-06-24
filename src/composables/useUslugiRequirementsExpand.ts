import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'

export const useUslugiRequirementsExpand = () => {
  const isRequirementsExpanded = ref(false)
  const { width } = useWindowSize()
  const isMobile = computed(() => width.value < 768)

  return { isRequirementsExpanded, isMobile }
}
