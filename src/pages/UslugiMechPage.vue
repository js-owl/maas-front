<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import UslugiLathe from '../components/sections/uslugi/UslugiLathe.vue'
import UslugiBending from '../components/sections/uslugi/UslugiBending.vue'
// import UslugiLaser from '../components/sections/uslugi/UslugiLaser.vue'
import UslugiMilling from '../components/sections/uslugi/UslugiMilling.vue'
import UslugiTooling from '../components/sections/uslugi/UslugiTooling.vue'
import UslugiGrinding from '../components/sections/uslugi/UslugiGrinding.vue'
import HomeCalc from '../components/sections/HomeCalc.vue'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
</script>

<template>
  <div class="main-container">

    <el-row>
      <div v-if="!isMobile">
        <el-col :offset="3" :span="18">
          <HomeCalc />
        </el-col>
      </div>
      <!-- <template v-else>
        <el-col :offset="0" :span="24">
          <HomeCalc />
        </el-col>
      </template> -->

      <UslugiLathe />
      <UslugiMilling />
      <!-- <UslugiLaser /> -->
      <UslugiBending />
      <UslugiTooling />
      <UslugiGrinding />
    </el-row>
  </div>
</template>

<style scoped>
.main-container {
  background-color: var(--bgcolor);
}
</style>
