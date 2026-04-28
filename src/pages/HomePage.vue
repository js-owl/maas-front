<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useCoefficientsStore } from '../stores/coefficients.store'
const HomeUslugi = defineAsyncComponent(() => import('../components/sections/HomeUslugi.vue'))
const HomeAdvantages = defineAsyncComponent(() => import('../components/sections/HomeAdvantages.vue'))
const HomeCalc = defineAsyncComponent(() => import('../components/sections/HomeCalc.vue'))
const HomeMilestones = defineAsyncComponent(() => import('../components/sections/HomeMilestones.vue'))

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
const showHomeCalc = ref(true)

const coefficientsStore = useCoefficientsStore()

onMounted(() => {
  coefficientsStore.setAllCoefficients()
})
</script>

<template>
  <!-- https://www.figma.com/design/Ptb80TGgpGXXHPGVWOKhdH/MaaS?node-id=1641-91&t=wkAQmWBg5peO3d60-0 -->
  <div style="background-color: var(--bgcolor)">
    <div v-if="!isMobile">
      <el-row>
        <el-col :offset="3" :span="18">
          <!-- <HomeModel /> -->
          <HomeUslugi />
          <HomeCalc v-if="showHomeCalc" />
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
          <HomeCalc v-if="showHomeCalc" />
          <HomeMilestones />
          <!-- <HomeAbout /> -->

          <HomeAdvantages />
        </el-col>
      </el-row>
    </template>
  </div>
</template>
