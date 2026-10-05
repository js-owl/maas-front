import { describe, expect, it, vi } from 'vitest'
import App from '@/App.vue'
import { mountWithPlugins } from '@/test/mount'

const stubs = {
  UpperMenu: { template: '<header class="stub-menu" />' },
  Footer: { template: '<footer class="stub-footer" />' },
  SeoMainHeading: { template: '<h1 class="stub-seo" />' },
}

describe('App.vue', () => {
  it('shows consent banner when no prior decision exists', async () => {
    const { wrapper } = await mountWithPlugins(App, { stubs })
    expect(wrapper.find('.consent-banner').isVisible()).toBe(true)
    expect(wrapper.find('#main-content').classes()).toContain('main-content--consent-pad')
  })

  it('hides consent banner when a decision is already stored', async () => {
    localStorage.setItem('analytics_consent', 'true')
    const { wrapper } = await mountWithPlugins(App, { stubs })
    expect(wrapper.find('.consent-banner').isVisible()).toBe(false)
  })

  it('accept stores consent and notifies listeners', async () => {
    const grant = vi.fn()
    window.__grantAnalyticsConsent = grant
    const granted = vi.fn()
    window.addEventListener('analytics-consent-granted', granted)

    const { wrapper } = await mountWithPlugins(App, { stubs })
    await wrapper.find('.consent-banner__btn--primary').trigger('click')

    expect(localStorage.getItem('analytics_consent')).toBe('true')
    expect(wrapper.find('.consent-banner').isVisible()).toBe(false)
    expect(grant).toHaveBeenCalled()
    expect(granted).toHaveBeenCalled()

    window.removeEventListener('analytics-consent-granted', granted)
    delete window.__grantAnalyticsConsent
  })

  it('shows the banner and still handles clicks when storage is unavailable', async () => {
    const blocked = () => {
      throw new DOMException('denied', 'SecurityError')
    }
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(blocked)
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(blocked)

    try {
      const { wrapper } = await mountWithPlugins(App, { stubs })
      expect(getItem).toHaveBeenCalled()
      // jsdom caches computed style, so a second isVisible() on the same node can be stale.
      expect(wrapper.find('.consent-banner').attributes('style') ?? '').not.toContain('none')

      await wrapper.find('.consent-banner__btn--ghost').trigger('click')
      expect(setItem).toHaveBeenCalledWith('analytics_consent', 'false')
      expect(wrapper.find('.consent-banner').isVisible()).toBe(false)

      const second = await mountWithPlugins(App, { stubs })
      await second.wrapper.find('.consent-banner__btn--primary').trigger('click')
      expect(setItem).toHaveBeenCalledWith('analytics_consent', 'true')
      expect(second.wrapper.find('.consent-banner').isVisible()).toBe(false)
    } finally {
      getItem.mockRestore()
      setItem.mockRestore()
    }
  })

  it('reject stores a negative decision', async () => {
    const { wrapper } = await mountWithPlugins(App, { stubs })
    await wrapper.find('.consent-banner__btn--ghost').trigger('click')
    expect(localStorage.getItem('analytics_consent')).toBe('false')
    expect(wrapper.find('.consent-banner').isVisible()).toBe(false)
  })
})
