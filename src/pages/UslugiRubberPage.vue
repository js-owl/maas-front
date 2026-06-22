<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiRubber from '@/components/sections/uslugi/UslugiRubber.vue'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
</script>

<template>
  <div class="main-container">
    <el-row>
      <el-col v-if="!isMobile" :offset="3" :span="18">
        <UslugiCalc service_id="other" />
      </el-col>
      <UslugiRubber />
    </el-row>
  </div>
</template>

<style scoped>
.main-container {
  background-color: var(--bgcolor);
}
</style>


