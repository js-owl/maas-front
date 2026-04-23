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
      <div v-if="!isMobile">
        <el-col :offset="3" :span="18">
          <HomeCalc service_id="printing" />
        </el-col>
      </div>
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
