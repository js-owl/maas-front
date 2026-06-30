<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import UpperMenu from './components/UpperMenu.vue'
import Footer from './components/Footer.vue'
import SeoMainHeading from './components/SeoMainHeading.vue'
import { canonicalForPath, resolveRouteSeo } from './seo/route-meta'
import { SITE_ORIGIN } from './seo/public-routes'

const route = useRoute()
const consentBannerVisible = ref(false)
const showConsentBanner = computed(() => consentBannerVisible.value)

const ogImage = `${SITE_ORIGIN}/favicon/favicon.svg`

const seoHead = computed(() => {
  const seo = resolveRouteSeo(route.path, route.name)
  const canonical = canonicalForPath(route.path)
  const robots = seo.robots ?? 'index, follow'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'ООО «Аэромакс»',
        url: SITE_ORIGIN,
        logo: ogImage,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+7-495-921-42-42',
          contactType: 'customer service',
          email: 'info@aeromax-group.ru',
          availableLanguage: 'Russian',
        },
      },
      {
        '@type': 'WebSite',
        name: 'Аэромакс MaaS',
        url: SITE_ORIGIN,
        inLanguage: 'ru-RU',
      },
    ],
  }

  return {
    title: seo.title,
    meta: [
      { name: 'description', content: seo.description },
      { name: 'robots', content: robots },
      { property: 'og:title', content: seo.title },
      { property: 'og:description', content: seo.description },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: ogImage },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: seo.title },
      { name: 'twitter:description', content: seo.description },
      { name: 'twitter:image', content: ogImage },
    ],
    link: [{ rel: 'canonical' as const, href: canonical }],
    script: [
      {
        type: 'application/ld+json' as const,
        innerHTML: JSON.stringify(jsonLd),
      },
    ],
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
  consentBannerVisible.value = false
  window.__grantAnalyticsConsent?.()
  window.dispatchEvent(new Event('analytics-consent-granted'))
}

function rejectAnalytics() {
  try {
    localStorage.setItem('analytics_consent', 'false')
  } catch {
    // ignore storage errors in privacy modes
  }
  consentBannerVisible.value = false
}

onMounted(() => {
  consentBannerVisible.value = !hasStoredConsentDecision()
})
</script>

<template>
  <UpperMenu />
  <main
    id="main-content"
    role="main"
    :class="{ 'main-content--consent-pad': showConsentBanner }"
  >
    <SeoMainHeading />
    <RouterView />
  </main>
  <Footer />
  <div
    v-show="showConsentBanner"
    class="consent-banner"
    role="dialog"
    aria-modal="true"
    aria-labelledby="consent-title"
    aria-live="polite"
  >
    <div class="consent-banner__content">
      <div class="consent-banner__body">
        <h2 id="consent-title" class="consent-banner__title">Согласие на использование cookie</h2>
        <p class="consent-banner__text">
          Мы используем cookie для сбора анонимной аналитики и улучшения сервиса.
        </p>
      </div>
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
.main-content--consent-pad {
  padding-bottom: 96px;
}

@media (max-width: 767px) {
  .main-content--consent-pad {
    padding-bottom: 140px;
  }
}

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

.consent-banner__body {
  flex: 1;
  min-width: 0;
}

.consent-banner__title {
  margin: 0;
  font-size: 16px;
  line-height: 1.3;
  font-family: 'Montserrat-SemiBold', sans-serif;
}

.consent-banner__text {
  margin: 6px 0 0;
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

  .consent-banner__title {
    font-size: 15px;
  }
}
</style>
