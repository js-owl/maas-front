<script lang="ts" setup>
import UslugiLathe from '../components/sections/uslugi/UslugiLathe.vue'
import UslugiBending from '../components/sections/uslugi/UslugiBending.vue'
import UslugiLaser from '../components/sections/uslugi/UslugiLaser.vue'
import UslugiMilling from '../components/sections/uslugi/UslugiMilling.vue'
import UslugiTooling from '../components/sections/uslugi/UslugiTooling.vue'
</script>

<template>
  <div class="main-container">
    <el-row>
      <UslugiLathe />
      <UslugiMilling />
      <UslugiLaser />
      <UslugiBending />
      <UslugiTooling />
    </el-row>
  </div>
</template>

<style scoped>
.main-container {
  background-color: var(--bgcolor);
}
</style>
