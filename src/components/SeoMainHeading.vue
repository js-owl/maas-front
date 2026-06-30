<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { pageHasOwnH1, resolveRouteSeo } from '@/seo/route-meta'
import { isNoindexPath, normalizePath } from '@/seo/public-routes'

const route = useRoute()

const heading = computed(() => {
  const path = normalizePath(route.path)
  if (pageHasOwnH1(path) || path.startsWith('/personal') || isNoindexPath(path)) {
    return null
  }
  const title = resolveRouteSeo(path, route.name).title
  return title.replace(/ — Аэромакс$/, '')
})
</script>

<template>
  <h1 v-if="heading" class="seo-main-heading">{{ heading }}</h1>
</template>

<style scoped>
.seo-main-heading {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
