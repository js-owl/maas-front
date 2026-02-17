<script lang="ts" setup>
import UslugiPKM from '@/components/sections/uslugi/UslugiPKM.vue'
import UslugiExternal from '@/components/sections/uslugi/UslugiExternal.vue'
</script>

<template>
  <div class="main-container">
    <el-row>
      <UslugiPKM />
    </el-row>
    <el-row>
      <UslugiExternal />
    </el-row>
  </div>
</template>

<style scoped>
.main-container {
  background-color: var(--bgcolor);
}
</style>
