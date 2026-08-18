<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useCoefficientsStore } from '../stores/coefficients.store'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'

const HomeUslugi = defineAsyncComponent(() => import('../components/sections/HomeUslugi.vue'))
const HomeAdvantages = defineAsyncComponent(
  () => import('../components/sections/HomeAdvantages.vue')
)
const HomeCalc = defineAsyncComponent(() => import('../components/sections/HomeCalc.vue'))
const HomeMilestones = defineAsyncComponent(
  () => import('../components/sections/HomeMilestones.vue')
)

const { isMobile, isTablet } = usePageBreakpoints()
const showHomeCalc = ref(true)

const coefficientsStore = useCoefficientsStore()

onMounted(() => {
  coefficientsStore.setAllCoefficients()
})
</script>

<template>
  <!-- https://www.figma.com/design/HyoggbbVUgCqJp5UR7EU8T/MaaS-DEV--Copy-?node-id=3248-1490 -->
  <div
    class="home-page content-page"
    :class="{
      'content-page--mobile': isMobile,
      'content-page--tablet': isTablet,
      'home-page--mobile': isMobile,
    }"
  >
    <el-row :gutter="0">
      <el-col :offset="isMobile ? 0 : 3" :span="isMobile ? 24 : 18">
        <div class="home-page__sections">
          <HomeCalc v-if="showHomeCalc" />
          <HomeUslugi />
          <HomeAdvantages />
          <HomeMilestones />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.home-page {
  overflow-x: clip;
}

.home-page__sections {
  display: flex;
  flex-direction: column;
  gap: 2.5em;
  position: relative;
  z-index: 2;
  min-width: 0;
}

.home-page__sections :deep(.calc-section),
.home-page__sections :deep(.uslugi-section2),
.home-page__sections :deep(.home-milestones),
.home-page__sections :deep(.home-advantages) {
  margin: 0 !important;
}

@media (max-width: 767px) {
  .home-page--mobile .home-page__sections {
    gap: 12px;
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 32px 10px 40px;
    box-sizing: border-box;
  }
}
</style>
