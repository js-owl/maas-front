<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import UpperMenu from './components/UpperMenu.vue'
import Footer from './components/Footer.vue'
import { canonicalForPath, resolveRouteSeo } from './seo/route-meta'

const route = useRoute()

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
</script>

<template>
  <UpperMenu />
  <RouterView />
  <Footer />
</template>
