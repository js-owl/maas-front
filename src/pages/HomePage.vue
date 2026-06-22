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
const showHomeCalc = ref(true)

const coefficientsStore = useCoefficientsStore()

onMounted(() => {
  coefficientsStore.setAllCoefficients()
})
</script>

<template>
  <!-- https://www.figma.com/design/HyoggbbVUgCqJp5UR7EU8T/MaaS-DEV--Copy-?node-id=3248-1490 -->
  <div class="home-page" :class="{ 'home-page--mobile': isMobile }">
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
}

.home-page__sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
  position: relative;
  z-index: 2;
  padding-top: 40px;
  padding-bottom: 40px;
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
