<script lang="ts" setup>
import UslugiPKM from '@/components/sections/uslugi/UslugiPKM.vue'
import UslugiExternal from '@/components/sections/uslugi/UslugiExternal.vue'
import UslugiOptical from '@/components/sections/uslugi/UslugiOptical.vue'
</script>

<template>
  <div class="main-container">
    <el-row>
      <UslugiExternal />
      <UslugiOptical />
    </el-row>
  </div>
</template>

<style scoped>
.main-container {
  background-color: var(--bgcolor);
}
</style>
