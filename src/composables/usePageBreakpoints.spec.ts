import { describe, expect, it } from 'vitest'
import { usePageBreakpoints, MOBILE_MAX_WIDTH, TABLET_MAX_WIDTH } from '@/composables/usePageBreakpoints'
import { useUslugiRequirementsExpand } from '@/composables/useUslugiRequirementsExpand'

describe('usePageBreakpoints', () => {
  it('exports the layout thresholds used across pages', () => {
    expect(MOBILE_MAX_WIDTH).toBe(768)
    expect(TABLET_MAX_WIDTH).toBe(1300)
  })

  it('marks mobile when the window is at or below 768px', () => {
    window.innerWidth = 375
    const { isMobile, isTablet } = usePageBreakpoints()
    expect(isMobile.value).toBe(true)
    expect(isTablet.value).toBe(false)
  })

  it('marks tablet between mobile and desktop thresholds', () => {
    window.innerWidth = 1024
    const { isMobile, isTablet } = usePageBreakpoints()
    expect(isMobile.value).toBe(false)
    expect(isTablet.value).toBe(true)
  })

  it('marks desktop above the tablet threshold', () => {
    window.innerWidth = 1620
    const { isMobile, isTablet } = usePageBreakpoints()
    expect(isMobile.value).toBe(false)
    expect(isTablet.value).toBe(false)
  })
})

describe('useUslugiRequirementsExpand', () => {
  it('starts collapsed and reuses the page breakpoints', () => {
    window.innerWidth = 375
    const { isRequirementsExpanded, isMobile } = useUslugiRequirementsExpand()
    expect(isRequirementsExpanded.value).toBe(false)
    expect(isMobile.value).toBe(true)

    isRequirementsExpanded.value = true
    expect(isRequirementsExpanded.value).toBe(true)
  })
})
