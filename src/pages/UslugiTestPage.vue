<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import HomeCalc from '@/components/sections/HomeCalc.vue'
import UslugiExternal from '@/components/sections/uslugi/UslugiExternal.vue'
import UslugiOptical from '@/components/sections/uslugi/UslugiOptical.vue'
import UslugiEquipment from '@/components/sections/uslugi/UslugiEquipment.vue'

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
      <UslugiExternal />
      <UslugiOptical />
      <UslugiEquipment />
    </el-row>
  </div>
</template>

<style scoped>
.main-container {
  background-color: var(--bgcolor);
}
</style>
