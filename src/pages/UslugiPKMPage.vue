<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import HomeCalc from '@/components/sections/HomeCalc.vue'
import UslugiPKM from '@/components/sections/uslugi/UslugiPKM.vue'
import UslugiPKMAdvantages from '@/components/sections/uslugi/UslugiPKMAdvantages.vue'
import UslugiPKMExample from '@/components/sections/uslugi/UslugiPKMExample.vue'

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
      <UslugiPKM />
      <UslugiPKMAdvantages />
      <UslugiPKMExample />
    </el-row>
  </div>
</template>

<style scoped>
.main-container {
  background-color: var(--bgcolor);
}
</style>
