<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useCoefficientsStore } from '../stores/coefficients.store'
const HomeUslugi = defineAsyncComponent(() => import('../components/sections/HomeUslugi.vue'))
const HomeAdvantages = defineAsyncComponent(
  () => import('../components/sections/HomeAdvantages.vue')
)
const HomeCalc = defineAsyncComponent(() => import('../components/sections/HomeCalc.vue'))
const HomeMilestones = defineAsyncComponent(
  () => import('../components/sections/HomeMilestones.vue')
)

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
const isTablet = computed(() => width.value >= 768 && width.value <= 1300)
const showHomeCalc = ref(true)

const coefficientsStore = useCoefficientsStore()

onMounted(() => {
  coefficientsStore.setAllCoefficients()
})
</script>

<template>
  <!-- https://www.figma.com/design/HyoggbbVUgCqJp5UR7EU8T/MaaS-DEV--Copy-?node-id=3248-1490 -->
  <div
    class="home-page"
    :class="{ 'home-page--mobile': isMobile, 'home-page--tablet': isTablet }"
  >
    <el-row :gutter="0">
      <el-col :offset="isMobile ? 0 : 3" :span="isMobile ? 24 : 18">
        <div class="home-page__sections">
          <HomeCalc v-if="showHomeCalc" />
          <HomeUslugi />
          <HomeMilestones />
          <HomeAdvantages />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.home-page {
  background-color: var(--bgcolor);
  box-sizing: border-box;
  min-width: 0;
  overflow-x: clip;
}

.home-page__sections {
  display: flex;
  flex-direction: column;
  gap: 2.5em;
  position: relative;
  z-index: 2;
  padding-top: 2.5em;
  padding-bottom: 2.5em;
  min-width: 0;
}

.home-page--tablet .home-page__sections {
  gap: 2.5em;
  padding: 2.5em;
}

.home-page__sections :deep(.calc-section),
.home-page__sections :deep(.uslugi-section2),
.home-page__sections :deep(.home-milestones),
.home-page__sections :deep(.home-advantages) {
  margin: 0 !important;
}

@media (max-width: 1300px) and (min-width: 768px) {
  .home-page :deep(.el-col) {
    max-width: 100% !important;
    flex: 0 0 100% !important;
    margin-left: 0 !important;
  }
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
