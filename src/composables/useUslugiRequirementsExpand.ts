import { ref } from 'vue'
import { usePageBreakpoints } from './usePageBreakpoints'

export const useUslugiRequirementsExpand = () => {
  const isRequirementsExpanded = ref(false)
  const { isMobile } = usePageBreakpoints()

  return { isRequirementsExpanded, isMobile }
}
