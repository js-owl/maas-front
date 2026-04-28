<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import UpperMenu from './components/UpperMenu.vue'
import Footer from './components/Footer.vue'
import { canonicalForPath, resolveRouteSeo } from './seo/route-meta'

const route = useRoute()
const showConsentBanner = ref(false)

const seoHead = computed(() => {
  const seo = resolveRouteSeo(route.path, route.name)
  const canonical = canonicalForPath(route.path)
  const robots = seo.robots ?? 'index, follow'
  return {
    title: seo.title,
    meta: [
      { name: 'description', content: seo.description },
      { name: 'robots', content: robots },
      { property: 'og:title', content: seo.title },
      { property: 'og:description', content: seo.description },
      { property: 'og:url', content: canonical },
    ],
    link: [{ rel: 'canonical' as const, href: canonical }],
  }
})

useHead(seoHead)

declare global {
  interface Window {
    __grantAnalyticsConsent?: () => void
  }
}

function hasStoredConsentDecision() {
  try {
    const keys = ['analytics_consent', 'cookie_consent_analytics', 'ym_consent']
    return keys.some((key) => localStorage.getItem(key) !== null)
  } catch {
    return false
  }
}

function acceptAnalytics() {
  try {
    localStorage.setItem('analytics_consent', 'true')
  } catch {
    // ignore storage errors in privacy modes
  }
  showConsentBanner.value = false
  window.__grantAnalyticsConsent?.()
  window.dispatchEvent(new Event('analytics-consent-granted'))
}

function rejectAnalytics() {
  try {
    localStorage.setItem('analytics_consent', 'false')
  } catch {
    // ignore storage errors in privacy modes
  }
  showConsentBanner.value = false
}

onMounted(() => {
  showConsentBanner.value = !hasStoredConsentDecision()
})
</script>

<template>
  <UpperMenu />
  <main id="main-content" role="main">
    <RouterView />
  </main>
  <Footer />
  <div v-if="showConsentBanner" class="consent-banner" role="dialog" aria-live="polite">
    <div class="consent-banner__content">
      <p class="consent-banner__text">
        Мы используем cookie для сбора анонимной аналитики и улучшения сервиса.
      </p>
      <div class="consent-banner__actions">
        <button class="consent-banner__btn consent-banner__btn--primary" @click="acceptAnalytics">
          Принять
        </button>
        <button class="consent-banner__btn consent-banner__btn--ghost" @click="rejectAnalytics">
          Отклонить
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.consent-banner {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 16px;
  z-index: 5000;
}

.consent-banner__content {
  margin: 0 auto;
  max-width: 1080px;
  background: #1e2430;
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.consent-banner__text {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  font-family: 'Montserrat-Medium', sans-serif;
}

.consent-banner__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.consent-banner__btn {
  border: 1px solid transparent;
  border-radius: 8px;
  height: 36px;
  padding: 0 14px;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Montserrat-Medium', sans-serif;
}

.consent-banner__btn--primary {
  background: #be2a44;
  color: #fff;
}

.consent-banner__btn--ghost {
  background: transparent;
  border-color: #a4adbc;
  color: #fff;
}

@media (max-width: 767px) {
  .consent-banner__content {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
