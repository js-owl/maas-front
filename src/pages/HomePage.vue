<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useCoefficientsStore } from '../stores/coefficients.store'
import HomeUslugi from '../components/sections/HomeUslugi.vue'
import HomeAdvantages from '../components/sections/HomeAdvantages.vue'
import HomeCalc from '../components/sections/HomeCalc.vue'
import HomeMilestones from '../components/sections/HomeMilestones.vue'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const coefficientsStore = useCoefficientsStore()

onMounted(() => {
  coefficientsStore.setAllCoefficients()
})
</script>

<template>
  <div style="background-color: var(--bgcolor)">
    <div v-if="!isMobile">
      <el-row>
        <el-col :offset="3" :span="18">
          <!-- <HomeModel /> -->
          <HomeUslugi />
          <HomeCalc />
          <HomeMilestones />
          <!-- <HomeAbout /> -->
          <HomeAdvantages />
        </el-col>
      </el-row>
    </div>
    <template v-else>
      <!-- <HomeModel /> -->
      <el-row>
        <el-col :offset="0" :span="24">
          <HomeUslugi />
          <HomeCalc />
          <HomeMilestones />
          <!-- <HomeAbout /> -->

          <HomeAdvantages />
        </el-col>
      </el-row>
    </template>
  </div>
</template>
<style scoped></style>
