<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import HomeCalc from '@/components/sections/HomeCalc.vue'
import UslugiTestExternal from '@/components/sections/uslugi/UslugiTestExternal.vue'
import UslugiTestOptical from '@/components/sections/uslugi/UslugiTestOptical.vue'
import UslugiTestEquipment from '@/components/sections/uslugi/UslugiTestEquipment.vue'

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
      <UslugiTestExternal />
      <UslugiTestOptical />
      <UslugiTestEquipment />
    </el-row>
  </div>
</template>

<style scoped>
.main-container {
  background-color: var(--bgcolor);
}
</style>
