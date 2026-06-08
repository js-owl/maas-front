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
  <!-- https://www.figma.com/design/3aK9MoWiPd2N2GC4OVNFSR/MaaS-Frontend--Copy-?node-id=4469-14269 -->
  <div class="home-page">
    <el-row v-if="!isMobile">
      <el-col :offset="3" :span="18">
        <div class="home-page__sections">
          <HomeCalc v-if="showHomeCalc" />
          <HomeUslugi />
          <HomeMilestones />
          <HomeAdvantages />
        </div>
      </el-col>
    </el-row>
    <el-row v-else>
      <el-col :offset="0" :span="24">
        <div class="home-page__sections home-page__sections--mobile">
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
}

.home-page__sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
  position: relative;
  z-index: 2;
  padding-bottom: 40px;
}

.home-page__sections :deep(.uslugi-section2.section-basic),
.home-page__sections :deep(.home-milestones),
.home-page__sections :deep(.home-advantages) {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.home-page__sections :deep(.calc-section) {
  margin-bottom: 0 !important;
}

.home-page__sections--mobile {
  margin-top: 0;
  padding-bottom: 40px;
}
</style>
