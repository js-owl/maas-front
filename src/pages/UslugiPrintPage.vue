<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import HomeCalc from '@/components/sections/HomeCalc.vue'
import UslugiPrint from '@/components/sections/uslugi/UslugiPrint.vue'
import UslugiPrintExample from '@/components/sections/uslugi/UslugiPrintExample.vue'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
</script>

<template>
  <div class="main-container">
    <el-row>
      <el-col v-if="!isMobile" :offset="3" :span="18">
        <HomeCalc service_id="printing" />
      </el-col>
      <UslugiPrint />
      <UslugiPrintExample />
    </el-row>
  </div>
</template>

<style scoped>
.main-container {
  background-color: var(--bgcolor);
}
</style>
